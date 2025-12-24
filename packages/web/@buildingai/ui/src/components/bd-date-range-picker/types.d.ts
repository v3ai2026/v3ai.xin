/**
 * Date range picker component types
 * @description Type definitions for BdDateRangePicker component
 */

export interface DateRangePickerProps {
    /** Start date binding value */
    start?: Date | string | number | null;
    /** End date binding value */
    end?: Date | string | number | null;
    /** Date format, defaults to 'medium' */
    dateStyle?: "full" | "long" | "medium" | "short";
    /** Whether the component is disabled */
    disabled?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the component is read-only */
    readonly?: boolean;
    /** Whether the component is clearable */
    clearable?: boolean;
    /** Input box size */
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    /** Custom icon */
    icon?: string;
    /** Custom popup position */
    placement?: "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end";
    /** Variant */
    variant?: "outline" | "soft" | "subtle" | "ghost" | "none";
    /** Color */
    color?: "primary" | "secondary" | "success" | "error" | "warning" | "neutral" | "info";
    /** Number of displayed months */
    numberOfMonths?: number;
    /** Whether to show time selector */
    showTime?: boolean;
    /** Time selector format */
    timeFormat?: string;
    /** Default start time value when date is selected without time, format: "HH:mm:ss" */
    defaultStartTime?: string;
    /** Default end time value when date is selected without time, format: "HH:mm:ss" */
    defaultEndTime?: string;
    /** UI custom configuration */
    ui?: {
        root?: string;
        base?: string;
        [key: string]: string | undefined;
    };
}

export interface DateRangePickerEmits {
    /** Triggered when the start date changes */
    (e: "update:start", value: Date | string | number | null): void;
    /** Triggered when the end date changes */
    (e: "update:end", value: Date | string | number | null): void;
    /** Triggered when the user confirms the selection */
    (e: "confirm", start: Date | string | number | null, end: Date | string | number | null): void;
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
    /** Triggered when the date range is changed */
    (e: "change", start: Date | string | number | null, end: Date | string | number | null): void;
}
