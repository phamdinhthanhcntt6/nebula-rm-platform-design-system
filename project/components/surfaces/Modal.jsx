import React from 'react';
import { Button } from '../core/Button.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Icon } from '../core/Icon.jsx';
// simplize-front ui/layout/modal — centered panel over overlay-secondary; ConfirmationModal footer pattern.
export function Modal({ children, size = 'medium', padding = 'medium', isOpen = true, onClose, inline = false, style }) {
  if (!isOpen) return null;
  const w = { small: 300, medium: 400, large: 53 * 13, extraLarge: 800 }[size] || 400;
  const p = { none: 0, small: 'var(--t-spacing-2)', medium: 'var(--t-spacing-6)', large: 'var(--t-spacing-10)' }[padding];
  const panel = <div role="dialog" style={{ width: w, maxWidth: '100%', background: 'var(--t-background-primary)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', boxShadow: 'var(--t-box-shadow-super-heavy)', padding: p, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-4)', color: 'var(--t-font-color-primary)', ...style }}>{children}</div>;
  if (inline) return panel;
  return <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'var(--t-background-overlay-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}><div onClick={(e) => e.stopPropagation()}>{panel}</div></div>;
}
export function ConfirmationModal({ title, subtitle, confirmButtonText = 'Confirm', confirmButtonAccent = 'danger', onConfirm, onClose, isOpen = true, inline }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} inline={inline} size="small">
      <div style={{ fontSize: 'var(--t-font-size-lg)', fontWeight: 500, textAlign: 'center' }}>{title}</div>
      {subtitle ? <div style={{ fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-secondary)', textAlign: 'center', lineHeight: 1.5 }}>{subtitle}</div> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)' }}>
        <Button title="Cancel" variant="secondary" fullWidth justify="center" onClick={onClose} />
        <Button title={confirmButtonText} accent={confirmButtonAccent} fullWidth justify="center" onClick={onConfirm} />
      </div>
    </Modal>
  );
}

// Customers page MvpDialog — the working dialog: 440px, 8px radius, medium border, strong shadow, 28% black overlay.
// Header 12px padding (16px icon + 13px/500 title + small close), body 12px padding / 12px gap, footer: secondary left, primary right.
// footerAlign 'end' = Full Scope CaseDlgShell / WfModal: both buttons right-aligned, 560px, no header icon.
export function Dialog({ title, Icon: icon = 'circle-check', iconColor = 'var(--t-font-color-tertiary)', children, width = 440, primary, secondary = { title: 'Huỷ' }, footerLeft, footerAlign = 'split', onClose, isOpen = true, inline = false, style }) {
  if (!isOpen) return null;
  const panel = (
    <div role="dialog" style={{ width, maxWidth: inline ? '100%' : 'calc(100vw - 32px)', maxHeight: inline ? undefined : 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', background: 'var(--t-background-primary)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', boxShadow: 'var(--t-box-shadow-strong)', fontFamily: 'var(--t-font-family)', color: 'var(--t-font-color-primary)', boxSizing: 'border-box', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-3)', borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 }}>
        {icon ? <Icon name={icon} size={16} color={iconColor} /> : null}
        <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--t-font-size-md)', fontWeight: 500 }}>{title}</span>
        <IconButton Icon="x" variant="light" accent="tertiary" size="small" ariaLabel="Đóng" onClick={onClose} />
      </div>
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--t-spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' }}>{children}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderTop: '1px solid var(--t-border-color-light)', flexShrink: 0 }}>
        {footerAlign === 'end' ? <React.Fragment>{footerLeft}<span style={{ flex: 1 }} /></React.Fragment> : null}
        {secondary ? <Button title={secondary.title} variant="secondary" size="small" onClick={secondary.onClick || onClose} /> : null}
        {footerAlign === 'end' ? null : <React.Fragment>{footerLeft}<span style={{ flex: 1 }} /></React.Fragment>}
        {primary ? <Button title={primary.title} accent={primary.accent || 'blue'} size="small" disabled={primary.disabled} onClick={primary.onClick} /> : null}
      </div>
    </div>
  );
  if (inline) return panel;
  return <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div onClick={(e) => e.stopPropagation()}>{panel}</div></div>;
}
