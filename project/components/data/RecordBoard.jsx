import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Tag } from '../core/Tag.jsx';
import { IconButton } from '../core/IconButton.jsx';
// simplize-front object-record/record-board — kanban: 300px columns, RecordGroupChip header (letter tag + label + aggregate),
// RecordCard: background-secondary, 1px medium border, 4px radius; body rows = 16px field icon + value.
export function RecordBoard({ columns = [], children, onAddGroup, addGroupLabel = 'Add group', style }) {
  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, overflowX: 'auto', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)', ...style }}>
      {children}
      {onAddGroup ? <div style={{ padding: 'var(--t-spacing-2)', minWidth: 200 }}><div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 24, padding: '0 var(--t-spacing-1)', color: 'var(--t-font-color-tertiary)', cursor: 'pointer' }}><Icon name="plus" size={16} /><span>{addGroupLabel}</span></div></div> : null}
    </div>
  );
}
export function RecordBoardColumn({ title, color = 'gray', aggregate = '-', count, children, isFirst = false, noValue = false, onAddCard, addLabel = 'New', width, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', flexDirection: 'column', minWidth: width || 'var(--t-record-board-column-width)', maxWidth: width || 'var(--t-record-board-column-width)', padding: 'var(--t-spacing-2)', boxSizing: 'border-box', borderLeft: isFirst ? 'none' : '1px solid var(--t-border-color-light)', background: 'var(--t-background-primary)', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 24, marginBottom: 'var(--t-spacing-2)', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', minWidth: 0 }}>
          {noValue ? <Tag text={title} color="transparent" variant="border" /> : <RecordGroupChip label={title} color={color} />}
          <span style={{ color: 'var(--t-font-color-tertiary)', padding: '0 var(--t-spacing-2)' }}>{aggregate}</span>
        </div>
        <div style={{ display: 'flex', opacity: hover ? 1 : 0, transition: 'opacity 0.15s' }}>
          <IconButton Icon="dots-vertical" variant="light" accent="tertiary" size="small" ariaLabel="More" />
          <IconButton Icon="plus" variant="light" accent="tertiary" size="small" ariaLabel="Add" onClick={onAddCard} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto' }}>{children}</div>
      {noValue ? <div onClick={onAddCard} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 32, padding: '0 var(--t-spacing-2)', color: 'var(--t-font-color-tertiary)', cursor: 'pointer' }}><Icon name="plus" size={16} /><span>{addLabel}</span></div> : null}
    </div>
  );
}
// RecordGroupChip: letter avatar tile in hue + label (the column header identity)
export function RecordGroupChip({ label, color = 'gray' }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 20, padding: '0 var(--t-spacing-1)', borderRadius: 'var(--t-border-radius-sm)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <span style={{ width: 16, height: 16, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 500, background: 'var(--t-tag-background-' + color + ', var(--t-tag-background-gray))', color: 'var(--t-tag-text-' + color + ', var(--t-tag-text-gray))', flexShrink: 0 }}>{label.trim().charAt(0).toUpperCase()}</span>
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
    </span>
  );
}
export function RecordCard({ title, titleAvatar, fields = [], selected = false, active = false, onClick, compact = false, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} data-selected={selected} style={{ marginBottom: 'var(--t-spacing-2)', background: selected || active ? 'var(--t-accent-quaternary)' : 'var(--t-background-secondary)', border: '1px solid ' + (active ? 'var(--t-color-blue7)' : hover ? 'var(--t-border-color-strong)' : 'var(--t-border-color-medium)'), borderRadius: 'var(--t-border-radius-sm)', color: 'var(--t-font-color-primary)', cursor: 'pointer', width: '100%', boxSizing: 'border-box', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 24, padding: 'var(--t-spacing-2) var(--t-spacing-2) var(--t-spacing-1)', fontWeight: 500, fontSize: 'var(--t-font-size-md)', overflow: 'hidden', whiteSpace: 'nowrap' }}>{titleAvatar}<span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</span></div>
      {!compact ? <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)', padding: '0 var(--t-spacing-2) var(--t-spacing-2)' }}>
        {fields.map((f, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 24, minWidth: 0 }}><Icon name={f.Icon} size={16} color="var(--t-font-color-tertiary)" />{f.value ? <span style={{ display: 'flex', alignItems: 'center', minWidth: 0, overflow: 'hidden' }}>{f.value}</span> : <span style={{ color: 'var(--t-font-color-light)' }}>{f.placeholder || f.label}</span>}</div>)}
      </div> : null}
    </div>
  );
}
