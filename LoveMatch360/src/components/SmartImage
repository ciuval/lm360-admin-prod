import React from "react";
/** SmartImage: lazy, decoding async, evita CLS se fornisci width/height o style.aspectRatio */
export default function SmartImage({ src, alt="", width, height, style={}, sizes, fetchpriority, ...props }){
  const st = { display:"block", ...style };
  return (
    <img
      src={src} alt={alt}
      loading={fetchpriority==="high" ? undefined : "lazy"}
      decoding="async"
      width={width} height={height}
      sizes={sizes}
      fetchPriority={fetchpriority}
      style={st}
      {...props}
    />
  );
}
