import type { ReactNode, CSSProperties } from 'react';
/**
 * Letter avatar with a hue derived from the record name (Twenty Avatar).
 * md (16px) is the size used inside chips and table cells; lg (24px) in headers; xl (40px) on show pages.
 */
export interface AvatarProps {
  /** Name — first character is shown */
  placeholder: string;
  /** Seed for the hue when different from placeholder */
  placeholderColorSeed?: string;
  avatarUrl?: string | null;
  size?: 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  /** squared = 2px radius (records), rounded = circle (people), icon = 4px */
  type?: 'squared' | 'rounded' | 'icon';
  Icon?: ReactNode;
  color?: string;
  backgroundColor?: string;
  onClick?: () => void;
  style?: CSSProperties;
}
export declare function Avatar(props: AvatarProps): JSX.Element;
export declare function hueFromString(s: string): string;
