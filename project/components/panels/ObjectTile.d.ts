import type { CSSProperties } from 'react';
export type ObjectTileHue = 'gray' | 'green' | 'blue' | 'purple' | 'violet' | 'yellow' | 'orange' | 'turquoise' | 'pink' | 'red';
/** 16px rounded icon tile: hue fill + hairline hue border + hue glyph; gray = tertiary fill, medium border, secondary glyph. */
export interface ObjectTileProps { /** Tabler icon name */ Icon: string; hue?: ObjectTileHue; size?: number; style?: CSSProperties; }
export declare function ObjectTile(props: ObjectTileProps): JSX.Element;
