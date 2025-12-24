/**
 * Color picker component types
 * @description Type definitions for BdColorPicker component
 */

export interface BdColorPickerProps {
    /** Current color value */
    modelValue?: string;
    /** Component size */
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    /** Whether disabled */
    disabled?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** Display format */
    format?: "hex" | "rgb" | "hsl";
    /** Preset colors */
    presets?: string[];
    /** Whether to display transparency slider */
    alpha?: boolean;
    /** Color block width */
    colorWidth?: string;
    /** Color block height */
    colorHeight?: string;
}

export interface BdColorPickerEmits {
    /** Update color value */
    (e: "update:modelValue", value: string): void;
    /** Color change event */
    (e: "change", value: string): void;
}
