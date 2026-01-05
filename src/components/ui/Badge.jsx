import React from "react";
export default function Badge({tone="brand",children,style}){
  const map = {brand:"var(--brand)", ok:"var(--ok)", warn:"var(--warn)", err:"var(--err)"};
  return <span style={{background:map[tone]||"var(--brand)",color:"#121212",borderRadius:999,padding:"2px 8px",fontSize:12, ...style}}>{children}</span>;
}
