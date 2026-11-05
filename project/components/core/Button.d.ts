import type { ReactNode, CSSProperties, MouseEvent } from 'react';
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonAccent = 'default' | 'blue' | 'danger' | 'green';
export type ButtonSize = 'medium' | 'small';
export type ButtonPosition = 'standalone' | 'left' | 'middle' | 'right';
/**
 * Twenty Button: 32px (medium) / 24px (small), 8px radius, 13px/500 label.
 * variant primary+accent blue = the filled page action ("+ New …"). Default accent is the quiet gray fill.
 */
export interface ButtonProps {
  title?: string;
  /** Tabler icon name, rendered as a 16px glyph before the label */
  Icon?: string;
  /** Custom glyph node (overrides Icon) */
  icon?: ReactNode;
  variant?: ButtonVariant;
  accent?: ButtonAccent;
  size?: ButtonSize;
  /** Collapses radius/borders inside a button group */
  position?: ButtonPosition;
  fullWidth?: boolean;
  disabled?: boolean;
  justify?: 'center' | 'flex-start' | 'flex-end';
  /** Keyboard hint chips shown after the label, e.g. ["⌘","K"] */
  hotkeys?: string[];
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  dataTestId?: string;
}
export declare function Button(props: ButtonProps): JSX.Element;
