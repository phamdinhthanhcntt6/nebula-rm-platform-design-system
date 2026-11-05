import React from 'react';
// Customers page ValuePill — rounded link pill for phone / email / URL values in field rows and table cells.
// 20px (10px line + 4px/8px padding, content-box), pill radius, 1px strong border, lighter → light → medium fill on hover/press.
export function ValuePill({ text, href, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  if (!text) return null;
  return <a href={href} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setActive(false); }} onMouseDown={() => setActive(true)} onMouseUp={() => setActive(false)}
    style={{ alignItems: 'center', backgroundColor: active ? 'var(--t-background-transparent-medium)' : hover ? 'var(--t-background-transparent-light)' : 'var(--t-background-transparent-lighter)', border: '1px solid var(--t-border-color-strong)', borderRadius: 'var(--t-border-radius-pill)', boxSizing: 'content-box', color: 'var(--t-font-color-primary)', cursor: 'pointer', display: 'inline-flex', fontFamily: 'var(--t-font-family)', fontSize: 'var(--t-font-size-md)', gap: 'var(--t-spacing-1)', height: 10, justifyContent: 'center', maxWidth: 'calc(100% - 8px)', minWidth: 'fit-content', overflow: 'hidden', padding: 'var(--t-spacing-1) var(--t-spacing-2)', textDecoration: 'none', textOverflow: 'ellipsis', userSelect: 'none', whiteSpace: 'nowrap', ...style }}>{text}</a>;
}
