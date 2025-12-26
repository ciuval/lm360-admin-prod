import React from "react";
export default function Button({variant="brand", disabled, style, ...props}){
  const bg = {brand:"var(--brand)", ok:"var(--ok)", ghost:"transparent"}[variant]||"var(--brand)";
  const color = variant==="ghost" ? "var(--txt)" : "#121212";
  return (
    <button
      disabled={disabled}
      style={{
        background:bg,color,
        border:variant==="ghost"?"var(--border)":"none",
        borderRadius:"var(--radius)",padding:"8px 12px",
        boxShadow:variant==="brand"&&!disabled?"var(--shadow)":"none",
        opacity:disabled?.toString()==="true"?0.6:1,cursor:disabled?"not-allowed":"pointer",
        ...style
      }}
      {...props}
    />
  );
}
