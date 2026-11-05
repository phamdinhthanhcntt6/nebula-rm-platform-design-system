import type { CSSProperties } from 'react';
/** Switch: 32×20 medium / 24×16 small, blue track when on. */
export interface ToggleProps { value: boolean; onChange?: (value: boolean) => void; toggleSize?: 'small' | 'medium'; color?: string; disabled?: boolean; ariaLabel?: string; style?: CSSProperties; }
export declare function Toggle(props: ToggleProps): JSX.Element;
