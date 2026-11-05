import type { ReactNode, CSSProperties } from 'react';
/** Bordered surface (1px medium border, 8px radius). Compose with CardContent rows (divided). */
export interface CardProps { children: ReactNode; fullWidth?: boolean; background?: string; style?: CSSProperties; }
export declare function Card(props: CardProps): JSX.Element;
export interface CardContentProps { children: ReactNode; divider?: boolean; style?: CSSProperties; }
export declare function CardContent(props: CardContentProps): JSX.Element;
/** Record-page content block (Customers C360Block): padded, primary bg, header with title / tool tag / meta / right slot; highlight = accent tint. */
export interface BlockCardProps { title?: ReactNode; /** Purple sm Tag after the title (e.g. source tool) */ tool?: string; meta?: ReactNode; right?: ReactNode; children?: ReactNode; highlight?: boolean; dim?: boolean; style?: CSSProperties; }
export declare function BlockCard(props: BlockCardProps): JSX.Element;
