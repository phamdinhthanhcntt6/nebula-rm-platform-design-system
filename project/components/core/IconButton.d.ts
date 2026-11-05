import type { ReactNode, CSSProperties, MouseEvent } from 'react';
/**
 * Square icon-only button. variant 'light' is Twenty's LightIconButton — the
 * borderless 24/32px control used in headers, table cells and drawer rows.
 */
export interface IconButtonProps {
  /** Tabler icon name */
  Icon?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'light';
  /** light variant accepts 'secondary' | 'tertiary' (text tone) */
  accent?: 'default' | 'blue' | 'danger' | 'secondary' | 'tertiary';
  size?: 'medium' | 'small';
  shape?: 'square' | 'circle';
  position?: 'standalone' | 'left' | 'middle' | 'right';
  disabled?: boolean;
  /** light variant: blue icon when the associated dropdown is open */
  active?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string;
  style?: CSSProperties;
  className?: string;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
