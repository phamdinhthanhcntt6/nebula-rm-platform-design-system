import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';
// simplize-front object-record/record-table — 32px rows, light borders right+bottom, header text tertiary,
// 32px checkbox column, field-type icon before each column label, "+ Add New" row and aggregate footer.
// Field-type icons follow Twenty's field metadata icons.
export const FIELD_TYPE_ICONS = { text: 'typography', number: 'hash', currency: 'currency-dollar', date: 'calendar-event', select: 'tag', multiselect: 'tags', relation: 'link', boolean: 'check', email: 'mail', phone: 'phone', link: 'link', rating: 'star', formula: 'math-function', filter: 'filter', count: 'list-numbers', address: 'map-pin', user: 'user-circle' };

export function RecordTable({ columns = [], rows = [], selectedIds = [], onSelectionChange, renderCell, onRowClick, addNewLabel = 'Add New', onAddNew, aggregateLabel = 'Calculate', aggregates, hasAddColumn = true, minWidth, style }) {
  const [hoverRow, setHoverRow] = React.useState(null);
  const allSelected = rows.length > 0 && selectedIds.length === rows.length;
  const some = selectedIds.length > 0 && !allSelected;
  const toggleAll = () => onSelectionChange && onSelectionChange(allSelected ? [] : rows.map((r) => r.id));
  const toggle = (id) => onSelectionChange && onSelectionChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  const border = '1px solid var(--t-border-color-light)';
  const cw = (c) => c.width || 180;
  const total = 32 + columns.reduce((a, c) => a + cw(c), 0) + (hasAddColumn ? 32 : 0);
  return (
    <div role="table" style={{ display: 'flex', flexDirection: 'column', minWidth: minWidth || total, fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)', userSelect: 'none', ...style }}>
      <div role="row" style={{ display: 'flex', height: 32, boxSizing: 'border-box' }}>
        <div style={{ width: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: border, borderRight: border, background: 'var(--t-background-primary)' }}><Checkbox checked={allSelected} indeterminate={some} onChange={toggleAll} variant="secondary" ariaLabel="Select all" /></div>
        {columns.map((c) => <HeaderCell key={c.id} col={c} width={cw(c)} />)}
        {hasAddColumn ? <div style={{ width: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t-font-color-tertiary)', borderBottom: border, cursor: 'pointer' }}><Icon name="plus" size={16} /></div> : null}
        <div style={{ flex: 1, borderBottom: border }} />
      </div>
      {rows.map((r) => {
        const sel = selectedIds.includes(r.id);
        const bg = sel ? 'var(--t-accent-quaternary)' : hoverRow === r.id ? 'var(--t-background-secondary)' : 'var(--t-background-primary)';
        return (
          <div role="row" key={r.id} onMouseEnter={() => setHoverRow(r.id)} onMouseLeave={() => setHoverRow(null)} style={{ display: 'flex', height: 32, boxSizing: 'border-box' }}>
            <div style={{ width: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg, borderBottom: border, borderRight: border }}><Checkbox checked={sel} onChange={() => toggle(r.id)} variant="secondary" ariaLabel="Select row" /></div>
            {columns.map((c, i) => (
              <div role="cell" key={c.id} onClick={() => onRowClick && i === 0 && onRowClick(r)} style={{ width: cw(c), flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 var(--t-spacing-2)', boxSizing: 'border-box', background: bg, borderBottom: border, borderRight: border, overflow: 'hidden', whiteSpace: 'nowrap', cursor: i === 0 && onRowClick ? 'pointer' : 'default' }}>
                {renderCell ? renderCell(r, c) : <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{r[c.id]}</span>}
              </div>
            ))}
            <div style={{ flex: 1, background: bg, borderBottom: border }} />
          </div>
        );
      })}
      <div role="row" onClick={onAddNew} style={{ display: 'flex', alignItems: 'center', height: 32, boxSizing: 'border-box', color: 'var(--t-font-color-tertiary)', cursor: 'pointer', borderBottom: border }}>
        <span style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="plus" size={14} /></span>
        <span style={{ padding: '0 var(--t-spacing-2)', color: 'var(--t-font-color-secondary)' }}>{addNewLabel}</span>
      </div>
      <div role="row" style={{ display: 'flex', height: 32, boxSizing: 'border-box', color: 'var(--t-font-color-tertiary)' }}>
        <div style={{ width: 32, flexShrink: 0 }} />
        {columns.map((c, i) => <div key={c.id} style={{ width: cw(c), flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--t-spacing-2)', boxSizing: 'border-box' }}>{i === 0 ? <React.Fragment><span>{aggregates && aggregates[c.id] ? aggregates[c.id] : aggregateLabel}</span><Icon name="chevron-down" size={14} color="var(--t-font-color-light)" /></React.Fragment> : aggregates && aggregates[c.id] ? <span>{aggregates[c.id]}</span> : null}</div>)}
      </div>
    </div>
  );
}
function HeaderCell({ col, width }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div role="columnheader" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ width, flexShrink: 0, height: 32, display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', padding: '0 var(--t-spacing-2)', boxSizing: 'border-box', color: 'var(--t-font-color-tertiary)', fontWeight: 500, background: hover ? 'var(--t-background-secondary)' : 'var(--t-background-primary)', borderBottom: '1px solid var(--t-border-color-light)', borderRight: '1px solid var(--t-border-color-light)', cursor: 'pointer', overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
      <Icon name={col.Icon || FIELD_TYPE_ICONS[col.type] || 'typography'} size={16} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{col.label}</span>
    </div>
  );
}
