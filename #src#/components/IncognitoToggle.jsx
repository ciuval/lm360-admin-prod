export default function IncognitoToggle({ checked, onChange }) {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      Attiva modalità incognito 🕶️
    </label>
  );
}

