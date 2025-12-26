// src/components/MatchProgress/Checklist.tsx
import React from 'react';

interface ChecklistProps {
  profile: {
    name?: string;
    photo?: string;
    bio?: string;
    interests?: string[];
  };
}

export const Checklist = ({ profile }: ChecklistProps) => {
  const items = [
    { label: 'Aggiungi il tuo nome', done: !!profile.name },
    { label: 'Carica una foto', done: !!profile.photo },
    { label: 'Scrivi una bio', done: !!profile.bio },
    { label: 'Seleziona interessi', done: (profile.interests?.length ?? 0) > 0 }
  ];

  return (
    <ul>
      {items.map((item, i) => (
        <li key={i} style={{ opacity: item.done ? 0.5 : 1 }}>
          ✅ {item.label}
        </li>
      ))}
    </ul>
  );
};
