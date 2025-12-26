// src/components/MatchProgress/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  return (
    <div style={{ background: '#333', borderRadius: '8px', height: '12px' }}>
      <div
        style={{
          width: `${value}%`,
          background: '#BB86FC',
          height: '100%',
          borderRadius: '8px',
          transition: 'width 0.3s'
        }}
      />
    </div>
  );
};