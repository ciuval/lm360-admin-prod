/**
 * LoveMatch360 — Gate 2.1C: Postgres Changes Realtime in Docker LAB only.
 * Three fresh synthetic accounts: two matched participants and one outsider.
 * Checks live INSERT/UPDATE delivery and RLS after unilateral revocation.
 * NEVER print UUID, emails, JWTs, passwords, providers' errors or message text.
 * No schema change, no cloud, no Stripe. Run only through the guarded PS runner.
 */
import { randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { assertLocalE2eUrl } from '../src/lib/localE2eSafety.js';
import { persistProfile } from '../src/lib/persistProfile.js';

if (process.env.LM360_GATE21_LOCAL_GUARD !== 'YES' ||
    process.env.LM360_REALTIME_LOCAL_GUARD !== 'YES') {
  throw new Error('LOCAL_GUARD_REQUIRED');
}
const rawUrl = process.env.LM360_LOCAL_SUPABASE_URL;
if (rawUrl !== 'http://127.0.0.1:54321') throw new Error('WRONG_LOCAL_ENDPOINT');
const url = assertLocalE2eUrl(rawUrl);
const anonKey = process.env.LM360_LOCAL_SUPABASE_ANON_KEY;
const serviceKey = process.env.LM360_LOCAL_SUPABASE_SERVICE_ROLE_KEY;
if (!anonKey || !serviceKey) throw new Error('LOCAL_KEYS_REQUIRED');

const clientOptions = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
};
const makeClient = (key) => createClient(url, key, clientOptions);
const admin = makeClient(serviceKey);
const actors = [];
const createdIds = [];
const activeChannels = [];
const qualities = ['affettuoso', 'affidabile', 'calmo', 'rispettoso', 'sincero'];
const room = {
  qualities_offered: qualities,
  qualities_sought: qualities,
  imperfections: [],
  imperfections_accepted: [],
};
let phase = 'PREFLIGHT';

const ok = (condition, code) => { if (!condition) throw new Error(code); };
const getData = (result, code) => {
  if (result?.error) throw new Error(code);
  return result?.data;
};
const pass = (code) => process.stdout.write(`PASS ${code}\n`);
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function until(predicate, code, timeoutMs = 10000) {
  const stopAt = Date.now() + timeoutMs;
  do {
    if (predicate()) return;
    await delay(75);
  } while (Date.now() < stopAt);
  throw new Error(code);
}

async function makeActor(code) {
  const client = makeClient(anonKey);
  actors.push(client);
  const email = `gate21c-${code}-${randomBytes(12).toString('hex')}@example.test`;
  const password = `LM360!gate21c-${randomBytes(24).toString('hex')}`;
  const signedUp = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        adult_attested: true,
        privacy_acknowledged: true,
        source: 'local_synthetic_gate21c',
      },
    },
  });
  const userId = signedUp.data?.user?.id;
  if (userId) createdIds.push(userId);
  getData(signedUp, 'LOCAL_SIGNUP_FAILED');
  ok(Boolean(userId), 'LOCAL_SIGNUP_ID_MISSING');
  if (!signedUp.data.session) {
    getData(await admin.auth.admin.updateUserById(userId, { email_confirm: true }),
      'LOCAL_CONFIRM_FAILED');
    getData(await client.auth.signInWithPassword({ email, password }),
      'LOCAL_LOGIN_FAILED');
  }
  const identity = getData(await client.auth.getUser(), 'LOCAL_IDENTITY_FAILED');
  ok(identity?.user?.id === userId, 'LOCAL_IDENTITY_MISMATCH');
  return { id: userId, client, email };
}

async function preparePair(a, b) {
  for (const actor of [a, b]) {
    const existing = getData(await actor.client.from('profili')
      .select('id').eq('id', actor.id).maybeSingle(), 'PROFILE_PREFLIGHT_FAILED');
    const saved = await persistProfile(actor.client, {
      userId: actor.id,
      profileExists: Boolean(existing),
      email: actor.email,
      name: 'Persona sintetica Gate 2.1C',
      bio: 'Profilo sintetico per collaudo Realtime locale.',
      interests: 'arte, lettura',
      photoUrl: null,
    });
    ok(saved?.id === actor.id, 'PROFILE_SETUP_FAILED');
    getData(await actor.client.from('stanze_360').upsert({
      user_id: actor.id,
      ...room,
    }, { onConflict: 'user_id' }), 'ROOM_SETUP_FAILED');
  }
  getData(await a.client.from('likes').insert({
    user_id: a.id, user_from: a.id, user_to: b.id,
  }), 'LIKE_A_FAILED');
  getData(await b.client.from('likes').insert({
    user_id: b.id, user_from: b.id, user_to: a.id,
  }), 'LIKE_B_FAILED');
  const allowedA = getData(await a.client.rpc('can_open_stanza', {
    target_user_id: b.id,
  }), 'BEFORE_ROOM_A_FAILED');
  const allowedB = getData(await b.client.rpc('can_open_stanza', {
    target_user_id: a.id,
  }), 'BEFORE_ROOM_B_FAILED');
  ok(allowedA === true && allowedB === true, 'BEFORE_ROOM_NOT_OPEN');
}

