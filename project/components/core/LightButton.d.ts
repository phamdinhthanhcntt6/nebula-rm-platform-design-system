import type { CSSProperties } from 'react';
/** Borderless 24px text button (simplize-ui LightButton) — suggested prompts in Ask AI, inline links in settings. */
export interface LightButtonProps { title: string; /** Tabler icon (14px) */ Icon?: string; accent?: 'secondary' | 'tertiary'; active?: boolean; disabled?: boolean; onClick?: () => void; style?: CSSProperties; }
export declare function LightButton(props: LightButtonProps): JSX.Element;
