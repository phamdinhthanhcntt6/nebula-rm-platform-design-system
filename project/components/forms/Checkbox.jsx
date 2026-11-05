import React from 'react';
import { Icon } from '../core/Icon.jsx';
// simplize-ui input/Checkbox — 12px box (small) / 18px (large), 4px radius, blue fill when checked.
export function Checkbox({ checked = false, indeterminate = false, onChange, variant = 'primary', size = 'small', shape = 'squared', accent = 'blue', hoverable = true, disabled = false, ariaLabel, style }) {
  const [hover, setHover] = React.useState(false);
  const box = size === 'large' ? 18 : 12;
  const on = checked || indeterminate;
  const acc = accent === 'orange' ? 'var(--t-color-orange)' : 'var(--t-color-blue)';
  const borderColor = disabled ? (on ? (accent === 'orange' ? 'var(--t-color-orange7)' : 'var(--t-color-blue7)') : 'var(--t-border-color-strong)') : on ? acc : variant === 'primary' ? 'var(--t-border-color-inverted)' : variant === 'secondary' ? 'var(--t-border-color-secondary-inverted)' : 'var(--t-border-color-medium)';
  const bg = on ? (disabled ? (accent === 'orange' ? 'var(--t-color-orange7)' : 'var(--t-color-blue7)') : acc) : 'transparent';
  const pad = hoverable ? (size === 'large' ? 6 : 5) : 0;
  return (
    <button type="button" role="checkbox" aria-checked={indeterminate ? 'mixed' : checked} aria-label={ariaLabel} disabled={disabled}
      onClick={() => !disabled && onChange && onChange(!checked)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: pad, border: 'none', background: hover && hoverable && !disabled ? (on ? (accent === 'orange' ? 'var(--t-background-transparent-orange)' : 'var(--t-background-transparent-blue)') : 'var(--t-background-transparent-light)') : 'transparent', borderRadius: shape === 'rounded' ? '100%' : 'var(--t-border-radius-md-round)', cursor: disabled ? 'not-allowed' : 'pointer', ...style }}>
      <span style={{ position: 'relative', width: box, height: box, boxSizing: 'content-box', border: (variant === 'tertiary' || size === 'large' ? 1.43 : 1) + 'px solid ' + borderColor, borderRadius: shape === 'rounded' ? '100%' : 'var(--t-border-radius-sm-round)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-font-color-inverted)' }}>
        {on ? <Icon name={indeterminate ? 'minus' : 'check'} size={box + 2} style={{ fontWeight: 700 }} /> : null}
      </span>
    </button>
  );
}
