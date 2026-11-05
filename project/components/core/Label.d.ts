import type { ReactNode, CSSProperties } from 'react';
/** 11px/600 light-gray label — drawer section titles ("Workspace", "R&D"), field group labels. */
export interface LabelProps { children: ReactNode; style?: CSSProperties; }
export declare function Label(props: LabelProps): JSX.Element;
/** Settings section heading: 16px/500 title + 13px tertiary description. */
export interface H2TitleProps { title: string; description?: string; adornment?: ReactNode; style?: CSSProperties; }
export declare function H2Title(props: H2TitleProps): JSX.Element;
