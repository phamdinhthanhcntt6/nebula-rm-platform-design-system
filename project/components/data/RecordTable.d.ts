import type { ReactNode, CSSProperties } from 'react';
export type FieldType = 'text' | 'number' | 'currency' | 'date' | 'select' | 'multiselect' | 'relation' | 'boolean' | 'email' | 'phone' | 'link' | 'rating' | 'formula' | 'filter' | 'count' | 'address' | 'user';
export interface RecordTableColumn { id: string; label: string; type?: FieldType; /** Tabler icon override */ Icon?: string; width?: number; }
export interface RecordTableRow { id: string; [field: string]: any; }
/**
 * Record index table: 32px rows, 1px light grid (right + bottom), tertiary 13px/500 headers
 * with field-type icons, 32px checkbox column, "+ Add New" row and "Calculate ▾" aggregate footer.
 * Selected rows tint accent-quaternary; hover tints background-secondary.
 */
export interface RecordTableProps {
  columns: RecordTableColumn[]; rows: RecordTableRow[];
  selectedIds?: string[]; onSelectionChange?: (ids: string[]) => void;
  /** Custom cell renderer; default prints row[column.id] */
  renderCell?: (row: RecordTableRow, column: RecordTableColumn) => ReactNode;
  onRowClick?: (row: RecordTableRow) => void;
  addNewLabel?: string; onAddNew?: () => void;
  aggregateLabel?: string; aggregates?: Record<string, string>;
  hasAddColumn?: boolean; minWidth?: number; style?: CSSProperties;
}
export declare function RecordTable(props: RecordTableProps): JSX.Element;
export declare const FIELD_TYPE_ICONS: Record<FieldType, string>;
