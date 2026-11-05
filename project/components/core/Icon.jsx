import React from 'react';
// Tabler icon glyph (webfont). Twenty renders @tabler/icons-react; the webfont
// is the closest zero-build equivalent. size in px, stroke ignored by webfont.
export function Icon({ name, size = 16, color, style, className }) {
  return <i aria-hidden className={'ti ti-' + name + (className ? ' ' + className : '')} style={{ fontSize: size, width: size, height: size, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0, ...style }} />;
}
