// src/components/MatchProgress/index.tsx
import React from 'react';
import { ProgressBar } from './ProgressBar';
import { Checklist } from './Checklist';
import { TooltipScore } from './TooltipScore';

interface MatchProgressProps {
  profile: {
    name?: string;
    photo?: string;
    bio?: string;
    interests?: string[];
    matchScore: number;
  };
}

export const MatchProgress = ({ profile }: MatchProgressProps) => {
  return (
    <div style={{ padding: '1rem', background: '#1e1e1e', color: '#fff' }}>
      <h3>Compatibilità: {profile.matchScore}/100 <TooltipScore /></h3>
      <ProgressBar value={profile.matchScore} />
      <Checklist profile={profile} />
    </div>
  );
};

