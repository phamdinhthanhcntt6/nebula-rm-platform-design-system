import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
// simplize-ui feedback/SnackBar — dark inverted toast, bottom-left of the page.
const IC = { info: 'info-circle', success: 'circle-check', error: 'alert-circle', warning: 'alert-triangle' };
export function SnackBar({ variant = 'info', title, message, onCancel, onClose, cancelLabel = 'Undo', duration, compact = false, style }) {
  // compact = Customers page MvpToast: one line, 8px/12px padding, 14px white check, auto width.
  if (compact) return <div role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-primary-inverted)', color: 'var(--t-font-color-inverted)', boxShadow: 'var(--t-box-shadow-strong)', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', ...style }}><Icon name="check" size={14} color="var(--t-font-color-inverted)" />{title || message}</div>;
  return (
    <div role="status" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--t-spacing-2)', width: 296, padding: 'var(--t-spacing-3)', boxSizing: 'border-box', background: 'var(--t-background-primary-inverted)', color: 'var(--t-font-color-inverted)', borderRadius: 'var(--t-border-radius-md)', boxShadow: 'var(--t-box-shadow-strong)', fontSize: 'var(--t-font-size-md)', position: 'relative', overflow: 'hidden', ...style }}>
      <Icon name={IC[variant] || IC.info} size={16} color={variant === 'error' ? 'var(--t-color-red)' : variant === 'success' ? 'var(--t-color-green)' : variant === 'warning' ? 'var(--t-color-orange)' : 'var(--t-color-blue)'} style={{ marginTop: 1 }} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {title ? <div style={{ fontWeight: 500 }}>{title}</div> : null}
        {message ? <div style={{ color: 'var(--t-border-color-strong)', lineHeight: 1.4 }}>{message}</div> : null}
      </div>
      {onCancel ? <button type="button" onClick={onCancel} style={{ border: 'none', background: 'transparent', color: 'var(--t-font-color-inverted)', fontFamily: 'inherit', fontSize: 'inherit', fontWeight: 500, cursor: 'pointer', padding: 0 }}>{cancelLabel}</button> : null}
      {onClose ? <IconButton Icon="x" variant="light" size="small" ariaLabel="Close" onClick={onClose} style={{ color: 'var(--t-font-color-inverted)', margin: -4 }} /> : null}
      {duration ? <div style={{ position: 'absolute', left: 0, bottom: 0, height: 2, width: '60%', background: 'var(--t-background-inverted-secondary)' }} /> : null}
    </div>
  );
}
