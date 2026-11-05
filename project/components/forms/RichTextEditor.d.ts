import type { ReactNode, CSSProperties } from 'react';
/**
 * Long-form block editor (Customers page "Nội dung gửi khách"): borderless contentEditable, 13px/1.6 text indented 20px,
 * italic extra-light placeholder, per-block grip menu (Add Block / Change Color / Delete) and a selection bubble toolbar
 * (block type, bold, italic, underline, strike, lists, align/indent/colors, link). label/meta add the section header + top rule.
 */
export interface RichTextEditorProps {
  /** 13px/500 section title */
  label?: ReactNode;
  /** Right side of the header — string renders 12px light text (e.g. "Chưa có nội dung"), or pass a Tag */
  meta?: ReactNode;
  placeholder?: string;
  initialHtml?: string;
  minHeight?: number;
  /** Grow to fill a flex column and scroll inside */
  fill?: boolean;
  /** Submitted/locked content: not editable, 70% opacity */
  readOnly?: boolean;
  onChange?: (html: string, text: string) => void;
  style?: CSSProperties;
}
export declare function RichTextEditor(props: RichTextEditorProps): JSX.Element;
