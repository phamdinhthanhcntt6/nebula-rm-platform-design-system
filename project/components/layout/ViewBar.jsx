import React from 'react';
import { Icon } from '../core/Icon.jsx';
// simplize-front ui/layout/top-bar TopBar + views ViewBar — 39px row: view picker left; Filter · Sort · Options right.
export function ViewBar({ viewName, viewIcon = 'list', count, actions = ['Filter', 'Sort', 'Options'], onAction, bottomComponent, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 'var(--t-spacing-3)', borderBottom: '1px solid var(--t-border-color-light)', fontFamily: 'var(--t-font-family)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 39, boxSizing: 'border-box', paddingRight: 'var(--t-spacing-2)', color: 'var(--t-font-color-secondary)', fontWeight: 500 }}>
        <ViewPicker name={viewName} icon={viewIcon} count={count} />
        <div style={{ display: 'flex', gap: 2, fontWeight: 400 }}>{actions.map((a) => <ViewBarButton key={a} label={a} onClick={() => onAction && onAction(a)} />)}</div>
      </div>
      {bottomComponent}
    </div>
  );
}
export function ViewPicker({ name, icon, count }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button type="button" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 32, padding: '0 var(--t-spacing-2) 0 var(--t-spacing-1)', border: 'none', borderRadius: 'var(--t-border-radius-sm)', background: hover ? 'var(--t-background-transparent-light)' : 'transparent', color: 'var(--t-font-color-secondary)', fontFamily: 'inherit', fontSize: 'var(--t-font-size-md)', fontWeight: 500, cursor: 'pointer', maxWidth: 260 }}>
      <Icon name={icon} size={16} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</span>
      {count !== undefined ? <span style={{ color: 'var(--t-font-color-light)', fontWeight: 400 }}>· {count}</span> : null}
      <Icon name="chevron-down" size={14} color="var(--t-font-color-tertiary)" />
    </button>
  );
}
export function ViewBarButton({ label, Icon: name, onClick, active }) {
  const [hover, setHover] = React.useState(false);
  return <button type="button" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 24, padding: '0 var(--t-spacing-2)', border: 'none', borderRadius: 'var(--t-border-radius-sm)', background: hover || active ? 'var(--t-background-transparent-light)' : 'transparent', color: active ? 'var(--t-font-color-primary)' : 'var(--t-font-color-secondary)', fontFamily: 'inherit', fontSize: 'var(--t-font-size-md)', cursor: 'pointer' }}>{name ? <Icon name={name} size={14} /> : null}{label}</button>;
}
