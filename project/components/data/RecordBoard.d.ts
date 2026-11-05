import type { ReactNode, CSSProperties } from 'react';
import type { TagColor } from '../core/Tag';
export interface RecordCardField { /** Tabler icon (field type) */ Icon: string; value?: ReactNode; label?: string; placeholder?: string; }
/**
 * Kanban board: RecordBoard (horizontal scroller) > RecordBoardColumn (300px, header = RecordGroupChip + aggregate,
 * light left border) > RecordCard (background-secondary, 1px medium border, 4px radius; title row + icon/value rows).
 */
export interface RecordBoardProps { children: ReactNode; onAddGroup?: () => void; addGroupLabel?: string; style?: CSSProperties; }
export declare function RecordBoard(props: RecordBoardProps): JSX.Element;
export interface RecordBoardColumnProps { title: string; color?: TagColor; aggregate?: string; count?: number; children?: ReactNode; isFirst?: boolean; /** "No value" column: dashed/bordered title + "+ New" footer */ noValue?: boolean; onAddCard?: () => void; addLabel?: string; width?: number; style?: CSSProperties; }
export declare function RecordBoardColumn(props: RecordBoardColumnProps): JSX.Element;
export declare function RecordGroupChip(props: { label: string; color?: TagColor }): JSX.Element;
export interface RecordCardProps { title: string; titleAvatar?: ReactNode; fields?: RecordCardField[]; selected?: boolean; active?: boolean; compact?: boolean; onClick?: () => void; style?: CSSProperties; }
export declare function RecordCard(props: RecordCardProps): JSX.Element;
