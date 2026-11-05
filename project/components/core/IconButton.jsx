import React from 'react';
import { Icon } from './Icon.jsx';
// simplize-ui input/IconButton + LightIconButton. variant 'light' = LightIconButton (borderless, 24/32 square).
const P = {
  default: { bg: 'var(--t-background-transparent-lighter)', border: 'var(--t-background-transparent-light)', color: 'var(--t-font-color-secondary)', hover: 'var(--t-background-tertiary)' },
  blue: { bg: 'var(--t-color-blue)', border: 'var(--t-background-transparent-light)', color: 'var(--t-gray-scale-gray1)', hover: 'var(--t-color-blue10)' },
  danger: { bg: 'var(--t-color-red)', border: 'var(--t-background-transparent-light)', color: 'var(--t-gray-scale-gray1)', hover: 'var(--t-color-red10)' },
};
const S = {
  default: { color: 'var(--t-font-color-secondary)', border: 'var(--t-background-transparent-medium)', hover: 'var(--t-background-transparent-light)' },
  blue: { color: 'var(--t-color-blue)', border: 'var(--t-color-blue)', hover: 'var(--t-accent-tertiary)' },
  danger: { color: 'var(--t-font-color-danger)', border: 'var(--t-border-color-danger)', hover: 'var(--t-background-danger)' },
};
export function IconButton({ Icon: name, icon, variant = 'primary', accent = 'default', size = 'medium', shape = 'square', position = 'standalone', disabled = false, active = false, onClick, ariaLabel, style, className }) {
  const [hover, setHover] = React.useState(false);
  const px = size === 'small' ? 24 : 32;
  let bg = 'transparent', border = 'transparent', color;
  if (variant === 'primary') { const t = P[accent] || P.default; bg = hover && !disabled ? t.hover : t.bg; border = t.border; color = t.color; }
  else if (variant === 'light') { color = accent === 'tertiary' ? 'var(--t-font-color-tertiary)' : 'var(--t-font-color-secondary)'; if (active) color = 'var(--t-color-blue)'; bg = hover && !disabled ? 'var(--t-background-transparent-light)' : 'transparent'; }
  else { const t = S[accent] || S.default; color = variant === 'tertiary' && accent === 'default' ? 'var(--t-font-color-tertiary)' : t.color; border = variant === 'secondary' ? t.border : 'transparent'; bg = hover && !disabled ? t.hover : 'transparent'; }
  if (disabled) color = variant === 'primary' && accent !== 'default' ? color : 'var(--t-font-color-extra-light)';
  const radius = shape === 'circle' ? '100%' : position === 'left' ? 'var(--t-border-radius-md) 0 0 var(--t-border-radius-md)' : position === 'middle' ? 0 : position === 'right' ? '0 var(--t-border-radius-md) var(--t-border-radius-md) 0' : 'var(--t-border-radius-md)';
  return (
    <button type="button" aria-label={ariaLabel} disabled={disabled} onClick={disabled ? undefined : onClick} className={className}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: px, width: px, minWidth: px, padding: 0, boxSizing: 'border-box', border: variant === 'light' ? 'none' : '1px solid ' + border, borderRadius: radius, background: bg, color, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.1s ease', opacity: disabled && variant === 'primary' && accent !== 'default' ? 0.24 : 1, ...style }}>
      {icon || <Icon name={name} size={16} />}
    </button>
  );
}
