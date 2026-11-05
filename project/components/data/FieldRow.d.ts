import type { ReactNode, CSSProperties } from 'react';
/**
 * Show-page field line: tertiary 16px field-type icon + 12px label (fixed 140px) + value; hover fills the value slot.
 * FieldGroup wraps rows under a 13px/500 tertiary title with a chevron.
 */
export interface FieldRowProps { label: string; /** Tabler icon */ Icon?: string; value?: ReactNode; placeholder?: string; labelWidth?: number; readonly?: boolean; onClick?: () => void; style?: CSSProperties; }
export declare function FieldRow(props: FieldRowProps): JSX.Element;
export interface FieldGroupProps { title: string; children: ReactNode; isOpen?: boolean; onToggle?: () => void; style?: CSSProperties; }
export declare function FieldGroup(props: FieldGroupProps): JSX.Element;
