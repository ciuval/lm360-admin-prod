export const ROOM_MIN_SCORE = 50;
export const QUALITY_OPTIONS = [
  "affettuoso", "affidabile", "altruista", "calmo", "coerente", "coraggioso",
  "curioso", "determinato", "empatico", "indipendente", "ironico", "leale",
  "paziente", "premuroso", "responsabile", "rispettoso", "romantico", "sincero",
  "spontaneo", "socievole",
];

export const IMPERFECTION_OPTIONS = [
  "disordinato", "geloso", "impulsivo", "permaloso", "ritardatario",
  "riservato", "testardo", "timido", "troppo_diretto", "lavoro_troppo",
];

export function normalizeRoom(room = {}) {
  const clean = (values, allowed, limit) => [...new Set(Array.isArray(values) ? values : [])]
    .filter((value) => allowed.includes(value))
    .slice(0, limit);

  return {
    qualities_offered: clean(room.qualities_offered, QUALITY_OPTIONS, 5),
    qualities_sought: clean(room.qualities_sought, QUALITY_OPTIONS, 5),
    imperfections: clean(room.imperfections, IMPERFECTION_OPTIONS, 3),
    imperfections_accepted: clean(room.imperfections_accepted, IMPERFECTION_OPTIONS, 5),
  };
}

export function isRoomReady(room) {
  const value = normalizeRoom(room);
  return value.qualities_offered.length === 5 && value.qualities_sought.length === 5;
}

function ratio(values, expected) {
  if (!expected.length) return 0;
  const matches = expected.filter((value) => values.includes(value));
  return { ratio: matches.length / expected.length, matches };
}

export function calculateRoomCompatibility(first, second) {
  const a = normalizeRoom(first);
  const b = normalizeRoom(second);
  if (!isRoomReady(a) || !isRoomReady(b)) {
    return { ready: false, score: null, opens: false, sharedQualities: [] };
  }

  const towardA = ratio(b.qualities_offered, a.qualities_sought);
  const towardB = ratio(a.qualities_offered, b.qualities_sought);
  const acceptsA = a.imperfections.length
    ? ratio(b.imperfections_accepted, a.imperfections).ratio
    : 1;
  const acceptsB = b.imperfections.length
    ? ratio(a.imperfections_accepted, b.imperfections).ratio
    : 1;
  const score = Math.round(towardA.ratio * 40 + towardB.ratio * 40 + ((acceptsA + acceptsB) / 2) * 20);

  return {
    ready: true,
    score,
    opens: score >= ROOM_MIN_SCORE,
    sharedQualities: [...new Set([...towardA.matches, ...towardB.matches])],
  };
}
