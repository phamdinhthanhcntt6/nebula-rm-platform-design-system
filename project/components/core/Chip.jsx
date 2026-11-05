import React from 'react';
import { Avatar } from './Avatar.jsx';
// simplize-ui data-display/Chip — the "avatar + label" pill that renders every
// relation value (person, company, stage) in tables, cards and fields.
export function Chip({ label, leftComponent, avatar = true, avatarType = 'squared', size = 'small', variant = 'regular', accent = 'text-primary', isBold = false, disabled = false, clickable = true, maxWidth, onClick, style, emptyLabel = 'Untitled' }) {
  const [hover, setHover] = React.useState(false);
  const interactive = variant === 'regular' && clickable && !disabled;
  let bg = 'inherit';
  if (variant === 'highlighted' || variant === 'static') bg = 'var(--t-background-transparent-light)';
  if (variant === 'highlighted' && hover) bg = 'var(--t-background-transparent-medium)';
  if (interactive && hover) bg = 'var(--t-background-transparent-light)';
  const color = disabled ? 'var(--t-font-color-light)' : accent === 'text-secondary' ? 'var(--t-font-color-secondary)' : 'var(--t-font-color-primary)';
  const left = leftComponent !== undefined ? leftComponent : avatar ? <Avatar placeholder={label} type={avatarType} size="md" /> : null;
  return (
    <div data-testid="chip" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: size === 'large' ? 16 : 12, boxSizing: 'content-box', padding: variant === 'transparent' ? '4px 4px 4px 0' : 'var(--t-spacing-1)', borderRadius: 'var(--t-border-radius-sm-round)', background: bg, color, fontWeight: isBold || accent === 'text-secondary' ? 500 : 'inherit', fontSize: 'var(--t-font-size-md)', maxWidth: maxWidth ? maxWidth - 8 : '100%', overflow: 'hidden', whiteSpace: 'nowrap', userSelect: 'none', cursor: variant === 'transparent' ? 'inherit' : clickable ? 'pointer' : disabled ? 'not-allowed' : 'inherit', ...style }}>
      {left}
      {label ? <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span> : <span style={{ color: 'var(--t-font-color-tertiary)' }}>{emptyLabel}</span>}
    </div>
  );
}
