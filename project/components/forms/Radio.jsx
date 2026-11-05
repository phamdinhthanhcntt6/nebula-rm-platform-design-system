import React from 'react';
// Customers page MvpRadio / MvpOptions — 14px radio (1px strong border → blue, 6px blue dot); square = 3px-radius checkbox-like.
export function Radio({ checked = false, square = false, style }) {
  return (
    <span style={{ width: 14, height: 14, flexShrink: 0, boxSizing: 'border-box', borderRadius: square ? 3 : '50%', border: '1px solid ' + (checked ? 'var(--t-color-blue)' : 'var(--t-border-color-strong)'), display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      {checked ? <span style={{ width: 6, height: 6, borderRadius: square ? 1 : '50%', background: 'var(--t-color-blue)' }} /> : null}
    </span>
  );
}
// Labelled option list: 12px tertiary label, 32px rows (radio + 13px text + light hint), selected row = accent-quaternary fill.
export function RadioGroup({ label, options = [], value, onChange, row = false, toggle = false, square = false, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontFamily: 'var(--t-font-family)', ...style }}>
      {label ? <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', marginBottom: 2 }}>{label}</span> : null}
      <div style={{ display: 'flex', flexDirection: row ? 'row' : 'column', flexWrap: 'wrap', gap: row ? 4 : 0 }}>
        {options.map((o) => (
          <span key={o.value} onClick={() => onChange && onChange(toggle && value === o.value ? null : o.value)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 32, padding: '0 var(--t-spacing-2)', borderRadius: 'var(--t-border-radius-sm)', cursor: 'pointer', background: value === o.value ? 'var(--t-accent-quaternary)' : 'transparent' }}>
            <Radio checked={value === o.value} square={square} />
            <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)' }}>{o.label}</span>
            {o.hint ? <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' }}>{o.hint}</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}
