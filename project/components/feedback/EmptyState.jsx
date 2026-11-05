import React from 'react';
import { Icon } from '../core/Icon.jsx';
import { Button } from '../core/Button.jsx';
// simplize-front ui/layout/animated-placeholder AnimatedPlaceholderEmptyContainer — centered icon tile, title, subtitle, action.
export function EmptyState({ Icon: name = 'inbox', title, subtitle, actionLabel, onAction, style }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 'var(--t-spacing-4)', padding: 'var(--t-spacing-10)', textAlign: 'center', color: 'var(--t-font-color-tertiary)', flex: 1, ...style }}>
      <div style={{ width: 40, height: 40, borderRadius: 'var(--t-border-radius-md)', background: 'var(--t-background-transparent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name={name} size={20} color="var(--t-font-color-tertiary)" /></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--t-spacing-1)' }}>
        <div style={{ fontSize: 'var(--t-font-size-lg)', fontWeight: 500, color: 'var(--t-font-color-primary)' }}>{title}</div>
        {subtitle ? <div style={{ fontSize: 'var(--t-font-size-md)', maxWidth: 320, lineHeight: 1.5 }}>{subtitle}</div> : null}
      </div>
      {actionLabel ? <Button title={actionLabel} Icon="plus" onClick={onAction} /> : null}
    </div>
  );
}
