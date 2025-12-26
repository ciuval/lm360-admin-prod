import { getJson, setJson } from '../lib/storage';
// src/pages/PremiumAreaDemo.jsx
import React from 'react';
import PremiumBadge from '../components/PremiumBadge';

export default function PremiumAreaDemo() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-semibold">Area Premium — Demo</h1>
      <div className="mt-2">
        <PremiumBadge />
      </div>
      <p className="mt-4 opacity-80">Se vedi questa pagina, il gating premium funziona 🔒✨</p>
    </div>
  );
}
