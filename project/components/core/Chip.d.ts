import type { ReactNode, CSSProperties } from 'react';
/**
 * Avatar + label chip — how every relation/record value is rendered
 * (a 16px letter avatar beside 13px text, 4px radius hover fill).
 */
export interface ChipProps {
  label: string;
  /** Overrides the auto letter-avatar */
  leftComponent?: ReactNode | null;
  /** Show the letter avatar (default true) */
  avatar?: boolean;
  avatarType?: 'squared' | 'rounded' | 'icon';
  size?: 'small' | 'large';
  /** regular = hover fill; highlighted/static = resting gray fill; transparent = text only */
  variant?: 'regular' | 'highlighted' | 'transparent' | 'rounded' | 'static';
  accent?: 'text-primary' | 'text-secondary';
  isBold?: boolean;
  disabled?: boolean;
  clickable?: boolean;
  maxWidth?: number;
  emptyLabel?: string;
  onClick?: () => void;
  style?: CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;
