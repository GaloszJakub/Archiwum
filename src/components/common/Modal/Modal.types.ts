import { ReactNode } from 'react';

/**
 * Size variants for the Modal component
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Props for the Modal component
 * 
 * @template T - Optional generic type for data passed to the modal
 */
export interface ModalProps {
  /**
   * Controls whether the modal is open or closed
   */
  isOpen: boolean;

  /**
   * Callback function called when the modal should close
   */
  onClose: () => void;

  /**
   * Optional title displayed in the modal header
   */
  title?: string;

  /**
   * Optional description displayed below the title
   */
  description?: string;

  /**
   * Content to be rendered inside the modal
   */
  children: ReactNode;

  /**
   * Optional footer content (typically action buttons)
   */
  footer?: ReactNode;

  /**
   * Size variant of the modal
   * @default 'md'
   */
  size?: ModalSize;

  /**
   * Whether clicking the overlay should close the modal
   * @default true
   */
  closeOnOverlayClick?: boolean;

  /**
   * Whether pressing Escape key should close the modal
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Additional CSS classes to apply to the modal content
   */
  className?: string;
}
