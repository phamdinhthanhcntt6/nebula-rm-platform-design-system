import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Avatar } from '../core/Avatar.jsx';
import { Tag } from '../core/Tag.jsx';
import { Button } from '../core/Button.jsx';
// Right-hand record / detail panel used on every Full Scope screen (GvPanel, RecordSidePanel, AuditPanel, WfRunPanel…).
// 400px default (440 for audit/event detail), primary bg, 1px light left rule. Head 48px (12px left / 8px right padding,
// light bottom rule): 16px icon or ObjectTile + 13px/500 ellipsised title + small light icon buttons, close last.
// Body scrolls with 24px bottom padding; foot = PanelFootRow(s) above a light top rule.
// Record panels (Customers) pass <PanelIdentityHeader> via `identity` — rendered as-is, it carries its own bottom rule.
export function SidePanel({ width = 400, Icon: icon, iconColor = 'var(--t-font-color-tertiary)', tile, title, actions, onClose, onBack, head, identity, foot, children, style }) {
  return (
    <div style={{ width, minWidth: width, flexShrink: 0, height: '100%', background: 'var(--t-background-primary)', borderLeft: '1px solid var(--t-border-color-light)', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflow: 'hidden', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', color: 'var(--t-font-color-primary)', ...style }}>
      {identity || <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 48, padding: '0 var(--t-spacing-2) 0 var(--t-spacing-3)', boxSizing: 'border-box', borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 }}>
        {head || (
          <React.Fragment>
            {onBack ? <IconButton Icon="arrow-left" variant="light" accent="tertiary" size="small" ariaLabel="Quay lại" onClick={onBack} /> : null}
            {tile || (icon ? <Icon name={icon} size={16} color={iconColor} /> : null)}
            <PanelTitle text={title} />
            {actions}
            {onClose ? <IconButton Icon="x" variant="light" accent="tertiary" size="small" ariaLabel="Đóng" onClick={onClose} /> : null}
          </React.Fragment>
        )}
      </div>}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingBottom: 'var(--t-spacing-6)' }}>{children}</div>
      {foot ? <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--t-border-color-light)', flexShrink: 0 }}>{foot}</div> : null}
    </div>
  );
}
export function PanelTitle({ text }) {
  return <span title={typeof text === 'string' ? text : undefined} style={{ flex: 1, minWidth: 0, fontSize: 'var(--t-font-size-md)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</span>;
}
// Footer row as on the Customers panel: 40px, 4px/8px padding, buttons right-aligned with a 2px gap.
// Left slot (menu-up "Hành động" button or a 12px tertiary note) pushes the rest right. Primary (blue) is last.
export function PanelFootRow({ note, children, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2, height: 40, boxSizing: 'border-box', padding: 'var(--t-spacing-1) var(--t-spacing-2)', ...style }}>
      {note !== undefined ? <span style={{ flex: 1, minWidth: 0, fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)' }}>{note}</span> : null}
      {children}
    </div>
  );
}

// Customers panel head (IdentityBlock compact). Row 1, 48px, 2px gap: avatar (md, rounded) in a 4px-padded
// transparent-light 4px-radius chip, semi-bold title pill (24px, md radius, hover transparent-light, max 150px),
// optional verified mark + status Tags, then light icon actions. Row 2: 12px tertiary meta (14px icons) and an
// optional "Xem chi tiết" secondary button pushed right; 8px bottom padding, light bottom rule.
export function PanelIdentityHeader({ title, avatarType = 'rounded', verified = false, tags = [], meta = [], actions, onBack, onClose, onDetail, detailLabel = 'Xem chi tiết' }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--t-border-color-light)', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 48, padding: '0 var(--t-spacing-2) 0 var(--t-spacing-3)', boxSizing: 'border-box' }}>
        {onBack ? <IconButton Icon="arrow-left" variant="light" accent="tertiary" size="small" ariaLabel="Quay lại" onClick={onBack} /> : null}
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, padding: 'var(--t-spacing-1)', borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-transparent-light)' }}><Avatar placeholder={typeof title === 'string' ? title : ''} type={avatarType} size="md" /></span>
        <span style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 'var(--t-spacing-1)', minWidth: 0 }}>
          <span style={{ maxWidth: 150, minWidth: 0, padding: '0 var(--t-spacing-1)', fontSize: 'var(--t-font-size-md)', fontWeight: 'var(--t-font-weight-semi-bold)' }}>
            <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', alignItems: 'center', height: 24, boxSizing: 'border-box', padding: '0 5px', borderRadius: 'var(--t-border-radius-md)', color: 'var(--t-font-color-primary)', background: hover ? 'var(--t-background-transparent-light)' : 'inherit', cursor: 'pointer', overflow: 'hidden' }}><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span></span>
          </span>
          {verified ? <Icon name="rosette-discount-check" size={16} color="var(--t-tag-text-green)" /> : null}
          {tags.map((t) => <Tag key={t.text} text={t.text} color={t.color} preventShrink />)}
        </span>
        {actions}
        {onClose ? <IconButton Icon="x" variant="light" accent="tertiary" size="small" ariaLabel="Đóng" onClick={onClose} /> : null}
      </div>
      {meta.length || onDetail ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', minWidth: 0, padding: '0 var(--t-spacing-3) var(--t-spacing-2)', fontSize: 'var(--t-font-size-sm)', color: 'var(--t-font-color-tertiary)', whiteSpace: 'nowrap' }}>
          {meta.map((m, i) => <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>{m.Icon ? <Icon name={m.Icon} size={14} color="var(--t-font-color-tertiary)" /> : null}{m.text}</span>)}
          {onDetail ? <span style={{ flexShrink: 0, marginLeft: 'auto' }}><Button title={detailLabel} variant="secondary" size="small" Icon="arrow-up-right" onClick={onDetail} /></span> : null}
        </div>
      ) : null}
    </div>
  );
}