async function subscribe(actor, code, handler, filter) {
  const auth = getData(await actor.client.auth.getSession(), 'SESSION_CHECK_FAILED');
  ok(Boolean(auth?.session?.access_token) && auth.session.user?.id === actor.id,
    'AUTH_SESSION_INVALID');
  await actor.client.realtime.setAuth(auth.session.access_token);
  const name = `gate21c-${code}-${randomBytes(6).toString('hex')}`;
  const channel = actor.client.channel(name)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'messaggi',
      ...(filter ? { filter } : {}),
    }, handler);
  activeChannels.push({ client: actor.client, channel });

  await new Promise((resolve, reject) => {
    let finished = false;
    let joined = false;
    let postgresReady = false;

    const timeout = setTimeout(
      () => finish(new Error('REALTIME_BACKEND_READY_TIMEOUT')),
      20000
    );

    function finish(error) {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      if (error) reject(error); else resolve();
    }

    channel.on('system', '*', (payload) => {
      if (payload?.extension !== 'postgres_changes') return;

      if (payload?.status === 'ok') {
        postgresReady = true;
        if (joined) finish();
      } else if (
        payload?.status === 'error' ||
        payload?.status === 'timeout'
      ) {
        finish(new Error('REALTIME_BACKEND_SUBSCRIPTION_FAILED'));
      }
    });

    try {
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          joined = true;
          if (postgresReady) finish();
        }

        if (
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT' ||
          status === 'CLOSED'
        ) {
          finish(new Error('REALTIME_SUBSCRIBE_FAILED'));
        }
      });
    } catch {
      finish(new Error('REALTIME_SUBSCRIBE_FAILED'));
    }
  });
}

async function run() {
  for (const name of ['profili', 'likes', 'match_scores', 'messaggi', 'stanze_360']) {
    getData(await admin.from(name).select('*', { count: 'exact', head: true }),
      'LOCAL_SCHEMA_MISSING');
  }
  pass('GATE21C_LOCAL_PREFLIGHT');

  phase = 'SYNTHETIC_ACCOUNTS';
  const a = await makeActor('a');
  const b = await makeActor('b');
  const outsider = await makeActor('outsider');
  await preparePair(a, b);
  pass('GATE21C_SYNTHETIC_MATCH_READY');

  phase = 'REALTIME_SUBSCRIBE';
  const bInsertIds = new Set();
  let bUpdateCount = 0;
  let outsiderEvents = 0;
  let insertedId = null;
  await subscribe(b, 'receiver', (payload) => {
    const next = payload?.new;
    if (payload?.eventType === 'INSERT' &&
        next?.mittente_id === a.id && next?.destinatario_id === b.id && next.id) {
      bInsertIds.add(next.id);
    }
    if (payload?.eventType === 'UPDATE' && next?.id === insertedId) {
      bUpdateCount += 1;
    }
  }, `destinatario_id=eq.${b.id}`);
  await subscribe(outsider, 'outsider', (payload) => {
    // Never read or print payload text. Any visible message is a privacy failure.
    if (payload?.new?.id) outsiderEvents += 1;
  });
  pass('GATE21C_REALTIME_SUBSCRIBED');

  phase = 'AUTHORIZED_INSERT';
  const sent = getData(await a.client.rpc('send_stanza_message', {
    target_user_id: b.id,
    message_content: 'Messaggio sintetico per verifica Realtime locale',
  }), 'AUTHORIZED_SEND_FAILED');
  ok(sent === true, 'AUTHORIZED_SEND_NOT_CONFIRMED');
  const rows = getData(await b.client.from('messaggi').select('id')
    .eq('mittente_id', a.id).eq('destinatario_id', b.id), 'AUTHORIZED_READ_FAILED');
  ok(rows?.length === 1 && Boolean(rows[0]?.id), 'AUTHORIZED_MESSAGE_MISSING');
  insertedId = rows[0].id;
  await until(() => bInsertIds.has(insertedId), 'REALTIME_INSERT_NOT_RECEIVED');
  ok(bInsertIds.size === 1, 'REALTIME_INSERT_DUPLICATE');
  pass('GATE21C_REALTIME_INSERT_RECEIVED');

  phase = 'AUTHORIZED_UPDATE';
  const beforeUpdate = getData(await admin.from('messaggi')
    .update({ letto: true }).eq('id', insertedId).select('id'), 'LOCAL_UPDATE_FAILED');
  ok(beforeUpdate?.length === 1, 'LOCAL_UPDATE_NOT_CONFIRMED');
  await until(() => bUpdateCount >= 1, 'REALTIME_UPDATE_NOT_RECEIVED');
  await delay(1200);
  ok(bUpdateCount === 1, 'REALTIME_UPDATE_DUPLICATE');
  ok(outsiderEvents === 0, 'OUTSIDER_REALTIME_LEAK');
  pass('GATE21C_VALID_EVENTS_NOT_VISIBLE_TO_OUTSIDER');

  phase = 'REVOCATION';
  const deleted = getData(await a.client.from('likes').delete()
    .eq('user_id', a.id).eq('user_to', b.id).select('id'), 'REVOKE_LIKE_FAILED');
  ok(deleted?.length === 1, 'REVOKE_NOT_CONFIRMED');
  const openA = getData(await a.client.rpc('can_open_stanza', {
    target_user_id: b.id,
  }), 'AFTER_OPEN_A_ERROR');
  const openB = getData(await b.client.rpc('can_open_stanza', {
    target_user_id: a.id,
  }), 'AFTER_OPEN_B_ERROR');
  ok(openA === false && openB === false, 'ROOM_REOPENED_AFTER_REVOCATION');
  const sendA = getData(await a.client.rpc('send_stanza_message', {
    target_user_id: b.id, message_content: 'Sintetico: non inviare dopo revoca',
  }), 'AFTER_SEND_A_ERROR');
  const sendB = getData(await b.client.rpc('send_stanza_message', {
    target_user_id: a.id, message_content: 'Sintetico: non inviare dopo revoca',
  }), 'AFTER_SEND_B_ERROR');
  ok(sendA === false && sendB === false, 'SEND_ALLOWED_AFTER_REVOCATION');
  const readA = getData(await a.client.from('messaggi').select('id')
    .eq('id', insertedId), 'AFTER_READ_A_ERROR');
  const readB = getData(await b.client.from('messaggi').select('id')
    .eq('id', insertedId), 'AFTER_READ_B_ERROR');
  ok(readA?.length === 0 && readB?.length === 0, 'HISTORY_READABLE_AFTER_REVOCATION');
  pass('GATE21C_REVOCATION_API_DENIED');

  phase = 'REALTIME_AFTER_REVOCATION';
  const updatesBefore = bUpdateCount;
  // Force a genuine DB change on the SAME synthetic row with service role.
  // The participant's JWT must NOT receive it after match revocation.
  const changed = getData(await admin.from('messaggi')
    .update({ letto: false }).eq('id', insertedId).select('id'),
    'AFTER_REVOCATION_SYNTHETIC_UPDATE_FAILED');
  ok(changed?.length === 1, 'AFTER_REVOCATION_UPDATE_NOT_CONFIRMED');
  await delay(2000);
  ok(bUpdateCount === updatesBefore, 'REVOKED_REALTIME_EVENT_LEAK');
  ok(outsiderEvents === 0, 'OUTSIDER_REALTIME_LEAK');
  pass('GATE21C_REVOKED_REALTIME_EVENT_DENIED');
}

