// src/components/InputField.jsx
export default function InputField({ id, label, help, error, ...props }) {
  const helpId = help ? `${id}-help` : undefined;
  const errId  = error ? `${id}-err`  : undefined;
  const described = [helpId, errId].filter(Boolean).join(" ") || undefined;
  return (
    <div className="mb-3 text-left">
      <label htmlFor={id} className="block mb-1 font-medium">{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={described}
        className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 focus:outline-none focus-visible:ring-2 ring-primary"
        {...props}
      />
      {help && <p id={helpId} className="text-sm text-gray-400 mt-1">{help}</p>}
      {error && <p id={errId} role="alert" className="text-sm text-red-400 mt-1">{error}</p>}
    </div>
  );
}
