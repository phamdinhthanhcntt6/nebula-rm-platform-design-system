import type { ReactNode, CSSProperties } from 'react';
/**
 * Right-hand detail panel (Full Scope GvPanel): 400px, light left rule, 48px head (icon/tile + title + actions + close),
 * scrolling body (24px bottom padding), optional foot. Pass `identity={<PanelIdentityHeader …/>}` for record panels (Customers format).
 */
export interface SidePanelProps {
  /** 400 standard; 440 for audit/event detail */
  width?: number;
  /** Tabler icon shown before the title (16px, tertiary) */
  Icon?: string; iconColor?: string;
  /** ObjectTile (or any node) instead of the bare icon */
  tile?: ReactNode;
  title?: ReactNode;
  /** Small light IconButtons placed before the close button */
  actions?: ReactNode;
  onClose?: () => void;
  /** Shows a back arrow first — for panel-in-panel navigation */
  onBack?: () => void;
  /** Custom content inside the default 48px head row */
  head?: ReactNode;
  /** Full replacement head for record panels — a PanelIdentityHeader (two rows, own bottom rule) */
  identity?: ReactNode;
  /** One or more PanelFootRow */
  foot?: ReactNode;
  children?: ReactNode;
  style?: CSSProperties;
}
export declare function SidePanel(props: SidePanelProps): JSX.Element;
export interface PanelTitleProps { text: ReactNode; }
export declare function PanelTitle(props: PanelTitleProps): JSX.Element;
/** 40px footer row (Customers format): buttons right-aligned, 2px gap; `note` = 12px tertiary text filling the left */
export interface PanelFootRowProps { note?: ReactNode; children?: ReactNode; style?: CSSProperties; }
export declare function PanelFootRow(props: PanelFootRowProps): JSX.Element;
export interface IdentityMeta { Icon?: string; text: ReactNode; }
/** Customers record-panel head: avatar chip + semi-bold title pill + verified + status tags + actions; meta line with "Xem chi tiết". */
export interface PanelIdentityHeaderProps { title: string; avatarType?: 'rounded' | 'squared'; verified?: boolean; tags?: { text: string; color: string }[]; /** 12px tertiary items, e.g. code (hash) and owner (user-circle) */ meta?: IdentityMeta[]; actions?: ReactNode; onBack?: () => void; onClose?: () => void; onDetail?: () => void; detailLabel?: string; }
export declare function PanelIdentityHeader(props: PanelIdentityHeaderProps): JSX.Element;
