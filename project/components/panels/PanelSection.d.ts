import type { ReactNode, CSSProperties } from 'react';
/** Collapsible SidePanel section: 12px padding, light bottom rule, 13px/500 title + light meta + chevron. */
export interface PanelSectionProps { title?: ReactNode; meta?: ReactNode; defaultOpen?: boolean; /** Drop the bottom rule on the final section */ last?: boolean; children?: ReactNode; style?: CSSProperties; }
export declare function PanelSection(props: PanelSectionProps): JSX.Element;
/** 24px key/value row: 12px tertiary label (+ optional 16px field icon), primary value on the right. */
export interface KVRowProps { label: ReactNode; value?: ReactNode; /** Tabler field-type icon */ Icon?: string; /** 13px secondary label */ strongLabel?: boolean; /** Value wraps on its own line below the label */ multiline?: boolean; }
export declare function KVRow(props: KVRowProps): JSX.Element;
/** Section footer: secondary "open" button (arrow-up-right) + right-aligned 12px note. */
export interface SectionFooterProps { link: string; note?: ReactNode; onClick?: () => void; }
export declare function SectionFooter(props: SectionFooterProps): JSX.Element;
/** Quoted value box — secondary bg, light border, 4px radius, pre-wrap. */
export interface QuoteBoxProps { children?: ReactNode; style?: CSSProperties; }
export declare function QuoteBox(props: QuoteBoxProps): JSX.Element;
/** Metric tile: label / 16px bold value / light sub, secondary bg, md radius. */
export interface KpiTileProps { label: ReactNode; value: ReactNode; sub?: ReactNode; onClick?: () => void; style?: CSSProperties; }
export declare function KpiTile(props: KpiTileProps): JSX.Element;
/** 28px clickable line in a panel section (open attentions, cases): leading tag/icon, text, trailing, chevron. */
export interface PanelListRowProps { leading?: ReactNode; /** 14px tertiary Tabler icon */ Icon?: string; text: ReactNode; trailing?: ReactNode; onClick?: () => void; title?: string; }
export declare function PanelListRow(props: PanelListRowProps): JSX.Element;
/** Small boxed notice in a section: warn (orange) or empty (bordered). */
export interface InlineNoticeProps { tone?: 'warn' | 'empty'; title: ReactNode; children?: ReactNode; }
export declare function InlineNotice(props: InlineNoticeProps): JSX.Element;
/** Read-only KVRow value that gets a transparent-light pill on hover. */
export interface HugValueProps { children?: ReactNode; }
export declare function HugValue(props: HugValueProps): JSX.Element;
/** "✦ AI" marker for AI-written content. */
export interface AiMarkProps { title?: string; }
export declare function AiMark(props: AiMarkProps): JSX.Element;
/** Two-line section item (cases / tasks / interactions): optional status dot, title, right Tag, light sub line. */
export interface PanelItemRowProps { /** CSS color of the 6px dot */ dot?: string; title: ReactNode; sub?: ReactNode; right?: ReactNode; onClick?: () => void; }
export declare function PanelItemRow(props: PanelItemRowProps): JSX.Element;
/** Accent "Hôm nay nên làm gì" card at the top of a customer panel; pass `empty` text for the no-attention state. */
export interface SuggestionCardProps { title?: string; ai?: boolean; review?: boolean; summary?: ReactNode; hint?: ReactNode; actionLabel?: string; onAction?: () => void; moreCount?: number; moreLabel?: string; onMore?: () => void; empty?: ReactNode; }
export declare function SuggestionCard(props: SuggestionCardProps): JSX.Element;
