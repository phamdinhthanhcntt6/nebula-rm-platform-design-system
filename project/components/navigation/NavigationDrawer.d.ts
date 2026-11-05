import type { ReactNode, CSSProperties } from 'react';
/**
 * Left navigation drawer (236px) on the gray3 app canvas. Compose:
 * NavigationDrawer > NavigationDrawerHeader (workspace switcher + bell/search/collapse),
 * NavigationDrawerTabsRow (28px pills: Home/Chat tabs + "New chat"), NavigationDrawerSection(s) with
 * NavigationDrawerSectionTitle and NavigationDrawerItem rows (28px, 8px radius, indentationLevel 2 draws the tree rail).
 */
export interface NavigationDrawerProps { children: ReactNode; width?: number | string; header?: ReactNode; footer?: ReactNode; style?: CSSProperties; }
export declare function NavigationDrawer(props: NavigationDrawerProps): JSX.Element;
export interface NavigationDrawerHeaderProps { workspaceName?: string; workspaceLogo?: string; notifications?: number; onSearch?: () => void; onCollapse?: () => void; onWorkspaceClick?: () => void; }
export declare function NavigationDrawerHeader(props: NavigationDrawerHeaderProps): JSX.Element;
export interface NavigationDrawerTabsRowProps { activeTab?: 'navigation' | 'ai-chat'; onTabChange?: (tab: 'navigation' | 'ai-chat') => void; onNewChat?: () => void; newChatLabel?: string; }
export declare function NavigationDrawerTabsRow(props: NavigationDrawerTabsRowProps): JSX.Element;
export interface NavigationDrawerSectionProps { children: ReactNode; style?: CSSProperties; }
export declare function NavigationDrawerSection(props: NavigationDrawerSectionProps): JSX.Element;
export interface NavigationDrawerSectionTitleProps { label: string; isOpen?: boolean; onClick?: () => void; rightIcon?: ReactNode; }
export declare function NavigationDrawerSectionTitle(props: NavigationDrawerSectionTitleProps): JSX.Element;
export type NavigationDrawerSubItemState = 'first' | 'intermediate-before' | 'intermediate-after' | 'last';
export interface NavigationDrawerItemProps {
  label: string; secondaryLabel?: string;
  /** Tabler icon name */
  Icon?: string; icon?: ReactNode; iconColor?: string;
  /** Top-level object rows: fill of the 16px radius-sm tile the 14px glyph sits in — use --t-object-tile-<hue>, paired with iconColor set to the matching --t-tag-text-<hue> */
  iconTile?: string;
  /** Hairline border on that tile — use the matching --t-object-tile-border-<hue> */
  iconTileBorder?: string;
  /** Nested rows always tile in --t-background-quaternary; this is the separate 24px gray3 tile */
  withIconBackground?: boolean;
  active?: boolean;
  /** 1 = top level, 2 = child (tree rail), 3 = grandchild */
  indentationLevel?: 1 | 2 | 3;
  subItemState?: NavigationDrawerSubItemState;
  modifier?: 'soon' | 'new' | { keyboard: string[] };
  rightOptions?: ReactNode; alwaysShowRightOptions?: boolean;
  /** Renders a chevron that rotates when open */
  isOpen?: boolean;
  count?: number;
  variant?: 'default' | 'tertiary';
  onClick?: () => void;
}
export declare function NavigationDrawerItem(props: NavigationDrawerItemProps): JSX.Element;
