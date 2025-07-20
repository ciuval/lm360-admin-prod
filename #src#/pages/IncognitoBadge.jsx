import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { EyeOff } from "lucide-react";

export default function IncognitoBadge({ userId, context = "profilo" }) {
  const [attivo, setAttivo] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data, error } = await supabase
        .from("profili")
        .select("modalita_incognito, updated_at")
        .eq("id", userId)
        .single();

      if (!error && data) {
        setAttivo(data.modalita_incognito);
        setLastUpdate(data.updated_at);
      }
    };
    if (userId) fetchStatus();
  }, [userId]);

  if (!attivo) return null;

  const showTooltip = context === "profilo";

  return (
    <div
      className="relative group flex items-center gap-2 bg-yellow-900 text-yellow-300 px-3 py-2 rounded-xl text-sm mt-4 shadow-md"
    >
      <EyeOff size={16} />
      <span>Modalità incognito attiva</span>
      {lastUpdate && (
        <span className="text-xs text-yellow-400 ml-2">
          (dal {new Date(lastUpdate).toLocaleDateString()})
        </span>
      )}

      {showTooltip && (
        <div className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 top-full mt-1 shadow-xl">
          Nessuno vedrà quando visiti i loro profili.
        </div>
      )}
    </div>
  );
}
