import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
import { Avatar } from '../core/Avatar.jsx';
import { Pill } from '../core/Pill.jsx';
import { Label } from '../core/Label.jsx';
// simplize-front ui/navigation/navigation-drawer/* + navigation/MainNavigationDrawer.
// The drawer sits on the gray3 app background (no border) beside the white page panel.

export function NavigationDrawer({ children, width, header, footer, style }) {
  return (
    <div style={{ width: width || 'var(--t-navigation-drawer-width)', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)', padding: 'var(--t-spacing-2) 0 var(--t-spacing-4) var(--t-spacing-2)', flexShrink: 0, userSelect: 'none', fontFamily: 'var(--t-font-family)', ...style }}>
      {header}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 'var(--t-spacing-2)', display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-3)' }}>{children}</div>
      {footer}
    </div>
  );
}

export function NavigationDrawerHeader({ workspaceName = 'Workspace', workspaceLogo, notifications = 0, onSearch, onCollapse, onWorkspaceClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', minHeight: 'var(--t-page-bar-min-height)', paddingRight: 'var(--t-spacing-2)', flexShrink: 0 }}>
      <button type="button" onClick={onWorkspaceClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', height: 32, padding: '0 var(--t-spacing-1)', border: 'none', borderRadius: 'var(--t-border-radius-md)', background: hover ? 'var(--t-background-transparent-light)' : 'transparent', cursor: 'pointer', fontFamily: 'inherit', flex: '1 1 auto', minWidth: 0, color: 'var(--t-font-color-primary)' }}>
        {workspaceLogo ? <img src={workspaceLogo} alt="" style={{ width: 20, height: 20, borderRadius: 'var(--t-border-radius-sm)', objectFit: 'cover' }} /> : <Avatar placeholder={workspaceName} type="icon" size="lg" style={{ width: 20, height: 20, fontSize: 12, background: 'var(--t-color-green)', color: 'var(--t-gray-scale-gray1)' }} />}
        <span style={{ fontSize: 'var(--t-font-size-lg)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{workspaceName}</span>
        <Icon name="chevron-down" size={14} color="var(--t-font-color-tertiary)" />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto', flexShrink: 0 }}>
        <span style={{ position: 'relative', display: 'flex' }}>
          <IconButton Icon="bell" variant="light" accent="secondary" size="small" ariaLabel="Notifications" />
          {notifications > 0 ? <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: 'var(--t-color-red)' }} /> : null}
        </span>
        <IconButton Icon="search" variant="light" accent="secondary" size="small" ariaLabel="Search" onClick={onSearch} />
        <IconButton Icon="layout-sidebar-left-collapse" variant="light" accent="secondary" size="small" ariaLabel="Collapse" onClick={onCollapse} />
      </div>
    </div>
  );
}

// MainNavigationDrawerTabsRow: 28px pill (background-secondary, medium border, radius pill, 3px padding, 72px wide)
// holding Home / Chat icon tabs, then a matching pill "New chat" button (message-circle-plus + 12px/500 label).
export function NavigationDrawerTabsRow({ activeTab = 'navigation', onTabChange, onNewChat, newChatLabel = 'New chat' }) {
  const pill = { background: 'var(--t-background-secondary)', border: '1px solid var(--t-border-color-medium)', borderRadius: 'var(--t-border-radius-pill)', boxSizing: 'border-box', height: 28, padding: 3, display: 'flex', alignItems: 'center' };
  const Tile = ({ id, icon, label }) => { const [h, setH] = React.useState(false); const active = activeTab === id; return <div role="tab" aria-selected={active} aria-label={label} onClick={() => onTabChange && onTabChange(id)} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--t-border-radius-pill)', background: active ? 'var(--t-background-transparent-light)' : h ? 'var(--t-background-transparent-lighter)' : 'transparent', color: active ? 'var(--t-font-color-primary)' : 'var(--t-font-color-tertiary)', cursor: 'pointer' }}><span style={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={icon} size={16} /></span></div>; };
  const [h2, setH2] = React.useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--t-spacing-2)', paddingRight: 'var(--t-spacing-2)', width: '100%', boxSizing: 'border-box' }}>
      <div role="tablist" style={{ ...pill, width: 72, gap: 2, flexShrink: 0 }}>
        <Tile id="navigation" icon="home" label="Home" /><Tile id="ai-chat" icon="message" label="Chat" />
      </div>
      <div style={{ ...pill, justifyContent: 'center', minWidth: 28, maxWidth: '100%', width: 'max-content' }}>
        <div role="button" tabIndex={0} aria-label={newChatLabel} onClick={onNewChat} onMouseEnter={() => setH2(true)} onMouseLeave={() => setH2(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--t-spacing-1)', height: '100%', width: '100%', minWidth: 0, padding: '0 var(--t-spacing-2)', borderRadius: 'inherit', background: h2 ? 'var(--t-background-transparent-light)' : 'transparent', color: h2 ? 'var(--t-font-color-primary)' : 'var(--t-font-color-secondary)', fontSize: 'var(--t-font-size-sm)', fontWeight: 500, cursor: 'pointer', overflow: 'hidden', transition: 'background 0.15s ease, color 0.15s ease' }}>
          <Icon name="message-circle-plus" size={14} /><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{newChatLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function NavigationDrawerSection({ children, style }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: 2, ...style }}>{children}</div>;
}

export function NavigationDrawerSectionTitle({ label, isOpen, onClick, rightIcon }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 28, boxSizing: 'border-box', padding: '4px 2px 4px 4px', borderRadius: 'var(--t-border-radius-md)', background: hover ? 'var(--t-background-transparent-light)' : 'transparent', cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', flex: 1 }}>
        <Label style={{ color: hover ? 'var(--t-font-color-tertiary)' : 'var(--t-font-color-light)' }}>{label}</Label>
        {isOpen !== undefined ? <Icon name="chevron-right" size={12} color="var(--t-font-color-tertiary)" style={{ opacity: hover ? 1 : 0, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s' }} /> : null}
      </div>
      {rightIcon ? <span style={{ opacity: hover ? 1 : 0, display: 'flex' }}>{rightIcon}</span> : null}
    </div>
  );
}

// One drawer row. indentationLevel 2+ draws the tree connector (NavigationDrawerItemBreadcrumb).
export function NavigationDrawerItem({ label, secondaryLabel, Icon: name, icon, iconColor, iconTile, iconTileBorder, withIconBackground = false, active = false, indentationLevel = 1, subItemState = 'intermediate-after', modifier, rightOptions, alwaysShowRightOptions = false, isOpen, onClick, variant = 'default', count }) {
  const [hover, setHover] = React.useState(false);
  const color = variant === 'tertiary' ? 'var(--t-font-color-tertiary)' : active || hover ? 'var(--t-font-color-primary)' : modifier === 'soon' ? 'var(--t-font-color-light)' : 'var(--t-font-color-secondary)';
  const nested = indentationLevel >= 2;
  // Top-level object rows render the icon in a 16px tile, radius --t-border-radius-sm, filled with --t-object-tile-<hue>, glyph 14px in the matching --t-tag-text-<hue>, plus a 1px --t-object-tile-border-<hue> hairline (simplize-front ObjectIcon).
  // Nested rows (indentationLevel 2+) use the same 16px radius-sm tile, filled --t-background-quaternary, glyph 14px in --t-font-color-secondary, border 1px --t-border-color-strong.
  const glyph = icon || (name ? (iconTile ? <span style={{ width: 16, height: 16, borderRadius: 'var(--t-border-radius-sm)', background: iconTile, border: '1px solid ' + (iconTileBorder || 'transparent'), boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={name} size={14} color={iconColor || 'var(--t-font-color-primary)'} /></span> : nested ? <span style={{ width: 16, height: 16, borderRadius: 'var(--t-border-radius-sm)', background: 'var(--t-background-quaternary)', border: '1px solid var(--t-border-color-strong)', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon name={name} size={14} color={iconColor || 'var(--t-font-color-secondary)'} /></span> : <Icon name={name} size={16} color={iconColor} />) : null);
  return (
    <div onClick={modifier === 'soon' ? undefined : onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-current={active ? 'page' : undefined}
      style={{ display: 'flex', alignItems: 'center', height: 28, marginTop: nested ? 2 : 0, boxSizing: 'border-box', padding: '4px ' + (rightOptions ? 2 : 4) + 'px 4px 4px', borderRadius: 'var(--t-border-radius-md)', background: active || hover ? 'var(--t-background-transparent-light)' : 'transparent', color, cursor: modifier === 'soon' ? 'default' : 'pointer', fontSize: 'var(--t-font-size-md)', minWidth: 0, width: '100%' }}>
      {nested ? <span style={{ display: 'flex', flexShrink: 0 }}>{Array.from({ length: indentationLevel - 2 }).map((_, i) => <span key={i} style={{ width: 24.5, position: 'relative' }}><span style={{ position: 'absolute', left: 7.5, top: -6, bottom: -6, width: 1, background: 'var(--t-border-color-strong)' }} /></span>)}<Breadcrumb state={subItemState} /></span> : null}
      {glyph ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 'var(--t-spacing-2)', flexShrink: 0, ...(withIconBackground ? { width: 24, height: 24, borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-gray-scale-gray3)' } : {}) }}>{glyph}</span> : null}
      <span style={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'clip', display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: 500 }}>{label}</span>
        {secondaryLabel ? <span style={{ color: 'var(--t-font-color-light)', fontWeight: 400 }}>{' · '}{secondaryLabel}</span> : null}
      </span>
      {count !== undefined ? <span style={{ color: 'var(--t-font-color-light)', fontSize: 'var(--t-font-size-sm)', marginRight: 4 }}>{count}</span> : null}
      {modifier === 'soon' ? <Pill label="Soon" /> : modifier === 'new' ? <Pill label="New" /> : null}
      {modifier && modifier.keyboard ? <span style={{ display: 'flex', gap: 2, visibility: hover ? 'visible' : 'hidden' }}>{modifier.keyboard.map((k) => <span key={k} style={{ width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--t-border-color-strong)', borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-transparent-lighter)', fontSize: 'var(--t-font-size-xs)', fontWeight: 600, color: 'var(--t-font-color-light)' }}>{k}</span>)}</span> : null}
      {isOpen !== undefined ? <Icon name="chevron-right" size={14} color="var(--t-font-color-tertiary)" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s', flexShrink: 0 }} /> : null}
      {rightOptions ? <span onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', height: 24, opacity: hover || alwaysShowRightOptions ? 1 : 0, transition: 'opacity 150ms', flexShrink: 0, overflow: 'hidden', ...(hover || alwaysShowRightOptions ? { paddingLeft: 'var(--t-spacing-2)' } : { width: 0, paddingLeft: 0 }) }}>{rightOptions}</span> : null}
    </div>
  );
}

// Tree connector: vertical rail + elbow (NavigationDrawerItemBreadcrumb)
function Breadcrumb({ state }) {
  const last = state === 'last';
  return (
    <span style={{ width: 16.5, height: 20, position: 'relative', flexShrink: 0, marginRight: 'var(--t-spacing-2)' }}>
      <span style={{ position: 'absolute', left: 7.5, top: -8, height: last ? 18 : 36, width: 1, background: 'var(--t-border-color-strong)' }} />
      <span style={{ position: 'absolute', left: 7.5, top: 10, width: 9, height: 1, background: 'var(--t-border-color-strong)' }} />
    </span>
  );
}
