/**
 * Button copy component types
 * @description Type definitions for BdButtonCopy component
 */

export interface BdButtonCopyProps {
    /** The content to copy */
    content: string;
    /** Copied success text */
    copiedText?: string;
    /** Default text */
    defaultText?: string;
    /** Copied success icon */
    copiedIcon?: string;
    /** Default icon */
    defaultIcon?: string;
}
