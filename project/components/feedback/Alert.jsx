import React from 'react';
import { Icon } from '../core/Icon.jsx';
// simplize-ui feedback/Alert (portal addition) — tinted banner with icon; variants success/warning/info/error.
const V = { success: ['var(--t-background-transparent-success)', 'var(--t-color-green)', 'circle-check'], warning: ['var(--t-background-transparent-orange)', 'var(--t-color-orange)', 'alert-triangle'], info: ['var(--t-background-transparent-blue)', 'var(--t-color-blue)', 'info-circle'], error: ['var(--t-background-transparent-danger)', 'var(--t-font-color-danger)', 'alert-circle'] };
export function Alert({ variant = 'info', title, children, size = 'medium', attached = false, style }) {
  const [bg, fg, ic] = V[variant] || V.info;
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--t-spacing-2)', padding: size === 'small' ? 'var(--t-spacing-2) var(--t-spacing-3)' : 'var(--t-spacing-3) var(--t-spacing-4)', borderRadius: attached ? 0 : size === 'small' ? 'var(--t-border-radius-sm)' : 'var(--t-border-radius-md)', borderBottom: attached ? '1px solid currentColor' : 'none', background: bg, color: fg, fontSize: 'var(--t-font-size-md)', lineHeight: 1.5, boxSizing: 'border-box', width: attached ? '100%' : 'auto', ...style }}>
      <Icon name={ic} size={16} style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0 }}>{title ? <div style={{ fontWeight: 500 }}>{title}</div> : null}{children}</div>
    </div>
  );
}
export function Banner({ children, variant = 'default', style }) {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--t-spacing-3)', height: 40, padding: '0 var(--t-spacing-4)', background: variant === 'danger' ? 'var(--t-color-red)' : 'var(--t-color-blue)', color: 'var(--t-gray-scale-gray1)', fontSize: 'var(--t-font-size-md)', fontWeight: 500, ...style }}>{children}</div>;
}
