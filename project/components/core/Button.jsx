import React from 'react';
import { Icon } from './Icon.jsx';
// Ported from simplize-ui input/Button/Button.module.scss (variant x accent matrix).
const M = {
  primary: {
    default: { bg: 'var(--t-background-transparent-lighter)', border: 'var(--t-background-transparent-light)', color: 'var(--t-font-color-secondary)', hover: 'var(--t-background-tertiary)', active: 'var(--t-background-quaternary)', disabledColor: 'var(--t-font-color-extra-light)' },
    blue: { bg: 'var(--t-color-blue)', border: 'var(--t-background-transparent-light)', color: 'var(--t-gray-scale-gray1)', hover: 'var(--t-color-blue10)', active: 'var(--t-color-blue12)', disabledBg: 'var(--t-accent-accent4060)' },
    danger: { bg: 'var(--t-color-red)', border: 'var(--t-background-transparent-light)', color: 'var(--t-background-primary)', hover: 'var(--t-color-red8)', active: 'var(--t-color-red10)' },
    green: { bg: 'var(--t-color-green9)', border: 'var(--t-background-transparent-light)', color: 'var(--t-gray-scale-gray1)', hover: 'var(--t-color-green10)', active: 'var(--t-color-green12)', disabledBg: 'var(--t-color-green3)', disabledColor: 'var(--t-color-green9)' },
  },
  secondary: {
    default: { border: 'var(--t-background-transparent-medium)', color: 'var(--t-font-color-secondary)', hover: 'var(--t-background-transparent-light)', active: 'var(--t-background-transparent-light)', disabledColor: 'var(--t-font-color-extra-light)' },
    blue: { border: 'var(--t-accent-primary)', color: 'var(--t-color-blue)', hover: 'var(--t-accent-tertiary)', active: 'var(--t-accent-secondary)', disabledColor: 'var(--t-accent-accent4060)' },
    danger: { border: 'var(--t-border-color-danger)', color: 'var(--t-font-color-danger)', hover: 'var(--t-background-danger)', active: 'var(--t-background-danger)', disabledColor: 'var(--t-color-red5)' },
    green: { border: 'var(--t-color-green9)', color: 'var(--t-color-green9)', hover: 'var(--t-color-green3)', active: 'var(--t-color-green4)', disabledColor: 'var(--t-color-green3)' },
  },
};
M.tertiary = Object.fromEntries(Object.entries(M.secondary).map(([k, v]) => [k, { ...v, border: 'transparent' }]));
const RADIUS = { standalone: 'var(--t-border-radius-md)', left: 'var(--t-border-radius-md) 0 0 var(--t-border-radius-md)', middle: '0', right: '0 var(--t-border-radius-md) var(--t-border-radius-md) 0' };
const BW = { standalone: '1px', left: '1px 0 1px 1px', middle: '1px 0', right: '1px 1px 1px 0' };

export function Button({ title, icon, Icon: IconComp, variant = 'primary', accent = 'default', size = 'medium', position = 'standalone', fullWidth = false, disabled = false, justify = 'flex-start', onClick, type = 'button', ariaLabel, hotkeys, className, style, dataTestId }) {
  const [hover, setHover] = React.useState(false);
  const [down, setDown] = React.useState(false);
  const t = (M[variant] || M.primary)[accent] || M[variant].default;
  const bg = disabled ? (t.disabledBg || t.bg || 'transparent') : down ? t.active : hover ? t.hover : (t.bg || 'transparent');
  const glyph = icon ? icon : IconComp ? <Icon name={IconComp} size={16} /> : null;
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled} aria-label={ariaLabel} className={className} data-testid={dataTestId}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setDown(false); }} onMouseDown={() => setDown(true)} onMouseUp={() => setDown(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', justifyContent: justify, height: size === 'small' ? 24 : 32, padding: '0 var(--t-spacing-2)', width: fullWidth ? '100%' : 'auto', whiteSpace: 'nowrap', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', fontWeight: 500, lineHeight: 1, borderStyle: 'solid', borderWidth: BW[position], borderColor: t.border, borderRadius: RADIUS[position], boxSizing: 'border-box', background: bg, color: disabled ? (t.disabledColor || t.color) : t.color, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background 0.1s ease', ...style }}>
      {glyph}
      {title ? <span style={{ padding: glyph ? '0 var(--t-spacing-1) 0 0' : '0 var(--t-spacing-1)' }}>{title}</span> : null}
      {hotkeys ? <span style={{ display: 'flex', gap: 2, marginLeft: 'var(--t-spacing-1)' }}>{hotkeys.map((k) => <kbd key={k} style={{ fontFamily: 'inherit', fontSize: 'var(--t-font-size-sm)', fontWeight: 500, padding: '0 4px', height: 16, display: 'inline-flex', alignItems: 'center', borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-transparent-light)', color: 'inherit', opacity: 0.8 }}>{k}</kbd>)}</span> : null}
    </button>
  );
}
