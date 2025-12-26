// src/components/Badge/Badge.tsx
import React from 'react';

export const Badge = ({ label }: { label: string }) => (
  <span
    style={{
      background: '#bb86fc',
      color: '#000',
      borderRadius: '6px',
      padding: '2px 6px',
      fontSize: '0.75rem',
      marginLeft: '0.5rem'
    }}
  >
    {label}
  </span>
);

