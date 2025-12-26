import React from 'react';

/**
 * Input UI
 * Props:
 *  - label, placeholder, value, onChange, required
 *  - as: "input" | "textarea"
 *  - inputClassName, type
 */
export default function Input({
  label,
  as = 'input',
  inputClassName = '',
  type = 'text',
  required = false,
  ...rest
}) {
  const Comp = as === 'textarea' ? 'textarea' : 'input';

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
      <Comp
        className={`ui-input ${inputClassName}`.trim()}
        type={Comp === 'input' ? type : undefined}
        {...rest}
      />
    </div>
  );
}
