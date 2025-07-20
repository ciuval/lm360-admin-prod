import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ChatBox() {
  const { id: destinatarioId } = useParams();
  const [messaggi, setMessaggi] = useState([]);
  const [testo, setTesto] = useState("");
  const [user, setUser] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("messaggi")
          .select("*")
          .or(`mittente_id.eq.${user.id},destinatario_id.eq.${user.id}`)
          .order("data", { ascending: true });

        if (!error && data) {
          const conversazione = data.filter(
            (msg) =>
              (msg.mittente_id === user.id && msg.destinatario_id === destinatarioId) ||
              (msg.destinatario_id === user.id && msg.mittente_id === destinatarioId)
          );
          setMessaggi(conversazione);
        }
      }
    };

    fetchUserAndMessages();

    const channel = supabase
      .channel("messaggi_chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messaggi",
        },
        (payload) => {
          const nuovo = payload.new;
          if (
            (nuovo.mittente_id === user?.id && nuovo.destinatario_id === destinatarioId) ||
            (nuovo.destinatario_id === user?.id && nuovo.mittente_id === destinatarioId)
          ) {
            setMessaggi((prev) => [...prev, nuovo]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [destinatarioId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messaggi]);

  const inviaMessaggio = async () => {
    if (testo.trim() === "" || !user) return;
    await supabase.from("messaggi").insert({
      mittente_id: user.id,
      destinatario_id: destinatarioId,
      testo,
    });
    setTesto("");
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-900 text-white p-4 rounded-xl min-h-[80vh] flex flex-col">
      <h2 className="text-xl font-bold mb-4">💬 Chat con utente</h2>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4">
        {messaggi.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-md max-w-[70%] ${
              msg.mittente_id === user?.id
                ? "bg-pink-600 ml-auto text-right"
                : "bg-gray-700"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.testo}</p>
            <span className="block text-xs text-gray-300 mt-1">
              {new Date(msg.data).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="Scrivi un messaggio..."
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-600"
        />
        <button
          onClick={inviaMessaggio}
          className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded"
        >
          Invia
        </button>
      </div>
    </div>
  );
}
