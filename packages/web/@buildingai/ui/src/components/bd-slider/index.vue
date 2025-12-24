<script lang="ts" setup>
/**
 * Professional slider component
 * @description Combined component with USlider on the left + numeric input box on the right
 */
import { computed } from "vue";

import type { BdSliderEmits, BdSliderProps } from "./types";

const props = withDefaults(defineProps<BdSliderProps>(), {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    size: "sm",
    disabled: false,
    color: "primary",
    inputWidth: "60px",
    formatter: (value: number) => value.toString(),
    parser: (displayValue: string) => parseFloat(displayValue) || 0,
});

const emit = defineEmits<BdSliderEmits>();

// Computed properties
const currentValue = computed({
    get: () => props.modelValue || 0,
    set: (value: number) => {
        // Ensure value is within reasonable range
        const clampedValue = Math.min(Math.max(value, props.min), props.max);
        emit("update:modelValue", clampedValue);
        emit("change", clampedValue);
    },
});

// Format display value
const displayValue = computed({
    get: () => props.formatter(currentValue.value),
    set: (value: string) => {
        const numericValue = props.parser(value);
        if (!isNaN(numericValue)) {
            currentValue.value = numericValue;
        }
    },
});

/**
 * Handle slider value change
 */
function handleSliderChange(value: number | undefined) {
    if (typeof value === "number") {
        currentValue.value = value;
    }
}

/**
 * Handle input box blur
 */
function handleInputBlur() {
    // Ensure input value is within range
    if (currentValue.value < props.min) {
        currentValue.value = props.min;
    } else if (currentValue.value > props.max) {
        currentValue.value = props.max;
    }
}
</script>

<template>
    <div class="flex items-center gap-3">
        <!-- Slider -->
        <div class="flex-1">
            <USlider
                :model-value="currentValue"
                :min="min"
                :max="max"
                :step="step"
                :size="size"
                :disabled="disabled"
                :color="color"
                @update:model-value="handleSliderChange"
            />
        </div>

        <!-- Numeric input box -->
        <div class="flex-none" :style="{ width: inputWidth }">
            <UInput
                v-model="displayValue"
                :size="size"
                :disabled="disabled"
                type="number"
                :min="min"
                :max="max"
                :step="step"
                class="text-center"
                :ui="{
                    base: 'text-center',
                }"
                @blur="handleInputBlur"
            />
        </div>
    </div>
</template>
