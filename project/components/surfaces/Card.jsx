import React from 'react';
import { Tag } from '../core/Tag.jsx';
// simplize-ui surfaces/Card — 1px medium border, 8px radius, transparent background.
export function Card({ children, fullWidth = false, background, style }) {
  return <div style={{ border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', color: 'var(--t-font-color-secondary)', overflow: 'hidden', width: fullWidth ? '100%' : 'auto', background: background || 'transparent', ...style }}>{children}</div>;
}
export function CardContent({ children, divider = true, style }) {
  return <div style={{ padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderTop: divider ? '1px solid var(--t-border-color-medium)' : 'none', ...style }}>{children}</div>;
}
// Customers page C360Block — content block on a record page: 12px padding, 8px gap, medium border, 8px radius, primary bg.
// Header: 13px/500 title, optional purple sm tool Tag, 12px light meta, right slot. highlight = accent-tertiary border + accent-quaternary fill, semi-bold title.
export function BlockCard({ title, tool, meta, right, children, highlight = false, dim = false, style }) {
  return (
    <div style={{ minWidth: 0, opacity: dim ? 0.55 : 1, display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-3)', boxSizing: 'border-box', border: '1px solid ' + (highlight ? 'var(--t-accent-tertiary)' : 'var(--t-border-color-medium)'), borderRadius: 'var(--t-border-radius-md)', background: highlight ? 'var(--t-accent-quaternary)' : 'var(--t-background-primary)', fontFamily: 'var(--t-font-family)', color: 'var(--t-font-color-primary)', ...style }}>
      {title || meta || right ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--t-spacing-2)' }}>
          <span style={{ fontSize: 'var(--t-font-size-md)', fontWeight: highlight ? 'var(--t-font-weight-semi-bold)' : 'var(--t-font-weight-medium)' }}>{title}</span>
          {tool ? <span style={{ flexShrink: 0 }}><Tag text={tool} color="purple" size="sm" preventShrink /></span> : null}
          <span style={{ flex: 1 }} />
          {meta ? <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)', whiteSpace: 'nowrap' }}>{meta}</span> : null}
          {right}
        </div>
      ) : null}
      {children}
    </div>
  );
}
