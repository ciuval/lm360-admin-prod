/* responsive ChatBox.jsx */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { track } from "../lib/analytics.js";
import { loadConsentedPartnerName } from "../lib/partnerDisplayName.js";

export default function ChatBox() {
  const { id: destinatarioId } = useParams();
  const [session, setSession] = useState(null);
  const [input, setInput] = useState("");
  const [messaggi, setMessaggi] = useState([]);
  const [chatAbilitata, setChatAbilitata] = useState(false);
  const [verificaAccesso, setVerificaAccesso] = useState(true);
  const [availabilityError, setAvailabilityError] = useState(false);
  const [destinatarioNome, setDestinatarioNome] = useState("questa persona");
  const chatBoxRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [messagesLoadError, setMessagesLoadError] = useState(false);
  const [realtimeStatus, setRealtimeStatus] = useState("IN_ATTESA");
  const [realtimeFailure, setRealtimeFailure] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setSession(data.session);
    });
  }, []);

  useEffect(() => {
    if (!session?.user?.id || !destinatarioId) return;
    const checkMatchAndRead = async () => {
      const myId = session.user.id;
      const pair = [myId, destinatarioId].sort();

      setAvailabilityError(false);
      const { data: match, error: matchError } = await supabase
        .from("match_scores")
        .select("user_a, user_b, score")
        .eq("user_a", pair[0])
        .eq("user_b", pair[1])
        .eq("score", 100)
        .maybeSingle();
      const { data: roomCompatibility, error: roomError } = await supabase
        .rpc("get_stanza_compatibility", { target_user_id: destinatarioId })
        .maybeSingle();
      if (matchError || roomError) {
        setChatAbilitata(false);
        setAvailabilityError(true);
        setVerificaAccesso(false);
        return;
      }
      const roomCanOpen = Boolean(roomCompatibility?.opens);
      const allowed = Boolean(match) && roomCanOpen;
      setChatAbilitata(allowed);
      if (allowed) {
        await supabase
          .from("messaggi")
          .update({ letto: true })
          .eq("mittente_id", destinatarioId)
          .eq("destinatario_id", myId)
          .eq("letto", false);
      }
      const name = allowed
        ? await loadConsentedPartnerName(supabase, myId, destinatarioId)
        : "questa persona";
      setDestinatarioNome(name);
      setVerificaAccesso(false);
    };
    checkMatchAndRead().catch(() => {
      setChatAbilitata(false);
      setAvailabilityError(true);
      setVerificaAccesso(false);
    });
  }, [session, destinatarioId]);

  // Legge soltanto la coppia autorizzata: la RLS di messaggi resta attiva.
  // Riutilizzato anche dopo un invio riuscito, senza dipendere da Realtime.
  const refreshMessages = async (myId, partnerId) => {
    const { data, error } = await supabase
      .from("messaggi")
      .select("id, mittente_id, destinatario_id, testo, letto, inviato_il")
      .or(`and(mittente_id.eq.${myId},destinatario_id.eq.${partnerId}),and(mittente_id.eq.${partnerId},destinatario_id.eq.${myId})`)
      .order("inviato_il", { ascending: true });

    if (error) {
      setMessagesLoadError(true);
      return false;
    }

    const validRows = (data || []).filter((msg) =>
      (msg.mittente_id === myId && msg.destinatario_id === partnerId) ||
      (msg.mittente_id === partnerId && msg.destinatario_id === myId)
    );
    setMessaggi(validRows);
    setMessagesLoadError(false);
    return true;
  };

  const scrollConversationToEnd = () => {
    const container = chatBoxRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    if (!session?.user?.id || !destinatarioId || !chatAbilitata) return;
    const myId = session.user.id;
    let active = true;
    let messaggiChannel = null;
    setRealtimeStatus("COLLEGAMENTO");
    setRealtimeFailure(null);

    // Il token dell'account deve raggiungere Realtime PRIMA dell'iscrizione.
    // Il solo stato SUBSCRIBED non garantisce il ruolo authenticated.
    const startRealtime = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (error || !data?.session?.access_token || data.session.user?.id !== myId) {
        setRealtimeFailure("SESSIONE_NON_VALIDA");
        setRealtimeStatus("NON_DISPONIBILE");
        return;
      }

      // La credenziale rimane nella memoria del client, mai in log o UI.
      await supabase.realtime.setAuth(data.session.access_token);
      if (!active) return;

      messaggiChannel = supabase
        .channel("chat-messaggi")
        .on("postgres_changes", { event: "INSERT", schema: "public", table: "messaggi" }, async (payload) => {
          if (!active) return;
          const nuovo = payload.new;
          const coinvolto =
            (nuovo.mittente_id === myId && nuovo.destinatario_id === destinatarioId) ||
            (nuovo.mittente_id === destinatarioId && nuovo.destinatario_id === myId);
          if (coinvolto) {
            setMessaggi((prev) => prev.some((msg) => msg.id === nuovo.id) ? prev : [...prev, nuovo]);
            if (nuovo.mittente_id !== myId) {
              // La notifica sonora non deve impedire di marcare il messaggio come letto.
              new Audio("/notify.mp3").play().catch(() => {});
              toast("💬 Nuovo messaggio ricevuto!");
              await supabase.from("messaggi").update({ letto: true }).eq("id", nuovo.id);
            }
          }
        })
        .subscribe((status) => {
          // Nessun token, UUID, URL o payload nei messaggi diagnostici.
          if (!active) return;
          if (status === "SUBSCRIBED") {
            setRealtimeFailure(null);
            setRealtimeStatus("COLLEGATO");
            refreshMessages(myId, destinatarioId).catch(() => { if (active) setMessagesLoadError(true); });
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            setRealtimeFailure(status);
            setRealtimeStatus("NON_DISPONIBILE");
          }
        });

    };

    // Aggiorna la credenziale Realtime quando Supabase Auth rinnova la sessione.
    const { data: authListener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      if (event === "TOKEN_REFRESHED" && nextSession?.user?.id === myId && nextSession.access_token) {
        Promise.resolve().then(() => {
          if (active) return supabase.realtime.setAuth(nextSession.access_token);
        }).catch(() => {
          if (active) {
            setRealtimeFailure("SESSIONE_NON_VALIDA");
            setRealtimeStatus("NON_DISPONIBILE");
          }
        });
      }
      if (event === "SIGNED_OUT") {
        if (messaggiChannel) supabase.removeChannel(messaggiChannel);
        messaggiChannel = null;
        setRealtimeFailure("SESSIONE_TERMINATA");
        setRealtimeStatus("NON_DISPONIBILE");
      }
    });

    // La lettura RLS non dipende dalla riuscita del canale Realtime.
    refreshMessages(myId, destinatarioId).catch(() => { if (active) setMessagesLoadError(true); });
    startRealtime().catch(() => {
      if (active) {
        setRealtimeFailure("SESSIONE_NON_VALIDA");
        setRealtimeStatus("NON_DISPONIBILE");
      }
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
      if (messaggiChannel) supabase.removeChannel(messaggiChannel);
    };
  }, [session?.user?.id, destinatarioId, chatAbilitata]);

  const inviaMessaggio = async () => {
    if (!session?.user?.id || !destinatarioId || !chatAbilitata || !input.trim() || sending) return;
    setSending(true);
    try {
      const { data: sent, error } = await supabase.rpc("send_stanza_message", {
        target_user_id: destinatarioId,
        message_content: input.trim(),
      });
      if (error || !sent) {
        toast.error("Il messaggio non è stato inviato. Riprova.");
        return;
      }

      // Il backend ha confermato la scrittura. Non proporre un secondo invio
      // se una successiva lettura fallisce: si rischierebbe un duplicato.
      setInput("");
      track("room_message_sent").catch(() => {});

      const loaded = await refreshMessages(session.user.id, destinatarioId);
      if (!loaded) {
        toast.error("Messaggio inviato, ma la cronologia non si aggiorna. Ricarica la pagina.");
      } else {
        requestAnimationFrame(scrollConversationToEnd);
      }
    } catch {
      toast.error("Invio non confermato. Verifica la chat prima di riprovare.");
    } finally {
      setSending(false);
    }
  };


  const messaggiPerData = messaggi.reduce((acc, msg) => {
    const giorno = new Date(msg.inviato_il).toLocaleDateString("it-IT");
    if (!acc[giorno]) acc[giorno] = [];
    acc[giorno].push(msg);
    return acc;
  }, {});

  return (
    <div style={{ ...chatContainer, padding: "1rem" }}>
      <style>{`
        @media (max-width: 600px) {
          .chat-title { font-size: 1rem !important; }
          .chat-box { max-height: 50vh !important; }
          .chat-input { font-size: 1rem !important; }
        }
      `}</style>
      <Toaster position="top-right" />
      <h2 style={{ ...chatTitle }} className="chat-title">
        💬 Stanza con {destinatarioNome}
      </h2>

      {verificaAccesso ? (
        <div role="status" style={closedStyle}>Verifica della Stanza 360 in corso…</div>
      ) : availabilityError ? (
        <div role="alert" style={closedStyle}>
          Non possiamo verificare l’accesso alla Stanza 360 in questo momento. La chat resta chiusa per sicurezza.
        </div>
      ) : !chatAbilitata ? (
        <div role="status" style={closedStyle}>
          La conversazione resta chiusa: servono almeno 50% di compatibilità e interesse reciproco. Nessun pagamento può aprirla.
        </div>
      ) : null}

      {chatAbilitata && (
        <p role="status" aria-live="polite" style={{
          fontSize: "0.85rem",
          color: realtimeStatus === "COLLEGATO" ? "#9de6b2" : "#ccc",
          margin: "0 0 0.75rem",
        }}>
          {realtimeStatus === "COLLEGATO"
            ? "Realtime: canale collegato (consegna da verificare)"
            : realtimeStatus === "NON_DISPONIBILE"
              ? `Realtime: non disponibile (${realtimeFailure || "ERRORE"}). La cronologia resta consultabile.`
              : "Realtime: collegamento in corso…"}
        </p>
      )}
      {messagesLoadError && chatAbilitata && (
        <p role="alert" style={closedStyle}>
          La cronologia non è disponibile in questo momento. Non inviare nuovamente lo stesso messaggio.
        </p>
      )}
      <div ref={chatBoxRef} style={chatBox} className="chat-box" aria-label={`Conversazione con ${destinatarioNome}`}>
        {Object.entries(messaggiPerData).map(([giorno, messaggiDelGiorno]) => (
          <div key={giorno}>
            <div style={{ textAlign: "center", color: "#999", margin: "0.5rem 0" }}>📅 {giorno}</div>
            {messaggiDelGiorno.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...msgStyle,
                  alignSelf: msg.mittente_id === session?.user?.id ? "flex-end" : "flex-start",
                  backgroundColor: msg.mittente_id === session?.user?.id ? "#1e88e5" : "#333",
                  marginBottom: "0.6rem",
                  padding: "0.7rem 1rem",
                  border: msg.letto ? "1px solid #0f0" : "1px solid #444",
                }}
                title={msg.letto && msg.mittente_id === session.user.id
                  ? `Messaggio letto alle ${new Date(msg.inviato_il).toLocaleTimeString("it-IT")}`
                  : undefined}
              >
                <div>{msg.testo}</div>
                <div style={{ fontSize: "0.75rem", color: "#bbb", marginTop: "0.3rem" }}>
                  🕓 {new Date(msg.inviato_il).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                  {msg.mittente_id === session.user.id && msg.letto && " ✅"}
                </div>
              </div>
            ))}
          </div>
        ))}

      </div>

      <div style={inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && inviaMessaggio()}
          placeholder="Scrivi un messaggio..."
          style={{ ...inputStyle, fontSize: "1.05rem" }}
          className="chat-input"
          disabled={!chatAbilitata || sending}
        />
        <button onClick={inviaMessaggio} style={sendBtn} disabled={!chatAbilitata || sending || !input.trim()} aria-label="Invia messaggio">
          {sending ? "Invio…" : "📤"}
        </button>
      </div>
    </div>
  );
}

