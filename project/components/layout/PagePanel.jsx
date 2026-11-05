import React from 'react';
// simplize-front ui/layout/page PageBody + PagePanel — white panel flush to the right/bottom edges of the gray3 canvas,
// 1px medium border on its left/top and an 8px top-left radius (as deployed on dev).
export function PageBody({ children, style }) {
  return <div style={{ display: 'flex', flex: '1 1 auto', gap: 'var(--t-spacing-2)', minHeight: 0, padding: 0, boxSizing: 'border-box', width: '100%', ...style }}>{children}</div>;
}
export function PagePanel({ children, style }) {
  return <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, height: '100%', background: 'var(--t-background-primary)', borderLeft: '1px solid var(--t-border-color-medium)', borderTop: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md) 0 0 0', overflow: 'hidden', boxSizing: 'border-box', ...style }}>{children}</div>;
}
// DefaultLayout: gray3 canvas, drawer left, main right.
export function AppLayout({ drawer, children, style }) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', background: 'var(--t-gray-scale-gray3)', overflow: 'hidden', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)', ...style }}>
      {drawer ? <div style={{ flexShrink: 0, height: '100%' }}>{drawer}</div> : null}
      <div style={{ display: 'flex', flexDirection: 'column', flex: '0 1 100%', minWidth: 0, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}
