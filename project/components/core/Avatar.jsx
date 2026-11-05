import React from 'react';
// simplize-ui data-display/Avatar. Placeholder = first letter on a hue derived
// from the seed string (stringToThemeColor): text = step 12, background = step 4.
const HUES = ['gray','red','orange','yellow','green','turquoise','blue','purple','pink','sky','amber','violet'];
const H12 = { gray:'color(display-p3 0.2 0.2 0.2)', red:'color(display-p3 0.4 0.13 0.13)', orange:'color(display-p3 0.4 0.2 0.05)', yellow:'color(display-p3 0.3 0.25 0.02)', green:'color(display-p3 0.13 0.28 0.19)', turquoise:'color(display-p3 0.05 0.27 0.25)', blue:'color(display-p3 0.133 0.175 0.348)', purple:'color(display-p3 0.25 0.13 0.38)', pink:'color(display-p3 0.38 0.1 0.27)', sky:'color(display-p3 0.1 0.25 0.35)', amber:'color(display-p3 0.3 0.2 0.05)', violet:'color(display-p3 0.2 0.15 0.4)' };
const H4 = { gray:'color(display-p3 0.945 0.945 0.945)', red:'color(display-p3 0.98 0.88 0.87)', orange:'color(display-p3 0.99 0.9 0.8)', yellow:'color(display-p3 0.99 0.96 0.7)', green:'color(display-p3 0.87 0.94 0.89)', turquoise:'color(display-p3 0.84 0.95 0.92)', blue:'color(display-p3 0.885 0.914 1)', purple:'color(display-p3 0.94 0.9 0.98)', pink:'color(display-p3 0.97 0.88 0.94)', sky:'color(display-p3 0.85 0.93 0.98)', amber:'color(display-p3 0.99 0.93 0.75)', violet:'color(display-p3 0.92 0.91 0.99)' };
export function hueFromString(s = '') { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return HUES[h % HUES.length]; }
const SIZES = { xl: [40, 16], lg: [24, 13], md: [16, 12], sm: [14, 10], xs: [12, 8] };
export function Avatar({ placeholder = '', placeholderColorSeed, avatarUrl, size = 'md', type = 'squared', Icon: icon, color, backgroundColor, onClick, style }) {
  const [px, fs] = SIZES[size] || SIZES.md;
  const ch = placeholder.trim().charAt(0).toUpperCase() || '-';
  const empty = ch === '-';
  const hue = hueFromString(placeholderColorSeed || placeholder);
  const fg = empty ? 'var(--t-font-color-tertiary)' : color || H12[hue];
  const bg = empty ? 'var(--t-background-transparent-light)' : backgroundColor || H4[hue];
  const radius = type === 'rounded' ? '50%' : type === 'icon' ? 'var(--t-border-radius-sm)' : 'var(--t-border-radius-xs)';
  return (
    <div role={onClick ? 'button' : undefined} onClick={onClick} style={{ width: px, height: px, fontSize: fs, borderRadius: radius, background: icon ? 'inherit' : avatarUrl ? 'none' : bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', userSelect: 'none', fontWeight: 500, cursor: onClick ? 'pointer' : undefined, fontFamily: 'var(--t-font-family)', ...style }}>
      {icon ? icon : avatarUrl ? <div style={{ width: '100%', height: '100%', backgroundImage: 'url(' + avatarUrl + ')', backgroundSize: 'cover', backgroundPosition: 'center' }} /> : ch}
    </div>
  );
}