async function cleanup() {
  let failed = false;
  for (const { client, channel } of activeChannels) {
    try {
      const removed = await Promise.race([
        client.removeChannel(channel),
        delay(2500).then(() => 'timeout'),
      ]);
      if (removed !== 'ok') failed = true;
    } catch { failed = true; }
  }
  for (const client of actors) {
    try { client.realtime.disconnect(); } catch { failed = true; }
  }

  if (!createdIds.length) {
    if (failed) throw new Error('CHANNEL_CLEANUP_FAILED');
    return;
  }
  const ids = [...new Set(createdIds)];
  const operations = [
    admin.from('messaggi').delete().in('mittente_id', ids),
    admin.from('messaggi').delete().in('destinatario_id', ids),
    admin.from('likes').delete().in('user_id', ids),
    admin.from('likes').delete().in('user_to', ids),
    admin.from('match_scores').delete().in('user_a', ids),
    admin.from('match_scores').delete().in('user_b', ids),
    admin.from('stanze_360').delete().in('user_id', ids),
  ];
  for (const query of operations) {
    try {
      const result = await query;
      if (result.error) failed = true;
    } catch { failed = true; }
  }
  for (const id of ids) {
    try {
      const result = await admin.auth.admin.deleteUser(id);
      if (result.error) failed = true;
    } catch { failed = true; }
  }
  if (failed) throw new Error('LOCAL_CLEANUP_FAILED');
}

try {
  await run();
  pass('GATE21C_REALTIME_E2E');
} catch (error) {
  const safeCode = typeof error?.message === 'string' &&
    /^[A-Z0-9_]{1,80}$/.test(error.message) ? error.message : 'UNEXPECTED';
  process.stderr.write(`FAIL GATE21C_STAGE=${phase}\n`);
  process.stderr.write(`GATE21C_ERROR_CODE=${safeCode}\n`);
  process.exitCode = 1;
} finally {
  try { await cleanup(); pass('GATE21C_CLEANUP'); }
  catch { process.stderr.write('FAIL GATE21C_CLEANUP\n'); process.exitCode = 1; }
}
