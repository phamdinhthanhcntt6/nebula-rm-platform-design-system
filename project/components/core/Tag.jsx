import React from 'react';
import { Icon } from './Icon.jsx';
// simplize-ui data-display/Tag — select/enum option pill (20px tall, 4px radius, tag hue pair).
export function Tag({ text, color = 'gray', Icon: name, weight = 'regular', variant = 'solid', size = 'md', preventShrink, preventPadding, onClick, style }) {
  const transparent = color === 'transparent';
  return (
    <span onClick={onClick} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 20, padding: preventPadding ? 0 : '0 var(--t-spacing-2)', boxSizing: 'content-box', borderRadius: 'var(--t-border-radius-sm-round)', background: transparent ? 'transparent' : 'var(--t-tag-background-' + color + ', var(--t-tag-background-gray))', color: transparent ? 'var(--t-font-color-secondary)' : 'var(--t-tag-text-' + color + ', var(--t-font-color-secondary))', fontSize: size === 'sm' ? 'var(--t-font-size-sm)' : 'var(--t-font-size-md)', fontWeight: weight === 'medium' ? 500 : 400, border: variant === 'outline' ? '1px dashed var(--t-border-color-strong)' : variant === 'border' ? '1px solid var(--t-border-color-strong)' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', minWidth: preventShrink ? 'fit-content' : undefined, cursor: onClick ? 'pointer' : undefined, ...style }}>
      {name ? <Icon name={name} size={14} /> : null}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{text}</span>
    </span>
  );
}
