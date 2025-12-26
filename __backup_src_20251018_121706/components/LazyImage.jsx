// src/components/LazyImage.jsx
import React from "react";

/**
 * LazyImage
 * - Usa loading="lazy" + decoding="async"
 * - Evita CLS con width/height o aspect-ratio wrapper
 * - Accessibile: alt obbligatorio
 */
export default function LazyImage({
  src,
  alt,
  width,
  height,
  className = "",
  style = {},
  ...rest
}) {
  const safeAlt = alt || "Immagine";
  const sizeStyle = {
    width: width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
    ...style,
  };

  return (
    <img
      src={src}
      alt={safeAlt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={className}
      style={sizeStyle}
      {...rest}
    />
  );
}
