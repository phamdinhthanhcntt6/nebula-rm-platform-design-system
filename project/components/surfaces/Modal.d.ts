import type { ReactNode, CSSProperties } from 'react';
/**
 * Centered dialog panel (8px radius, super-heavy shadow) over a 36% black overlay.
 */
export interface ModalProps { children: ReactNode; size?: 'small' | 'medium' | 'large' | 'extraLarge'; padding?: 'none' | 'small' | 'medium' | 'large'; isOpen?: boolean; onClose?: () => void; /** Render the panel without the overlay (for specimens) */ inline?: boolean; style?: CSSProperties; }
export declare function Modal(props: ModalProps): JSX.Element | null;
export interface ConfirmationModalProps { title: string; subtitle?: ReactNode; confirmButtonText?: string; confirmButtonAccent?: 'danger' | 'blue' | 'default'; onConfirm?: () => void; onClose?: () => void; isOpen?: boolean; inline?: boolean; }
export declare function ConfirmationModal(props: ConfirmationModalProps): JSX.Element | null;
export interface DialogAction { title: string; onClick?: () => void; accent?: 'blue' | 'danger' | 'green' | 'default'; disabled?: boolean; }
/** Working dialog (Customers page): 440px, header icon + title + close, scrolling body, footer with secondary left / primary right. */
export interface DialogProps { title: ReactNode; /** Tabler icon name for the header */ Icon?: string; iconColor?: string; children?: ReactNode; width?: number; primary?: DialogAction; secondary?: DialogAction | null; footerLeft?: ReactNode; /** 'split' = secondary left / primary right (Customers); 'end' = both right (Full Scope, use width 560, Icon null) */ footerAlign?: 'split' | 'end'; onClose?: () => void; isOpen?: boolean; inline?: boolean; style?: CSSProperties; }
export declare function Dialog(props: DialogProps): JSX.Element | null;
