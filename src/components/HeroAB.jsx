import React, { useEffect, useState } from "react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import { getAbVariant } from "../lib/abTests";
import { track } from "../lib/analytics";

const copies = {
  A: {
    h: "Una coincidenza reale può aprire una porta.",
    s: "Chat solo con match reciproci — zero perdite di tempo.",
    cta: "Inizia ora",
  },
  B: {
    h: "Coincidenze sincere, conversazioni reali.",
    s: "Completa la tua Stanza, supera insieme il 50% e scegliete entrambi se parlare.",
    cta: "Crea il profilo",
  },
  C: {
    h: "Più affinità, meno swipe.",
    s: "Compatibilità spiegabile da 50% e chat solo dopo interesse reciproco.",
    cta: "Scopri i match",
  },
  D: {
    h: "Incontri di qualità, non di quantità.",
    s: "Raccontati con cura, scopri le affinità e scegli senza fretta.",
    cta: "Completa il profilo",
  },
  E: {
    h: "Le regole sono uguali per tutti.",
    s: "Il pagamento non compra compatibilità, visibilità o accesso alle persone.",
    cta: "Scopri come funziona",
  },
};

export default function HeroAB({ userId }) {
  const [v, setV] = useState("A");
  const data = copies[v] || copies.A;

  useEffect(() => {
    let alive = true;

    async function loadVariant() {
      const variant = await getAbVariant(userId ?? null, "hero_copy", [
        "A",
        "B",
        "C",
        "D",
        "E",
      ]);

      if (alive) {
        setV(variant);
      }
    }

    loadVariant();

    return () => {
      alive = false;
    };
  }, [userId]);

  function onCTA() {
    track("paywall_view", { placement: "hero_ab", variant: v });

    const el = document.getElementById("cta-primary");
    if (el) el.blur();
  }

  return (
    <Card style={{ margin: "1rem auto", maxWidth: 900, textAlign: "center" }}>
      <h1 style={{ margin: "0 0 .5rem 0" }}>{data.h}</h1>
      <p style={{ opacity: 0.85, margin: "0 0 1rem 0" }}>{data.s}</p>
      <Button id="cta-primary" onClick={onCTA}>
        {data.cta}
      </Button>
      <div style={{ marginTop: 8, opacity: 0.6, fontSize: 12 }}>
        Variante: {v}
      </div>
    </Card>
  );
}
