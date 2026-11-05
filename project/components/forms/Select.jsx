import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Tag } from '../core/Tag.jsx';
import { DropdownMenu, MenuItem } from '../surfaces/DropdownMenu.jsx';
// Select as shipped on the Customers page (InlineSelect caret): trigger styled like TextInput — primary bg, medium border,
// no focus halo, 14px light chevron. md = 32px form field, sm = 28px inline trigger. Menu = DropdownMenu of MenuItems.
export function Select({ value, options = [], onChange, placeholder = 'Select…', label, fullWidth = false, disabled = false, withSearch = false, sizeVariant = 'md', style }) {
  const [open, setOpen] = React.useState(false);
  const [q, setQ] = React.useState('');
  const sel = options.find((o) => o.value === value);
  const shown = withSearch && q ? options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())) : options;
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)', width: fullWidth ? '100%' : 'auto', ...style }}>
      {label ? <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' }}>{label}</span> : null}
      <button type="button" disabled={disabled} onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: sizeVariant === 'sm' ? 28 : 32, padding: sizeVariant === 'sm' ? '0 var(--t-spacing-1) 0 var(--t-spacing-2)' : '0 var(--t-spacing-2)', border: '1px solid ' + (open ? 'var(--t-color-blue)' : 'var(--t-border-color-medium)'), borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-primary)', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', color: sel ? 'var(--t-font-color-primary)' : 'var(--t-font-color-light)', cursor: disabled ? 'not-allowed' : 'pointer', width: '100%', boxSizing: 'border-box' }}>
        {sel && sel.color ? <Tag text={sel.label} color={sel.color} /> : <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sel ? sel.label : placeholder}</span>}
        {sel && sel.color ? <span style={{ flex: 1 }} /> : null}
        <Icon name="chevron-down" size={14} color="var(--t-font-color-light)" />
      </button>
      {open ? (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 2, zIndex: 20, minWidth: '100%' }}>
          <DropdownMenu width={sel ? undefined : 200} search={withSearch ? { value: q, onChange: setQ, placeholder: 'Search' } : undefined}>
            {shown.map((o) => <MenuItem key={o.value} text={o.color ? <Tag text={o.label} color={o.color} /> : o.label} LeftIcon={o.Icon} selected={o.value === value} onClick={() => { onChange && onChange(o.value); setOpen(false); setQ(''); }} />)}
          </DropdownMenu>
        </div>
      ) : null}
    </div>
  );
}