const chatContainer = {
  backgroundColor: "#121212",
  color: "#fff",
  minHeight: "100vh",
  fontFamily: "'Segoe UI', sans-serif",
};

const chatTitle = {
  fontSize: "1.2rem",
  marginBottom: "1rem",
  color: "#f08fc0",
};

const closedStyle = { marginBottom:"1rem", padding:"1rem", borderRadius:14, border:"1px solid rgba(240,143,192,.35)", background:"rgba(240,143,192,.1)", color:"#ffd6ea", lineHeight:1.6 };

const chatBox = {
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  maxHeight: "60vh",
  overflowY: "auto",
  marginBottom: "1rem",
  padding: "1rem",
  backgroundColor: "#1a1a1a",
  borderRadius: "8px",
};

const msgStyle = {
  maxWidth: "70%",
  padding: "0.6rem 1rem",
  borderRadius: "10px",
  color: "#fff",
  fontSize: "0.95rem",
  lineHeight: "1.3",
  wordBreak: "break-word",
};

const inputRow = {
  display: "flex",
  gap: "0.5rem",
};

const inputStyle = {
  flex: 1,
  padding: "0.8rem",
  borderRadius: "6px",
  border: "1px solid #333",
  backgroundColor: "#1e1e1e",
  color: "#fff",
};

const sendBtn = {
  padding: "0.8rem 1rem",
  backgroundColor: "#f08fc0",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
