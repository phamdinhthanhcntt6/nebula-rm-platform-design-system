import React from 'react';
import { Icon } from '../core/Icon.jsx';
// 16px icon tile used before titles in panel heads, list rows and timelines (WfTile, MvpAttTile, drawer object icons).
// hue → --t-object-tile-<hue> fill + --t-object-tile-border-<hue> + --t-tag-text-<hue> glyph.
// gray (default) → --t-background-tertiary fill, medium border, secondary glyph. Glyph = size - 2.
export function ObjectTile({ Icon: name, hue = 'gray', size = 16, style }) {
  const gray = hue === 'gray';
  return (
    <span style={{ width: size, height: size, borderRadius: 'var(--t-border-radius-sm)', background: gray ? 'var(--t-background-tertiary)' : 'var(--t-object-tile-' + hue + ')', border: '1px solid ' + (gray ? 'var(--t-border-color-medium)' : 'var(--t-object-tile-border-' + hue + ')'), boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...style }}>
      <Icon name={name} size={size - 2} color={gray ? 'var(--t-font-color-secondary)' : 'var(--t-tag-text-' + hue + ')'} />
    </span>
  );
}
