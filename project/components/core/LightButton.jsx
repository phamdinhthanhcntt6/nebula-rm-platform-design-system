import React from 'react';
import { Icon } from './Icon.jsx';
// simplize-ui input/LightButton — borderless 24px text button, 13px/400, hover transparent-light; accent secondary/tertiary.
export function LightButton({ title, Icon: name, accent = 'secondary', active = false, disabled = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const color = disabled ? 'var(--t-font-color-extra-light)' : active ? 'var(--t-color-blue)' : accent === 'tertiary' ? 'var(--t-font-color-tertiary)' : 'var(--t-font-color-secondary)';
  return (
    <button type="button" disabled={disabled} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 24, padding: '0 var(--t-spacing-2)', border: 'none', borderRadius: 'var(--t-border-radius-sm)', background: hover && !disabled ? 'var(--t-background-transparent-light)' : 'transparent', color, fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', fontWeight: 400, cursor: disabled ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', transition: 'background 0.1s ease', ...style }}>
      {name ? <Icon name={name} size={14} /> : null}{title}
    </button>
  );
}
