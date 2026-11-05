import React from 'react';
import { Icon } from '../core/Icon.jsx';
// Field as shipped on the Customers page (MVP_INPUT): 32px, 4px radius, 1px medium border, primary background.
// Focus = blue border only (no halo). sm = 24px inline-edit field (blue border + light shadow while focused).
// Label = 12px tertiary, sentence case. multiline = textarea with 8px padding, vertical resize.
export function TextInput({ value, defaultValue, onChange, placeholder, label, error, hint, LeftIcon, RightIcon, onRightIconClick, disabled = false, fullWidth = false, sizeVariant = 'md', multiline = false, rows = 3, type = 'text', autoFocus, name, onBlur, onKeyDown, style, inputStyle }) {
  const [focus, setFocus] = React.useState(false);
  const sm = sizeVariant === 'sm';
  const border = error ? 'var(--t-color-red)' : focus ? 'var(--t-color-blue)' : 'var(--t-border-color-medium)';
  const common = { value, defaultValue, name, placeholder, disabled, autoFocus, onChange: (e) => onChange && onChange(e.target.value, e), onFocus: () => setFocus(true), onBlur: (e) => { setFocus(false); onBlur && onBlur(e); }, onKeyDown };
  const text = { fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)' };
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)', width: fullWidth ? '100%' : 'auto', ...style }}>
      {label ? <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' }}>{label}</span> : null}
      {multiline ? (
        <textarea {...common} rows={rows} style={{ ...text, width: '100%', boxSizing: 'border-box', padding: 'var(--t-spacing-2)', border: '1px solid ' + border, borderRadius: 'var(--t-border-radius-sm)', background: disabled ? 'var(--t-background-secondary)' : 'var(--t-background-primary)', outline: 'none', resize: 'vertical', lineHeight: 1.4, ...inputStyle }} />
      ) : (
        <span style={{ display: 'flex', alignItems: 'center', height: sm ? 24 : 32, boxSizing: 'border-box', border: '1px solid ' + border, borderRadius: 'var(--t-border-radius-sm)', background: disabled ? 'var(--t-background-secondary)' : 'var(--t-background-primary)', padding: sm ? '0 var(--t-spacing-1)' : '0 var(--t-spacing-2)', gap: 'var(--t-spacing-1)', boxShadow: sm && focus ? 'var(--t-box-shadow-light)' : 'none', width: '100%' }}>
          {LeftIcon ? <Icon name={LeftIcon} size={16} color="var(--t-font-color-light)" /> : null}
          <input type={type} {...common} style={{ ...text, flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', padding: 0, height: '100%', ...inputStyle }} />
          {RightIcon ? <Icon name={RightIcon} size={16} color="var(--t-font-color-light)" style={{ cursor: onRightIconClick ? 'pointer' : undefined }} onClick={onRightIconClick} /> : null}
        </span>
      )}
      {error ? <span style={{ fontSize: 'var(--t-font-size-xs)', color: 'var(--t-color-red)' }}>{error}</span> : hint ? <span style={{ fontSize: 'var(--t-font-size-xs)', color: 'var(--t-font-color-light)' }}>{hint}</span> : null}
    </label>
  );
}
