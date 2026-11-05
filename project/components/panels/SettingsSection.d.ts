import type { ReactNode, CSSProperties } from 'react';
/** Bordered settings block: 40px header (title, tertiary meta, actions) over a 12px-padded body. */
export interface SettingsSectionProps { title: ReactNode; meta?: ReactNode; actions?: ReactNode; /** false = body edge-to-edge (tables) */ pad?: boolean; children?: ReactNode; style?: CSSProperties; }
export declare function SettingsSection(props: SettingsSectionProps): JSX.Element;
/** Blue pending-change bar with a required reason field, Huỷ and Lưu. onSave receives the trimmed reason. */
export interface SaveBarProps { label?: string; onCancel?: () => void; onSave?: (reason: string) => void; style?: CSSProperties; }
export declare function SaveBar(props: SaveBarProps): JSX.Element;
