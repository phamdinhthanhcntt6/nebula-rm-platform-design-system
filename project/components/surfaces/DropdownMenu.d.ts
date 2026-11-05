import type { ReactNode, CSSProperties } from 'react';
/**
 * Floating menu: translucent primary surface + medium blur, 8px radius, medium border, strong shadow;
 * rows are 32px MenuItems (4px side padding, 4px radius hover fill). Optional icon-less search row and header.
 */
export interface DropdownMenuProps { children: ReactNode; width?: number | string; search?: { value: string; onChange?: (v: string) => void; placeholder?: string }; header?: ReactNode; footer?: ReactNode; style?: CSSProperties; }
export declare function DropdownMenu(props: DropdownMenuProps): JSX.Element;
export interface MenuItemProps {
  text: ReactNode;
  /** Tabler icon name */
  LeftIcon?: string; iconColor?: string; LeftComponent?: ReactNode;
  RightIcon?: string; RightComponent?: ReactNode;
  /** Muted prefix before the text */
  contextualText?: ReactNode;
  hotKeys?: string[]; hasSubMenu?: boolean;
  accent?: 'default' | 'danger' | 'placeholder';
  selected?: boolean; focused?: boolean; disabled?: boolean;
  /** 20px gray tile behind the icon */
  withIconContainer?: boolean;
  onClick?: () => void; style?: CSSProperties;
}
export declare function MenuItem(props: MenuItemProps): JSX.Element;
export declare function MenuItemSeparator(): JSX.Element;
