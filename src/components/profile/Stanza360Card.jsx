import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabaseClient";
import {
  IMPERFECTION_OPTIONS,
  QUALITY_OPTIONS,
  isRoomReady,
  normalizeRoom,
} from "../../lib/stanza360.js";
import { track } from "../../lib/analytics.js";
import { getActivationJourneyProps } from "../../lib/activationJourney.js";

const EMPTY_ROOM = normalizeRoom();

function labelFor(value) {
  return value.replaceAll("_", " ");
}

function ChoiceGroup({ title, help, values, options, limit, onChange, disabled }) {
  const toggle = (value) => {
    const next = values.includes(value)
      ? values.filter((item) => item !== value)
      : values.length < limit ? [...values, value] : values;
    onChange(next);
  };

  return (
    <fieldset style={fieldsetStyle} disabled={disabled}>
      <legend style={legendStyle}>{title} <span style={counterStyle}>{values.length}/{limit}</span></legend>
      <p style={helpStyle}>{help}</p>
      <div style={chipsStyle}>
        {options.map((option) => {
          const selected = values.includes(option);
          return (
            <button key={option} type="button" aria-pressed={selected} onClick={() => toggle(option)}
              style={{ ...chipStyle, ...(selected ? chipSelectedStyle : {}) }}>
              {labelFor(option)}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function Stanza360Card({ userId }) {
  const [room, setRoom] = useState(EMPTY_ROOM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [available, setAvailable] = useState(true);
  const ready = useMemo(() => isRoomReady(room), [room]);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    async function loadRoom() {
      const { data, error } = await supabase.from("stanze_360")
        .select("qualities_offered, qualities_sought, imperfections, imperfections_accepted")
        .eq("user_id", userId).maybeSingle();
        if (!alive) return;
        if (error) setAvailable(false);
        if (data) setRoom(normalizeRoom(data));
        setLoading(false);
    }
    loadRoom().catch(() => {
      if (alive) {
        setAvailable(false);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, [userId]);

  const update = (key) => (values) => setRoom((current) => ({ ...current, [key]: values }));

  const save = async () => {
    if (!userId || !ready || saving) return;
    setSaving(true);
    const payload = { user_id: userId, ...normalizeRoom(room), updated_at: new Date().toISOString() };
    const { error } = await supabase.from("stanze_360").upsert(payload, { onConflict: "user_id" });
    setSaving(false);
    if (error) {
      setAvailable(false);
      toast.error("La Stanza non è ancora disponibile. Nessun dato è stato perso.");
      return;
    }
    track("room_360_saved", { ...getActivationJourneyProps(), ready: true }).catch(() => {});
    toast.success("La tua Stanza 360 è pronta.");
  };

  if (loading) return <p role="status">Preparazione della Stanza 360…</p>;
  if (!available) return (
    <section style={cardStyle} aria-labelledby="room-title">
      <h3 id="room-title" style={titleStyle}>La Stanza 360 sta arrivando</h3>
      <p style={introStyle}>Il profilo continua a funzionare. La stanza verrà aperta dopo l’attivazione sicura del database.</p>
    </section>
  );

  return (
    <section style={cardStyle} aria-labelledby="room-title">
      <p style={eyebrowStyle}>Il cuore di LoveMatch360</p>
      <h3 id="room-title" style={titleStyle}>La mia Stanza 360</h3>
      <p style={introStyle}>La persona che cerchi forse è qui. Una qualità non si pretende: si riconosce e si ricambia.</p>
      <ChoiceGroup title="Qualità che porto" help="Scegli esattamente cinque parole sincere." values={room.qualities_offered} options={QUALITY_OPTIONS} limit={5} onChange={update("qualities_offered")} disabled={saving} />
      <ChoiceGroup title="Qualità che cerco" help="Scegli le cinque qualità che sapresti riconoscere." values={room.qualities_sought} options={QUALITY_OPTIONS} limit={5} onChange={update("qualities_sought")} disabled={saving} />
      <ChoiceGroup title="Le mie imperfezioni" help="Fino a tre aspetti umani, senza normalizzare comportamenti pericolosi." values={room.imperfections} options={IMPERFECTION_OPTIONS} limit={3} onChange={update("imperfections")} disabled={saving} />
      <ChoiceGroup title="Imperfezioni che posso accogliere" help="Fino a cinque: comprendere non significa subire." values={room.imperfections_accepted} options={IMPERFECTION_OPTIONS} limit={5} onChange={update("imperfections_accepted")} disabled={saving} />
      <button type="button" onClick={save} disabled={!ready || saving} style={{ ...saveStyle, ...(!ready || saving ? disabledStyle : {}) }}>
        {saving ? "Sto preparando la stanza…" : ready ? "Salva la mia Stanza" : "Scegli 5 qualità che porti e 5 che cerchi"}
      </button>
    </section>
  );
}

const cardStyle = { margin:"1.5rem 0", padding:"clamp(1.1rem, 3vw, 1.6rem)", borderRadius:24, border:"1px solid rgba(240,143,192,.35)", background:"radial-gradient(circle at top right, rgba(240,143,192,.15), transparent 32%), #17171e" };
const eyebrowStyle = { margin:0, color:"#f3b4d4", fontSize:12, fontWeight:900, letterSpacing:2, textTransform:"uppercase" };
const titleStyle = { margin:".45rem 0", fontSize:"clamp(1.7rem, 4vw, 2.5rem)", color:"#fff" };
const introStyle = { color:"#d8d8e2", lineHeight:1.65, maxWidth:720 };
const fieldsetStyle = { margin:"1.25rem 0", padding:0, border:0 };
const legendStyle = { color:"#fff", fontWeight:900, fontSize:"1.05rem" };
const counterStyle = { marginLeft:8, color:"#f3b4d4", fontSize:13 };
const helpStyle = { margin:".35rem 0 .75rem", color:"#aaaaba", lineHeight:1.5 };
const chipsStyle = { display:"flex", flexWrap:"wrap", gap:8 };
const chipStyle = { minHeight:40, padding:"0 13px", borderRadius:999, border:"1px solid rgba(255,255,255,.16)", background:"#22222b", color:"#e8e8ef", cursor:"pointer", textTransform:"capitalize" };
const chipSelectedStyle = { borderColor:"#f08fc0", background:"#f08fc0", color:"#170c13", fontWeight:900 };
const saveStyle = { width:"100%", minHeight:50, marginTop:8, border:0, borderRadius:16, background:"linear-gradient(135deg,#ffd6ea,#f08fc0)", color:"#170c13", fontWeight:900, cursor:"pointer" };
const disabledStyle = { opacity:.55, cursor:"not-allowed" };
