import type { CSSProperties } from 'react';
import type { TagColor } from '../core/Tag';
export interface SelectOption { value: string; label: string; Icon?: string; color?: TagColor; }
/** Select trigger styled like TextInput (primary bg, medium border, light chevron, no halo); options with a color render as Tags. md 32px, sm 28px inline. */
export interface SelectProps { value?: string; options: SelectOption[]; onChange?: (value: string) => void; placeholder?: string; label?: string; fullWidth?: boolean; disabled?: boolean; withSearch?: boolean; sizeVariant?: 'sm' | 'md'; style?: CSSProperties; }
export declare function Select(props: SelectProps): JSX.Element;
