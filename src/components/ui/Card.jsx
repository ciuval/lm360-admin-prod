import React from "react";
export default function Card({style, ...props}){
  return <div style={{background:"var(--surface)",borderRadius:"var(--radius)",padding:"var(--space-3)",border:"var(--border)",...style}} {...props} />;
}
