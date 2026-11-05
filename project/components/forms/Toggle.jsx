import React from 'react';
// simplize-ui input/Toggle — 32x20 (medium) / 24x16 (small) switch, blue when on.
export function Toggle({ value = false, onChange, toggleSize = 'medium', color, disabled = false, ariaLabel, style }) {
  const small = toggleSize === 'small';
  const w = small ? 24 : 32, h = small ? 16 : 20, th = small ? 12 : 16;
  return (
    <button type="button" role="switch" aria-checked={value} aria-label={ariaLabel} disabled={disabled} onClick={() => !disabled && onChange && onChange(!value)}
      style={{ position: 'relative', width: w, height: h, padding: 0, border: 'none', borderRadius: 'var(--t-border-radius-pill)', background: value ? color || 'var(--t-color-blue)' : 'var(--t-background-transparent-medium)', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'background-color 0.3s ease', flexShrink: 0, ...style }}>
      <span style={{ position: 'absolute', top: '50%', left: 0, width: th, height: th, borderRadius: '50%', background: 'var(--t-background-primary)', transform: 'translate(' + (value ? w - th - 2 : 2) + 'px, -50%)', transition: 'transform 0.3s ease', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }} />
    </button>
  );
}
