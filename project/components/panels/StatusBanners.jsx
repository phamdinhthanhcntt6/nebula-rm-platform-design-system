import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { LightButton } from '../core/LightButton.jsx';
// Stacked status banners at the top of a screen or panel (RecordBanners / WfBanners). 28px min, 2px/8px padding, 4px radius,
// tag-background fill, 14px tone icon, 13px primary text, optional tertiary LightButton action. Shows 2, then "Còn N cảnh báo".
const TONE = {
  block: ['alert-triangle', 'var(--t-tag-text-red)', 'var(--t-tag-background-red)'],
  warn: ['alert-triangle', 'var(--t-tag-text-yellow)', 'var(--t-tag-background-yellow)'],
  info: ['info-circle', 'var(--t-tag-text-blue)', 'var(--t-tag-background-blue)'],
};
export function StatusBanners({ items = [], pad = 'var(--t-spacing-2) var(--t-spacing-3)', max = 2, style }) {
  const [more, setMore] = React.useState(false);
  if (!items.length) return null;
  const shown = more ? items : items.slice(0, max);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)', padding: pad, fontFamily: 'var(--t-font-family)', ...style }}>
      {shown.map((b, i) => {
        const t = TONE[b.tone] || TONE.info;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minHeight: 28, padding: '2px var(--t-spacing-2)', boxSizing: 'border-box', borderRadius: 'var(--t-border-radius-sm)', background: t[2], fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)' }}>
            <Icon name={t[0]} size={14} color={t[1]} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1, minWidth: 0 }}>{b.text}</span>
            {b.action ? <span style={{ flexShrink: 0 }}><LightButton title={b.action} accent="tertiary" onClick={b.onAction} /></span> : null}
          </div>
        );
      })}
      {items.length > max ? <span style={{ display: 'flex' }}><LightButton title={more ? 'Thu gọn cảnh báo' : 'Còn ' + (items.length - max) + ' cảnh báo'} Icon={more ? 'chevron-up' : 'chevron-down'} accent="tertiary" onClick={() => setMore((m) => !m)} /></span> : null}
    </div>
  );
}
// In-block state (BlockState): loading = 3 skeleton bars + "Đang tải…"; error / denied / empty = 14px icon + 13px tertiary text.
export function BlockState({ state = 'empty', note, onRetry }) {
  if (state === 'loading') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-1) 0' }}>
      {[88, 72, 60].map((w, i) => <span key={i} style={{ height: 12, width: w + '%', borderRadius: 'var(--t-border-radius-xs)', background: 'var(--t-background-transparent-light)' }} />)}
      <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)' }}>Đang tải…</span>
    </div>
  );
  const cfg = state === 'error' ? ['alert-triangle', 'var(--t-tag-text-red)', 'Không tải được dữ liệu. Số liệu hiển thị có thể không đầy đủ.']
    : state === 'denied' ? ['lock', 'var(--t-font-color-light)', 'Bạn không có quyền xem phần này.']
    : ['circle-dashed', 'var(--t-font-color-light)', 'Chưa có dữ liệu.'];
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-3) 0', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-tertiary)', fontFamily: 'var(--t-font-family)' }}>
      <Icon name={cfg[0]} size={14} color={cfg[1]} style={{ flexShrink: 0, marginTop: 3 }} />
      <span style={{ flex: 1, minWidth: 0, lineHeight: 1.5 }}>{note || cfg[2]}</span>
      {state === 'error' && onRetry ? <LightButton title="Thử lại" Icon="refresh" accent="tertiary" onClick={onRetry} /> : null}
    </div>
  );
}
// Table loading skeleton (GvSkeleton): 32px rows, light bottom rule, 10px bars of varying width, 40px left inset for the checkbox column.
export function TableSkeleton({ rows = 6, columns = [220, 150, 90, 180, 90] }) {
  return <div>{Array.from({ length: rows }, (_, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-6)', height: 32, padding: '0 var(--t-spacing-3) 0 40px', borderBottom: '1px solid var(--t-border-color-light)' }}>{columns.map((w, j) => <span key={j} style={{ height: 10, width: w - ((i * 17 + j * 11) % 40), borderRadius: 'var(--t-border-radius-xs)', background: 'var(--t-background-transparent-light)' }} />)}</div>)}</div>;
}
