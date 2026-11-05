import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { IconButton } from '../core/IconButton.jsx';
// simplize-front ui/layout/page PageHeader — 48px row inside the white page panel, light bottom divider, colored object icon + 13px/500 title, actions right.
export function PageHeader({ title, Icon: name, iconColor, icon, children, hasClosePageButton, onClosePage, showCollapseButton, onExpandDrawer, divider = true, style }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--t-spacing-2)', height: 48, minHeight: 48, padding: '0 var(--t-spacing-3) 0 var(--t-spacing-4)', boxSizing: 'border-box', borderBottom: divider ? '1px solid var(--t-border-color-light)' : 'none', color: 'var(--t-font-color-primary)', fontSize: 'var(--t-font-size-lg)', fontFamily: 'var(--t-font-family)', flexShrink: 0, ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-1)', minWidth: 0, flex: '0 1 auto', overflow: 'hidden' }}>
        {showCollapseButton ? <IconButton Icon="layout-sidebar-left-expand" variant="light" accent="tertiary" size="small" ariaLabel="Expand" onClick={onExpandDrawer} /> : null}
        {hasClosePageButton ? <IconButton Icon="x" variant="light" accent="tertiary" size="small" ariaLabel="Close" onClick={onClosePage} /> : null}
        {icon ? icon : name ? <Icon name={name} size={16} color={iconColor} /> : null}
        <div data-testid="top-bar-title" style={{ fontSize: 'var(--t-font-size-md)', fontWeight: 500, marginRight: 'var(--t-spacing-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--t-spacing-2)', justifyContent: 'flex-end', flex: '1 1 0', minWidth: 0 }}>{children}</div>
    </div>
  );
}
