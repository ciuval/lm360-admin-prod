/* src/components/CmpBanner.jsx */
import React, { useEffect, useState } from "react";

export default function CmpBanner(){
  const [show, setShow] = useState(false);
  useEffect(() => {
    const v = localStorage.getItem("cmp:consent");
    if (!v) setShow(true);
  }, []);

  const accept = () => { localStorage.setItem("cmp:consent","yes"); setShow(false); };
  const decline = () => { localStorage.setItem("cmp:consent","no");  setShow(false); };

  if (!show) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 bg-zinc-900/95 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="text-sm opacity-90">
          Usiamo analytics anonimi per migliorare l’esperienza. Accetti?
        </div>
        <div className="flex gap-2">
          <button onClick={decline} className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700">Rifiuta</button>
          <button onClick={accept}  className="px-4 py-2 rounded-xl bg-rose-400 text-black font-semibold hover:opacity-90">Accetta</button>
        </div>
      </div>
    </div>
  );
}
