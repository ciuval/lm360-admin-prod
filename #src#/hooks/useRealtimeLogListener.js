import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export default function useRealtimeLogListener() {
  useEffect(() => {
    const channel = supabase
      .channel("log_listener")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "log_attivita",
        },
        (payload) => {
          const tipo = payload.new.tipo;
          const descrizione = payload.new.descrizione;
          toast.custom((t) => (
            <div
              className={`bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg border-l-4 ${
                tipo === "premium"
                  ? "border-pink-500"
                  : "border-green-500"
              }`}
            >
              <strong className="block font-bold mb-1">🔔 Nuova Attività: {tipo}</strong>
              <span className="text-sm text-gray-300">{descrizione}</span>
            </div>
          ));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}
