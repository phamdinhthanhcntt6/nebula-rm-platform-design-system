import type { CSSProperties } from 'react';
export type TagColor = 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'turquoise' | 'blue' | 'purple' | 'pink' | 'sky' | 'amber' | 'violet' | 'transparent';
/**
 * Colored option pill for select/enum values (stage, status, type). 20px tall, 4px radius,
 * background = hue step 3, text = hue step 11.
 */
export interface TagProps {
  text: string;
  color?: TagColor;
  /** Tabler icon name (14px) */
  Icon?: string;
  weight?: 'regular' | 'medium';
  variant?: 'solid' | 'outline' | 'border';
  /** sm = 12px text, used inside card headers and dense metadata rows */
  size?: 'sm' | 'md';
  preventShrink?: boolean;
  preventPadding?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}
export declare function Tag(props: TagProps): JSX.Element;
