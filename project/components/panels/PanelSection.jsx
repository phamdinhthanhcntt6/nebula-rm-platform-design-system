import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';
import { Tag } from '../core/Tag.jsx';
// Collapsible section inside a SidePanel (C360LeftSection / CaseSection — 53 uses). 12px padding, 8px gap, light bottom rule.
// Header: 13px/500 title, 12px light meta, 16px chevron (light → tertiary on hover).
export function PanelSection({ title, meta, defaultOpen = true, last = false, children, style }) {
  const [open, setOpen] = React.useState(defaultOpen);
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', padding: 'var(--t-spacing-3)', borderBottom: last ? 'none' : '1px solid var(--t-border-color-light)', ...style }}>
      {title ? (
        <div onClick={() => setOpen((o) => !o)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', marginBottom: open ? 'var(--t-spacing-1)' : 0, cursor: 'pointer', userSelect: 'none' }}>
          <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--t-font-size-md)', fontWeight: 'var(--t-font-weight-medium)', color: 'var(--t-font-color-primary)' }}>{title}</span>
          {meta ? <span style={{ flexShrink: 0, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)', whiteSpace: 'nowrap' }}>{meta}</span> : null}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color={hover ? 'var(--t-font-color-tertiary)' : 'var(--t-font-color-light)'} />
        </div>
      ) : null}
      {title && !open ? null : children}
    </div>
  );
}
// Key / value row (KVRow — 168 uses). 24px; 12px tertiary label with optional 16px field icon, value right-aligned primary.
// strongLabel = 13px secondary label. multiline = label on its own line, value below indented 24px.
export function KVRow({ label, value, Icon: fieldIcon, strongLabel = false, multiline = false }) {
  const ic = fieldIcon ? <Icon name={fieldIcon} size={16} color="var(--t-font-color-tertiary)" style={{ flexShrink: 0 }} /> : null;
  if (multiline) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, fontSize: 'var(--t-font-size-md)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', height: 24, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' }}>{ic}{label}</span>
      <span style={{ color: 'var(--t-font-color-primary)', lineHeight: 1.45, paddingLeft: fieldIcon ? 24 : 0, textWrap: 'pretty' }}>{value}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 24, fontSize: 'var(--t-font-size-md)' }}>
      <span style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', fontSize: strongLabel ? 'var(--t-font-size-md)' : 'var(--t-font-size-sm)', color: strongLabel ? 'var(--t-font-color-secondary)' : 'var(--t-font-color-tertiary)', overflow: 'hidden', whiteSpace: 'nowrap' }}>{ic}<span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span></span>
      <span style={{ flexShrink: 0, color: 'var(--t-font-color-primary)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center' }}>{value}</span>
    </div>
  );
}
// Section footer: small secondary "open" button with arrow-up-right, 12px tertiary note on the right.
export function SectionFooter({ link, note, onClick }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minHeight: 24 }}>
      <Button title={link} variant="secondary" size="small" Icon="arrow-up-right" onClick={onClick} />
      <span style={{ flex: 1 }} />
      {note ? <span style={{ minWidth: 0, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{note}</span> : null}
    </div>
  );
}
// Quoted content box (before/after values, message previews): secondary bg, light border, 4px radius, 8/12px padding, pre-wrap.
export function QuoteBox({ children, style }) {
  return <div style={{ padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-secondary)', border: '1px solid var(--t-border-color-light)', fontSize: 'var(--t-font-size-md)', lineHeight: 1.5, whiteSpace: 'pre-wrap', ...style }}>{children}</div>;
}
// KPI tile (C360Kpi): 12px padding, medium border, md radius, secondary bg; 12px tertiary label, 16px/700 value, 12px light sub.
export function KpiTile({ label, value, sub, onClick, style }) {
  return (
    <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, padding: 'var(--t-spacing-3)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-secondary)', fontFamily: 'var(--t-font-family)', ...style }}>
      <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 'var(--t-font-size-lg)', fontWeight: 700, color: 'var(--t-font-color-primary)' }}>{value}</span>
      {sub ? <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)', lineHeight: 1.3 }}>{sub}</span> : null}
    </div>
  );
}
// Clickable list line inside a PanelSection (MvpAttLine): 28px, hover transparent-light, bleeds 8px into the section padding.
// Leading slot (Tag / 14px icon), ellipsised 13px text, trailing slot, 14px light chevron.
export function PanelListRow({ leading, Icon: icon, text, trailing, onClick, title }) {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={onClick} title={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minHeight: 28, padding: '0 var(--t-spacing-2)', margin: '0 calc(-1 * var(--t-spacing-2))', borderRadius: 'var(--t-border-radius-sm)', cursor: onClick ? 'pointer' : 'default', background: h ? 'var(--t-background-transparent-light)' : 'transparent', fontSize: 'var(--t-font-size-md)' }}>
      {leading}
      {icon ? <Icon name={icon} size={14} color="var(--t-font-color-tertiary)" /> : null}
      <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>
      {trailing}
      <Icon name="chevron-right" size={14} color="var(--t-font-color-light)" />
    </div>
  );
}
// Inline notice box inside a section. warn = orange tag fill + 14px alert icon + 500 title; empty = primary bg, light border, tertiary body.
export function InlineNotice({ tone = 'warn', title, children }) {
  const warn = tone === 'warn';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 'var(--t-spacing-2)', borderRadius: 'var(--t-border-radius-sm)', background: warn ? 'var(--t-tag-background-orange)' : 'var(--t-background-primary)', border: warn ? 'none' : '1px solid var(--t-border-color-light)', color: warn ? 'var(--t-tag-text-orange)' : 'var(--t-font-color-primary)', fontSize: 'var(--t-font-size-md)' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', fontWeight: warn ? 500 : 400 }}>{warn ? <Icon name="alert-triangle" size={14} color="var(--t-tag-text-orange)" /> : null}{title}</span>
      {children ? <span style={warn ? { lineHeight: 1.4 } : { fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' }}>{children}</span> : null}
    </div>
  );
}
// Hover-hug wrapper for read-only values in a KVRow (HugValue): 24px, 4px side padding, sm radius, transparent-light on hover.
export function HugValue({ children }) {
  const [h, setH] = React.useState(false);
  return <span onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 var(--t-spacing-1)', borderRadius: 'var(--t-border-radius-sm)', background: h ? 'var(--t-background-transparent-light)' : 'transparent' }}>{children}</span>;
}
// "✦ AI" marker for AI-written content (MvpAiMark): 20px, 6px padding, sm radius, transparent-light, 12px tertiary.
export function AiMark({ title = 'Nội dung do AI viết từ dữ liệu bên dưới' }) {
  return <span title={title} style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0, height: 20, padding: '0 6px', borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-transparent-light)', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', whiteSpace: 'nowrap' }}>✦ AI</span>;
}
// Two-line item inside a section (ItemRow — cases, tasks, interactions): optional 6px status dot, 13px ellipsised title,
// right slot (Tag), 12px light sub indented 14px when dotted. 2px/8px padding bleeding 8px; hover transparent-light when clickable.
export function PanelItemRow({ dot, title, sub, right, onClick }) {
  const [h, setH] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '2px var(--t-spacing-2)', margin: '0 calc(-1 * var(--t-spacing-2))', borderRadius: 'var(--t-border-radius-sm)', cursor: onClick ? 'pointer' : 'default', background: h && onClick ? 'var(--t-background-transparent-light)' : 'transparent' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)' }}>
        {dot ? <span style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: dot }} /> : null}
        <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
        {right ? <span style={{ flexShrink: 0 }}>{right}</span> : null}
      </div>
      {sub ? <span style={{ paddingLeft: dot ? 14 : 0, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</span> : null}
    </div>
  );
}
// "Hôm nay nên làm gì" card at the top of a customer panel (MvpPanelAttention). 12/12/8px margin, 8/12px padding, md radius,
// accent-tertiary border on accent-quaternary. Semi-bold title + AiMark / review Tag; 1.5 summary; 12px tertiary "Gợi ý:" line;
// actions row: secondary "Mở Attention" on primary bg, spacer, "+N Attention khác ›" tertiary link.
// empty = light border on secondary bg, tertiary text.
export function SuggestionCard({ title = 'Hôm nay nên làm gì', ai = false, review = false, summary, hint, actionLabel = 'Mở Attention', onAction, moreCount = 0, moreLabel = 'Attention khác', onMore, empty }) {
  const card = { flexShrink: 0, margin: 'var(--t-spacing-3) var(--t-spacing-3) var(--t-spacing-2)', padding: 'var(--t-spacing-2) var(--t-spacing-3)', borderRadius: 'var(--t-border-radius-md)', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-2)', fontSize: 'var(--t-font-size-md)', fontFamily: 'var(--t-font-family)' };
  if (empty) return (
    <div style={{ ...card, border: '1px solid var(--t-border-color-light)', background: 'var(--t-background-secondary)', color: 'var(--t-font-color-tertiary)' }}>
      <span style={{ fontWeight: 'var(--t-font-weight-semi-bold)', color: 'var(--t-font-color-primary)' }}>{title}</span>
      <span>{empty}</span>
    </div>
  );
  return (
    <div style={{ ...card, border: '1px solid var(--t-accent-tertiary)', background: 'var(--t-accent-quaternary)', color: 'var(--t-font-color-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)' }}>
        <span style={{ flex: 1, minWidth: 0, fontWeight: 'var(--t-font-weight-semi-bold)' }}>{title}</span>
        {review ? <Tag text="Cần kiểm tra" color="orange" preventShrink /> : ai ? <AiMark /> : null}
      </div>
      {summary ? <div style={{ lineHeight: 1.5, textWrap: 'pretty' }}>{summary}</div> : null}
      {hint ? <span style={{ fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', lineHeight: 1.4 }}>Gợi ý: {hint}</span> : null}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--t-spacing-2)' }}>
        <Button title={actionLabel} variant="secondary" size="small" Icon="arrow-up-right" style={{ background: 'var(--t-background-primary)' }} onClick={onAction} />
        <span style={{ flex: 1 }} />
        {moreCount ? <span onClick={onMore} style={{ display: 'inline-flex', alignItems: 'center', gap: 2, height: 24, padding: '0 var(--t-spacing-1)', borderRadius: 'var(--t-border-radius-sm)', cursor: 'pointer', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-tertiary)' }}>{'+' + moreCount + ' ' + moreLabel}<Icon name="chevron-right" size={14} color="var(--t-font-color-tertiary)" /></span> : null}
      </div>
    </div>
  );
}
