import React from 'react';
import { Icon } from '../core/Icon.jsx';
// simplize-front ui/layout/tab TabList — 40px row, 2px bottom border on active tab, icon+label 13px.
export function Tabs({ tabs = [], activeId, onChange, overflowLabel, style }) {
  return (
    <div role="tablist" style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 40, boxSizing: 'border-box', borderBottom: '1px solid var(--t-border-color-light)', padding: '0 var(--t-spacing-2)', userSelect: 'none', ...style }}>
      {tabs.map((t) => <Tab key={t.id} {...t} active={t.id === activeId} onClick={() => onChange && onChange(t.id)} />)}
      {overflowLabel ? <Tab label={overflowLabel} RightIcon="chevron-down" /> : null}
    </div>
  );
}
function Tab({ id, label, Icon: name, active, disabled, onClick, RightIcon, pill }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button role="tab" aria-selected={active} type="button" disabled={disabled} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 40, padding: '0 var(--t-spacing-2)', border: 'none', borderBottom: '2px solid ' + (active ? 'var(--t-font-color-primary)' : 'transparent'), marginBottom: -1, background: 'transparent', color: disabled ? 'var(--t-font-color-light)' : active ? 'var(--t-font-color-primary)' : hover ? 'var(--t-font-color-primary)' : 'var(--t-font-color-secondary)', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', fontWeight: 500, cursor: disabled ? 'default' : 'pointer', whiteSpace: 'nowrap' }}>
      {name ? <Icon name={name} size={16} /> : null}{label}{pill}
      {RightIcon ? <Icon name={RightIcon} size={14} color="var(--t-font-color-tertiary)" /> : null}
    </button>
  );
}
