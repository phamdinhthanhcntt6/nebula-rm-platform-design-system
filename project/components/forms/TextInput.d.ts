import type { CSSProperties, ChangeEvent, FocusEvent, KeyboardEvent } from 'react';
/**
 * Text field as shipped on the Customers page: 32px, 4px radius, 1px medium border, primary background;
 * focus turns the border blue (no halo). sm = 24px inline-edit field. multiline = textarea.
 */
export interface TextInputProps {
  value?: string; defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent) => void; onKeyDown?: (event: KeyboardEvent) => void;
  placeholder?: string;
  /** 12px tertiary label above the field, sentence case */
  label?: string;
  error?: string; hint?: string;
  /** Tabler icon names */
  LeftIcon?: string; RightIcon?: string; onRightIconClick?: () => void;
  disabled?: boolean; fullWidth?: boolean;
  /** md = 32px form field; sm = 24px inline-edit field */
  sizeVariant?: 'sm' | 'md';
  /** Render a textarea (8px padding, vertical resize) */
  multiline?: boolean; rows?: number;
  type?: string; autoFocus?: boolean; name?: string;
  style?: CSSProperties; inputStyle?: CSSProperties;
}
export declare function TextInput(props: TextInputProps): JSX.Element;
