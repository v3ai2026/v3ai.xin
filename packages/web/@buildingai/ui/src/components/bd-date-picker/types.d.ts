/**
 * Date picker component types
 * @description Type definitions for BdDatePicker component
 */

export interface DatePickerProps {
    /** Bound value, representing the currently selected date */
    modelValue?: Date | string | number;
    /** Date format style, defaults to 'medium' */
    dateStyle?: "full" | "long" | "medium" | "short";
    /** Time format style, defaults to medium */
    timeStyle?: "full" | "long" | "medium" | "short";
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Whether the component is read-only */
    readonly?: boolean;
    /** Whether the component is clearable */
    clearable?: boolean;
    /** Input box size */
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    /** Whether to show time selector */
    showTime?: boolean;
    /** Time selector format */
    timeFormat?: string;
    /** Default time value when date is selected without time, format: "HH:mm:ss" */
    defaultTime?: string;
    /** Custom icon */
    icon?: string;
    /** Custom popup position */
    placement?: "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end";
    /** Variant */
    variant?: "outline" | "soft" | "subtle" | "ghost" | "none";
    /** Color */
    color?: "primary" | "secondary" | "success" | "error" | "warning" | "neutral" | "info";
    /** UI custom configuration */
    ui?: {
        root?: string;
        base?: string;
        [key: string]: string | undefined;
    };
}

export interface DatePickerEmits {
    /** Triggered when the selected date changes */
    (e: "update:modelValue", value: Date | string | number | null): void;
    /** Triggered when the user confirms the selection */
    (e: "confirm", value: Date | string | number | null): void;
    /** Triggered when the user cancels the selection */
    (e: "cancel"): void;
    /** Triggered when the input box gains focus */
    (e: "focus", event: FocusEvent): void;
    /** Triggered when the input box loses focus */
    (e: "blur", event: FocusEvent): void;
    /** Triggered when the user clicks the clear button */
    (e: "clear"): void;
    /** Triggered when the dropdown panel opens */
    (e: "open"): void;
    /** Triggered when the dropdown panel closes */
    (e: "close"): void;
    /** Triggered when the date is changed */
    (e: "change", value: Date | string | number | null): void;
}
