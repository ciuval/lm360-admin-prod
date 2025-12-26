import React from "react";

export default function ToastHost(){
  const [toasts, setToasts] = React.useState([]);

  React.useEffect(() => {
    function onToast(ev){
      const id = Math.random().toString(36).slice(2);
      const { message, type, duration } = ev.detail || {};
      const t = { id, message, type, expires: Date.now() + (duration || 4000) };
      setToasts(prev => [...prev, t]);
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== id));
      }, duration || 4000);
    }
    window.addEventListener("lm:toast", onToast);
    return () => window.removeEventListener("lm:toast", onToast);
  }, []);

  const color = (t) => t.type === "error" ? "#d33" : t.type === "success" ? "#0a2" : "#444";

  return (
    <div aria-live="polite" aria-atomic="true"
         style={{
           position:"fixed", top:16, right:16, display:"grid", gap:10,
           zIndex:9999, maxWidth:360
         }}>
      {toasts.map(t => (
        <div key={t.id} role="status"
             style={{
               background:"#111", color:"#eee", border:`1px solid ${color(t)}`,
               borderLeft:`6px solid ${color(t)}`, borderRadius:10, padding:"10px 14px",
               boxShadow:"0 6px 24px rgba(0,0,0,.35)", fontSize:14, lineHeight:1.4
             }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
