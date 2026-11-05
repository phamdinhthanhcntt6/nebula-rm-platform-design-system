import React from 'react';
import { Icon } from '../core/Icon.jsx';
// simplize-front object-record/record-inline-cell RecordInlineCellContainer — show-page field: 16px icon + tertiary 12px label (fixed width) + value.
export function FieldRow({ label, Icon: name, value, placeholder, labelWidth = 140, readonly = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', minHeight: 24, width: '100%', cursor: readonly ? 'default' : 'pointer', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 24, color: 'var(--t-font-color-tertiary)', alignSelf: 'flex-start', flexShrink: 0 }}>
        <span style={{ width: 16, display: 'flex' }}>{name ? <Icon name={name} size={16} /> : null}</span>
        <span style={{ width: labelWidth, fontSize: 'var(--t-font-size-sm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1, minHeight: 24, padding: '0 var(--t-spacing-1)', borderRadius: 'var(--t-border-radius-sm)', background: hover && !readonly ? 'var(--t-background-transparent-light)' : 'transparent', color: 'var(--t-font-color-primary)', overflow: 'hidden', whiteSpace: 'nowrap', userSelect: 'text' }}>
        {value !== undefined && value !== null && value !== '' ? value : <span style={{ color: 'var(--t-font-color-light)' }}>{placeholder || label}</span>}
      </div>
    </div>
  );
}
// Collapsible field group (RecordFieldList section) with title + chevron.
export function FieldGroup({ title, children, isOpen = true, onToggle, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', ...style }}>
      <div onClick={onToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 32, fontSize: 'var(--t-font-size-md)', fontWeight: 500, color: 'var(--t-font-color-tertiary)', cursor: onToggle ? 'pointer' : 'default' }}>
        <span>{title}</span>
        <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} color="var(--t-font-color-light)" />
      </div>
      {isOpen ? <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)' }}>{children}</div> : null}
    </div>
  );
}
