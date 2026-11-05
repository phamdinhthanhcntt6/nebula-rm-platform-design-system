import React from 'react';
// simplize-ui typography/Label — 11px/600 uppercase-ish section label (drawer section titles, field groups).
export function Label({ children, style }) {
  return <span style={{ fontSize: 'var(--t-font-size-xs)', fontWeight: 600, color: 'var(--t-font-color-light)', lineHeight: 1.2, ...style }}>{children}</span>;
}
export function H2Title({ title, description, adornment, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)', marginBottom: 'var(--t-spacing-6)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' }}>
        <h2 style={{ margin: 0, fontSize: 'var(--t-font-size-lg)', fontWeight: 500, color: 'var(--t-font-color-primary)', lineHeight: 1.2 }}>{title}</h2>
        {adornment}
      </div>
      {description ? <h3 style={{ margin: 0, fontSize: 'var(--t-font-size-md)', fontWeight: 400, color: 'var(--t-font-color-tertiary)', lineHeight: 1.5 }}>{description}</h3> : null}
    </div>
  );
}
