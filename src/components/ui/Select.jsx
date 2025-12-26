import React from 'react';

/**
 * Select UI
 * Props:
 *  - label, placeholder, value, onChange, options[{value,label}], required
 */
export default function Select({
  label,
  placeholder = 'Seleziona…',
  options = [],
  required = false,
  ...rest
}) {
  return (
    <div className="ui-field">
      {label && (
        <label className="ui-label" style={{ display: 'block', marginBottom: 4 }}>
          {label}
          {required && (
            <span aria-hidden="true" style={{ marginLeft: 4 }}>
              *
            </span>
          )}
        </label>
      )}
      <select className="ui-input" {...rest}>
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
