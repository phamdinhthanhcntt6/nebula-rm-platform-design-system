import React from 'react';
import { Button } from '../core/Button.jsx';
import { TextInput } from '../forms/TextInput.jsx';
// Bordered settings / governance block (GvSection — 15 uses): primary bg, medium border, md radius.
// Header min 40px (12px left / 8px right), light bottom rule: 13px/500 title + 12px tertiary meta + right actions. Body 12px padding, 12px gap.
export function SettingsSection({ title, meta, actions, pad = true, children, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'var(--t-background-primary)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', overflow: 'hidden', flexShrink: 0, fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minHeight: 40, padding: '0 var(--t-spacing-2) 0 var(--t-spacing-3)', borderBottom: '1px solid var(--t-border-color-light)', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 500 }}>{title}</span>
        {meta ? <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' }}>{meta}</span> : null}
        <span style={{ flex: 1 }} />
        {actions}
      </div>
      <div style={pad ? { display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-3)' } : undefined}>{children}</div>
    </div>
  );
}
// Pending-change bar (GvSaveBar): blue border, accent-quaternary fill, md radius, 12px padding. Required reason textarea + Huỷ / Lưu.
export function SaveBar({ label = 'Lý do thay đổi * · ghi vào nhật ký', onCancel, onSave, style }) {
  const [why, setWhy] = React.useState('');
  const [err, setErr] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-md)', border: '1px solid var(--t-color-blue)', background: 'var(--t-accent-quaternary)', flexWrap: 'wrap', flexShrink: 0, ...style }}>
      <span style={{ flex: '1 1 320px' }}><TextInput label={label} multiline rows={2} value={why} placeholder="Ghi rõ lý do" error={err ? 'Cần lý do' : undefined} onChange={(v) => { setWhy(v); setErr(false); }} fullWidth /></span>
      <Button title="Huỷ" variant="secondary" size="small" onClick={onCancel} />
      <Button title="Lưu" accent="blue" size="small" onClick={() => { if (!why.trim()) { setErr(true); return; } onSave && onSave(why.trim()); }} />
    </div>
  );
}
