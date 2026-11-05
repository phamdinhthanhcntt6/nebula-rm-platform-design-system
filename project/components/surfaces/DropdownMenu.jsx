import React from 'react';
import { Icon } from '../core/Icon.jsx';
// DropdownMenu + MenuItem as shipped on the Customers page (DdSurface / DdSearch / DdItem): translucent primary
// surface with medium blur, search row without icon (12px text), 32px rows with 4px side padding and currentColor check.
export function DropdownMenu({ children, width = 200, search, header, footer, style }) {
  return (
    <div role="menu" style={{ display: 'flex', flexDirection: 'column', width, maxWidth: '100%', background: 'var(--t-background-transparent-primary)', backdropFilter: 'var(--t-blur-medium)', WebkitBackdropFilter: 'var(--t-blur-medium)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', boxShadow: 'var(--t-box-shadow-strong)', overflow: 'hidden', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', fontWeight: 400, ...style }}>
      {header ? <div style={{ padding: 'var(--t-spacing-1) var(--t-spacing-2)', height: 32, display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', color: 'var(--t-font-color-tertiary)', fontWeight: 500, borderBottom: '1px solid var(--t-border-color-light)' }}>{header}</div> : null}
      {search ? <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, boxSizing: 'content-box', minHeight: 19, padding: 'var(--t-spacing-2)', borderBottom: '1px solid var(--t-border-color-light)' }}><input autoFocus value={search.value} onChange={(e) => search.onChange && search.onChange(e.target.value)} placeholder={search.placeholder || 'Search'} style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', padding: 0, fontFamily: 'inherit', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-primary)' }} /></div> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 'var(--t-spacing-1)', maxHeight: 320, overflowY: 'auto' }}>{children}</div>
      {footer ? <div style={{ borderTop: '1px solid var(--t-border-color-light)', padding: 'var(--t-spacing-1)' }}>{footer}</div> : null}
    </div>
  );
}
export function MenuItemSeparator() { return <div style={{ height: 1, background: 'var(--t-border-color-light)', margin: 'var(--t-spacing-1) 0' }} />; }
export function MenuItem({ text, LeftIcon, iconColor, LeftComponent, RightIcon, RightComponent, contextualText, hotKeys, hasSubMenu, accent = 'default', selected = false, focused = false, disabled = false, withIconContainer = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const color = disabled ? 'var(--t-font-color-light)' : accent === 'danger' ? 'var(--t-font-color-danger)' : accent === 'placeholder' ? 'var(--t-font-color-tertiary)' : 'var(--t-font-color-secondary)';
  const bg = focused || selected ? 'var(--t-background-transparent-light)' : hover && !disabled ? 'var(--t-background-transparent-light)' : 'transparent';
  return (
    <div role="menuitem" onClick={disabled ? undefined : onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 32, padding: '0 var(--t-spacing-1)', boxSizing: 'border-box', borderRadius: 'calc(var(--t-border-radius-md) - var(--t-spacing-1))', background: bg, color, cursor: disabled ? 'default' : 'pointer', userSelect: 'none', transition: 'background 0.1s ease', width: '100%', ...style }}>
      {LeftComponent ? LeftComponent : LeftIcon ? (withIconContainer ? <span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-transparent-light)' }}><Icon name={LeftIcon} size={14} color={iconColor} /></span> : <Icon name={LeftIcon} size={16} color={iconColor || 'var(--t-font-color-tertiary)'} />) : null}
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)' }}>{contextualText ? <span style={{ color: 'var(--t-font-color-tertiary)' }}>{contextualText}</span> : null}{text}</span>
      {hotKeys ? <span style={{ display: 'flex', gap: 2 }}>{hotKeys.map((k) => <kbd key={k} style={{ fontFamily: 'inherit', fontSize: 'var(--t-font-size-xs)', color: 'var(--t-font-color-light)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-sm)', padding: '0 4px', height: 16, display: 'inline-flex', alignItems: 'center' }}>{k}</kbd>)}</span> : null}
      {RightComponent}
      {RightIcon ? <Icon name={RightIcon} size={16} color="var(--t-font-color-tertiary)" /> : null}
      {selected && !RightIcon ? <Icon name="check" size={16} color="currentColor" /> : null}
      {hasSubMenu ? <Icon name="chevron-right" size={14} color="var(--t-font-color-light)" /> : null}
    </div>
  );
}
