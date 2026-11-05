import type { CSSProperties } from 'react';
/** 14px radio: 1px strong border, blue border + 6px blue dot when checked. square = 3px radius variant. */
export interface RadioProps { checked?: boolean; square?: boolean; style?: CSSProperties; }
export declare function Radio(props: RadioProps): JSX.Element;
export interface RadioOption { value: string; label: string; hint?: string; }
/** Labelled list of 32px radio rows; selected row gets the accent-quaternary fill. toggle = clicking the selected row clears it. */
export interface RadioGroupProps { label?: string; options: RadioOption[]; value?: string | null; onChange?: (value: string | null) => void; row?: boolean; toggle?: boolean; square?: boolean; style?: CSSProperties; }
export declare function RadioGroup(props: RadioGroupProps): JSX.Element;
