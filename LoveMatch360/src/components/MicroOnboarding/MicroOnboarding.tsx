// /src/components/MicroOnboarding.tsx
const steps = [
  { label: 'Aggiungi foto profilo', key: 'photo' },
  { label: 'Scrivi la tua bio', key: 'bio' },
  { label: 'Scegli 3 interessi', key: 'interests' }
];

export const MicroOnboarding = ({ profile }) => {
  const incomplete = steps.filter(step => {
    if (step.key === 'interests') return (profile.interests?.length ?? 0) < 3;
    return !profile[step.key];
  });

  if (incomplete.length === 0) return null;

  return (
    <div className="micro-onboarding">
      <p>Completa il profilo per aumentare i tuoi match!</p>
      <ul>
        {incomplete.map(step => (
          <li key={step.key}>✅ {step.label}</li>
        ))}
      </ul>
    </div>
  );
};

