import type { CSSProperties } from 'react';
/**
 * 12px checkbox (small) with a 5px hover halo — the record-table row selector.
 */
export interface CheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  /** Border tone when unchecked: primary = dark, secondary = mid, tertiary = light */
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'small' | 'large';
  shape?: 'squared' | 'rounded';
  accent?: 'blue' | 'orange';
  hoverable?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
}
export declare function Checkbox(props: CheckboxProps): JSX.Element;
