import { getJson, setJson } from '../lib/storage';
import React from 'react';
/** Badge con toni: info|success|warn|error|neutral (default) */
export default function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className = '',
  ...rest
}) {
  return (
    <span className={`ui-badge ${className}`} data-tone={tone} {...rest}>
      {dot && <span className="dot" aria-hidden="true" />} {children}
    </span>
  );
}
