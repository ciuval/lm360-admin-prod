// src/pages/Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    question: 'Cosa ti interessa di più?',
    options: ['Relazioni sane', 'Guadagni onesti', 'Benessere personale', 'Produttività'],
    key: 'interessi'
  },
  {
    question: 'Qual è il tuo obiettivo principale?',
    options: ['Crescere', 'Cambiare lavoro', 'Avere stabilità', 'Imparare qualcosa di nuovo'],
    key: 'obiettivo'
  },
  {
    question: 'Quanto tempo vuoi dedicare al giorno?',
    options: ['5 min', '15 min', '30 min', '1 ora'],
    key: 'tempo'
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [risposte, setRisposte] = useState({});
  const navigate = useNavigate();

  const handleSelect = (val) => {
    const key = steps[step].key;
    setRisposte({ ...risposte, [key]: val });
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      // QUI: salva su Supabase (TODO)
      console.log('Risposte raccolte:', risposte);
      navigate('/feed'); // o redirect finale
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-4">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold mb-6">{steps[step].question}</h1>
        <div className="grid grid-cols-1 gap-4">
          {steps[step].options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className="bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded text-lg"
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="mt-8 text-sm text-gray-400">
          Step {step + 1} di {steps.length}
        </div>
      </div>
    </div>
  );
}
