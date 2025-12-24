/**
 * Card component types
 * @description Type definitions for BdCard component
 */

export interface ActionItem {
    /** Menu item label */
    label: string;
    /** Icon name */
    icon?: string;
    /** Color theme */
    color?: "primary" | "secondary" | "success" | "warning" | "error" | "info";
    /** Menu item type */
    type?: "separator";
    /** Click callback */
    onSelect?: () => void;
}

export interface BdCardProps {
    /** Whether it can be selected */
    selectable?: boolean;
    /** Whether it is selected */
    selected?: boolean;
    /** Whether it can be clicked */
    clickable?: boolean;
    /** Card size */
    size?: "sm" | "md" | "lg" | "xl";
    /** Whether to display operation menu */
    showActions?: boolean;
    /** Operation menu items */
    actions?: ActionItem[];
    /** Card variant */
    variant?: "default" | "outlined" | "elevated" | "flat";
    /** Whether it is disabled */
    disabled?: boolean;
    /** Custom class name */
    class?: string;
    /** Loading status */
    loading?: boolean;
}

export interface BdCardEmits {
    /** Selection status change */
    (e: "select", selected: boolean | "indeterminate"): void;
    /** Card click */
    (e: "click", event: MouseEvent): void;
    /** Operation menu click */
    (e: "action", action: ActionItem): void;
}
