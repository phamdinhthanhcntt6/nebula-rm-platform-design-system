import React from 'react';
// simplize-ui data-display/Pill — tiny "Soon"/"New" marker in the navigation drawer.
export function Pill({ label, style }) {
  return <span style={{ display: 'inline-flex', alignItems: 'center', height: 16, padding: '0 var(--t-spacing-1)', borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-transparent-light)', color: 'var(--t-font-color-light)', fontSize: 'var(--t-font-size-xs)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.2, ...style }}>{label}</span>;
}
