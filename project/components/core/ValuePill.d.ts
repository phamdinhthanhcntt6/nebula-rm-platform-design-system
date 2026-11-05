import type { CSSProperties, MouseEvent } from 'react';
/** Rounded link pill for phone / email / URL values (20px, pill radius, 1px strong border, hover/press fills). Renders nothing when text is empty. */
export interface ValuePillProps { text?: string; href?: string; onClick?: (e: MouseEvent) => void; style?: CSSProperties; }
export declare function ValuePill(props: ValuePillProps): JSX.Element | null;
