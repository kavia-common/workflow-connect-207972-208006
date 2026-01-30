import React from 'react';

// PUBLIC_INTERFACE
export function Button({ variant = 'primary', size = 'md', className = '', ...props }) {
  /** Retro styled button. */
  const cls = `ui-btn ui-btn--${variant} ui-btn--${size} ${className}`.trim();
  return <button className={cls} {...props} />;
}

// PUBLIC_INTERFACE
export function Input({ label, hint, error, className = '', ...props }) {
  /** Retro styled input with label, hint, and error. */
  return (
    <label className={`ui-field ${className}`.trim()}>
      {label ? <span className="ui-field__label">{label}</span> : null}
      <input className={`ui-input ${error ? 'ui-input--error' : ''}`.trim()} {...props} />
      {error ? <span className="ui-field__error">{error}</span> : null}
      {!error && hint ? <span className="ui-field__hint">{hint}</span> : null}
    </label>
  );
}

// PUBLIC_INTERFACE
export function Select({ label, hint, error, className = '', children, ...props }) {
  /** Retro styled select with label, hint, and error. */
  return (
    <label className={`ui-field ${className}`.trim()}>
      {label ? <span className="ui-field__label">{label}</span> : null}
      <select className={`ui-select ${error ? 'ui-select--error' : ''}`.trim()} {...props}>
        {children}
      </select>
      {error ? <span className="ui-field__error">{error}</span> : null}
      {!error && hint ? <span className="ui-field__hint">{hint}</span> : null}
    </label>
  );
}

// PUBLIC_INTERFACE
export function Card({ title, right, children, className = '' }) {
  /** Retro card/panel container. */
  return (
    <section className={`ui-card ${className}`.trim()}>
      {(title || right) ? (
        <header className="ui-card__header">
          <div className="ui-card__title">{title}</div>
          <div className="ui-card__right">{right}</div>
        </header>
      ) : null}
      <div className="ui-card__body">{children}</div>
    </section>
  );
}

// PUBLIC_INTERFACE
export function Badge({ children, tone = 'neutral', className = '' }) {
  /** Small badge. */
  return <span className={`ui-badge ui-badge--${tone} ${className}`.trim()}>{children}</span>;
}
