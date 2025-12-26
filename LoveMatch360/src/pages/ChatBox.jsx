/* responsive ChatBox.jsx */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function ChatBox() {
  const { id: destinatarioId } = useParams();
  const [session, setSession] = useState(null);
  const [input, setInput] = useState("");
  const [messaggi, setMessaggi] = useState([]);
  const [chatAbilitata, setChatAbilitata] = useState(false);
  const [altraPersonaStaScrivendo, setAltraPersonaStaScrivendo] = useState(false);
  const [premiumDestinatario, setPremiumDestinatario] = useState(false);
  const scrollRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setSession(data.session);
    });
  }, []);

  useEffect(() => {
    if (!session?.user?.id || !destinatarioId) return;
    const checkMatchAndRead = async () => {
      const myId = session.user.id;
      const { data: match } = await supabase
        .from("match_scores")
        .select("*")
        .eq("user_id", myId)
        .eq("matched_user_id", destinatarioId)
        .eq("score", 100)
        .maybeSingle();
      setChatAbilitata(!!match);
      if (match) {
        await supabase
          .from("messaggi")
          .update({ letto: true })
          .eq("mittente_id", destinatarioId)
          .eq("destinatario_id", myId)
          .eq("letto", false);
      }
      const { data: profilo } = await supabase
        .from("profili")
        .select("premium")
        .eq("id", destinatarioId)
        .maybeSingle();
      setPremiumDestinatario(profilo?.premium || false);
    };
    checkMatchAndRead();
  }, [session, destinatarioId]);

  useEffect(() => {
    if (!session?.user?.id || !destinatarioId || !chatAbilitata) return;
    const caricaMessaggi = async () => {
      const { data } = await supabase
        .from("messaggi")
        .select("*")
        .or(`mittente_id.eq.${session.user.id},destinatario_id.eq.${session.user.id}`)
        .order("timestamp", { ascending: true });
      const filtrati = (data || []).filter(
        (msg) =>
          (msg.mittente_id === session.user.id && msg.destinatario_id === destinatarioId) ||
          (msg.mittente_id === destinatarioId && msg.destinatario_id === session.user.id)
      );
      setMessaggi(filtrati);
    };
    caricaMessaggi();
    const messaggiChannel = supabase
      .channel("chat-messaggi")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messaggi" }, async (payload) => {
        const nuovo = payload.new;
        const io = session.user.id;
        const coinvolto =
          (nuovo.mittente_id === io && nuovo.destinatario_id === destinatarioId) ||
          (nuovo.mittente_id === destinatarioId && nuovo.destinatario_id === io);
        if (coinvolto) {
          setMessaggi((prev) => [...prev, nuovo]);
          if (nuovo.mittente_id !== io) {
            new Audio("/notify.mp3").play();
            toast("💬 Nuovo messaggio ricevuto!");
            await supabase.from("messaggi").update({ letto: true }).eq("id", nuovo.id);
          }
        }
      })
      .subscribe();
    const typingChannel = supabase
      .channel("typing-status")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "typing_status" }, (payload) => {
        const nuovo = payload.new;
        if (nuovo.user_id === destinatarioId && nuovo.chat_with === session.user.id) {
          setAltraPersonaStaScrivendo(nuovo.typing);
        }
      })
      .subscribe();
    return () => {
      supabase.removeChannel(messaggiChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [session, destinatarioId, chatAbilitata]);

  const inviaMessaggio = async () => {
    if (!input.trim()) return;
    await supabase.from("messaggi").insert({
      mittente_id: session.user.id,
      destinatario_id: destinatarioId,
      contenuto: input.trim(),
      letto: false,
    });
    setInput("");
    updateTypingStatus(false);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const updateTypingStatus = async (isTyping) => {
    if (!session?.user?.id || !destinatarioId) return;
    await supabase.from("typing_status").upsert({
      user_id: session.user.id,
      chat_with: destinatarioId,
      typing: isTyping,
      updated_at: new Date().toISOString(),
    });
  };

  const messaggiPerData = messaggi.reduce((acc, msg) => {
    const giorno = new Date(msg.timestamp).toLocaleDateString();
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
        💬 Chat con utente {destinatarioId.slice(0, 6)}
        {premiumDestinatario && <span style={badgePremium}> 🌟 Premium</span>}
      </h2>

      <div style={chatBox} className="chat-box">
        {Object.entries(messaggiPerData).map(([giorno, messaggiDelGiorno]) => (
          <div key={giorno}>
            <div style={{ textAlign: "center", color: "#999", margin: "0.5rem 0" }}>📅 {giorno}</div>
            {messaggiDelGiorno.map((msg) => (
              <div
                key={msg.id}
                style={{
                  ...msgStyle,
                  alignSelf: msg.mittente_id === session?.user?.id ? "flex-end" : "flex-start",
                  backgroundColor: premiumDestinatario ? "#ffd70033" : msg.mittente_id === session?.user?.id ? "#1e88e5" : "#333",
                  marginBottom: "0.6rem",
                  padding: "0.7rem 1rem",
                  border: msg.letto ? "1px solid #0f0" : "1px solid #444",
                }}
                title={msg.letto && msg.mittente_id === session.user.id
                  ? `Messaggio letto alle ${new Date(msg.timestamp).toLocaleTimeString()}`
                  : undefined}
              >
                <div>{msg.contenuto}</div>
                <div style={{ fontSize: "0.75rem", color: "#bbb", marginTop: "0.3rem" }}>
                  🕓 {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  {msg.mittente_id === session.user.id && msg.letto && " ✅"}
                </div>
              </div>
            ))}
          </div>
        ))}
        {altraPersonaStaScrivendo && (
          <div style={{ fontSize: "0.85rem", color: "#aaa", fontStyle: "italic", paddingLeft: "0.6rem" }}>
            💬 Sta scrivendo...
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div style={inputRow}>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            updateTypingStatus(true);
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => updateTypingStatus(false), 2000);
          }}
          onKeyDown={(e) => e.key === "Enter" && inviaMessaggio()}
          placeholder="Scrivi un messaggio..."
          style={{ ...inputStyle, fontSize: "1.05rem" }}
          className="chat-input"
        />
        <button onClick={inviaMessaggio} style={sendBtn}>📤</button>
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

const badgePremium = {
  backgroundColor: "#ffd700",
  color: "#000",
  padding: "0.3rem 0.6rem",
  borderRadius: "6px",
  marginLeft: "0.5rem",
  fontWeight: "bold",
  fontSize: "0.8rem"
};

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
