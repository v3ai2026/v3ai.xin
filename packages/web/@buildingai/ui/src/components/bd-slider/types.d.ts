/**
 * Professional slider component types
 * @description Type definitions for BdSlider component
 */

export interface BdSliderProps {
    /** Current value */
    modelValue?: number;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step size */
    step?: number;
    /** Component size */
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    /** Whether disabled */
    disabled?: boolean;
    /** Slider color */
    color?: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral";
    /** Input box width */
    inputWidth?: string;
    /** Number display format */
    formatter?: (value: number) => string;
    /** Number parsing function */
    parser?: (displayValue: string) => number;
}

export interface BdSliderEmits {
    /** Update value */
    (e: "update:modelValue", value: number): void;
    /** Value change event */
    (e: "change", value: number): void;
}
