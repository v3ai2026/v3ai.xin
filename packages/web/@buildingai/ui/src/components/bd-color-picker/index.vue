<script lang="ts" setup>
/**
 * Professional color selector component
 * @description Based on UPopover and UColorPicker, supports clicking to select colors
 */
import { computed, h, markRaw, ref, resolveComponent } from "vue";
import type { Composer } from "vue-i18n";

import type { BdColorPickerEmits, BdColorPickerProps } from "./types";

const props = withDefaults(defineProps<BdColorPickerProps>(), {
    modelValue: "",
    size: "sm",
    disabled: false,
    placeholder: "",
    format: "hex",
    alpha: false,
    colorWidth: "22px",
    colorHeight: "22px",
    presets: () => ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082"],
});

const emit = defineEmits<BdColorPickerEmits>();

// Internationalization
const { $i18n } = useNuxtApp();
const { t } = $i18n as Composer;

// Popup panel status
const isOpen = ref(false);
// Internal color value (for UColorPicker)
const internalColor = ref("#000000");
const UInput = resolveComponent("UInput");

// Computed properties
const currentColor = computed({
    get: () => props.modelValue || "",
    set: (value: string) => {
        emit("update:modelValue", value);
        emit("change", value);
    },
});

// Check if it is a CSS variable
const isCssVar = computed(() => {
    return currentColor.value.startsWith("var(");
});

// Displayed color value (handling transparent or empty values)
const displayColor = computed(() => {
    if (!currentColor.value || currentColor.value === "transparent") {
        return "transparent";
    }
    return currentColor.value;
});

// Placeholder text
const placeholderText = computed(() => {
    return props.placeholder || t("common.placeholder.colorSelect");
});

// Color block style
const colorBlockStyle = computed(() => {
    const baseStyle = {
        width: props.colorWidth,
        height: props.colorHeight,
    };

    if (!currentColor.value || currentColor.value === "transparent") {
        return {
            ...baseStyle,
            backgroundColor: "transparent",
            backgroundImage:
                "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
            backgroundSize: "8px 8px",
            backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
        };
    }

    // If it is a CSS variable, use directly
    if (isCssVar.value) {
        return {
            ...baseStyle,
            backgroundColor: currentColor.value,
        };
    }

    // Normal color value
    return {
        ...baseStyle,
        backgroundColor: currentColor.value,
    };
});

/**
 * Handle color selection
 */
function handleColorChange(color: string | undefined) {
    if (color) {
        internalColor.value = color;
        currentColor.value = color;
    }
}

/**
 * Handle popup panel open
 */
function handleOpen() {
    // If the current value is not a CSS variable and has a value, set to internal color
    if (!isCssVar.value && currentColor.value && currentColor.value !== "transparent") {
        internalColor.value = currentColor.value;
    }
}

/**
 * Handle popup panel close
 */
function handleClose() {
    isOpen.value = false;
}

/**
 * Handle preset color click
 */
function handlePresetClick(color: string) {
    currentColor.value = color;
    internalColor.value = color;
    isOpen.value = false;
}

/**
 * Handle clear color
 */
function handleClear() {
    currentColor.value = "transparent";
    isOpen.value = false;
}

/**
 * Handle use CSS variable
 */
async function handleUseCssVar() {
    const inputValue = ref("");

    // If the current is already a CSS variable, extract the variable name as the default value
    if (isCssVar.value) {
        const match = currentColor.value.match(/var\(([^)]+)\)/);
        if (match) {
            inputValue.value = match[1] || "";
        }
    }

    try {
        const CssVarInput = markRaw({
            setup() {
                return () =>
                    h("div", { class: "space-y-4" }, [
                        h(
                            "div",
                            { class: "text-sm text-gray-600" },
                            t("common.colorPicker.cssVariableInputTip"),
                        ),
                        h(UInput, {
                            modelValue: inputValue.value,
                            "onUpdate:modelValue": (value: string) => {
                                inputValue.value = value;
                            },
                            placeholder: t("common.colorPicker.cssVariablePlaceholder"),
                            class: "w-full",
                            size: "md",
                        }),
                    ]);
            },
        });

        await useModal({
            title: t("common.colorPicker.setCssVariable"),
            description: t("common.colorPicker.setCssVariableDesc"),
            content: CssVarInput,
            confirmText: t("common.confirm"),
            cancelText: t("common.cancel"),
            color: "primary",
        });

        // After the user clicks confirm, the processing
        if (inputValue.value.trim()) {
            const varName = inputValue.value.trim();
            const cssVar = varName.startsWith("--") ? `var(${varName})` : `var(--${varName})`;
            currentColor.value = cssVar;
            isOpen.value = false;
        }
    } catch {
        // The user cancels or closes the popup, no processing is done
        console.log("用户取消了CSS变量设置");
    }
}
</script>

<template>
    <UPopover
        v-model:open="isOpen"
        :disabled="disabled"
        placement="bottom-start"
        @open="handleOpen"
    >
        <div class="relative">
            <!-- Trigger button -->
            <UButton
                variant="outline"
                :disabled="disabled"
                :size="size"
                class="w-full justify-between gap-2"
                :class="[disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer']"
            >
                <div class="flex items-center gap-2">
                    <!-- Color block -->
                    <div
                        :style="colorBlockStyle"
                        class="size-2 rounded border border-gray-200 shadow-sm"
                        :class="{ 'ring-1 ring-blue-500': isCssVar }"
                    />

                    <!-- Color value display -->
                    <span
                        class="text-foreground text-left text-xs"
                        :class="{ 'text-blue-600': isCssVar }"
                    >
                        {{ displayColor || placeholderText }}
                    </span>
                </div>

                <!-- CSS variable identifier -->
                <span v-if="isCssVar" class="text-xs text-blue-500">
                    {{ t("common.colorPicker.cssVariable") }}
                </span>
            </UButton>
        </div>

        <template #content>
            <div class="bg-background w-64 rounded-lg p-2">
                <!-- Color selector - only displayed when not a CSS variable -->
                <div class="mb-4">
                    <UColorPicker
                        v-model="internalColor"
                        :format="format"
                        :alpha="alpha"
                        @update:model-value="handleColorChange"
                    />
                </div>

                <!-- CSS variable Tips -->
                <div v-if="isCssVar" class="mb-4 rounded bg-blue-50 p-2 text-xs text-blue-700">
                    {{ t("common.colorPicker.currentCssVariable") }}:
                    {{ currentColor }}
                </div>

                <!-- Preset colors -->
                <div v-if="presets.length > 0" class="mb-4">
                    <div class="mb-2 text-xs font-medium text-gray-700">
                        {{ t("common.colorPicker.presetColors") }}
                    </div>
                    <div class="grid grid-cols-6 gap-2">
                        <button
                            v-for="preset in presets"
                            :key="preset"
                            type="button"
                            class="h-6 w-6 rounded ring-0 transition-transform outline-none hover:scale-110"
                            :style="{ backgroundColor: preset }"
                            @click="handlePresetClick(preset)"
                        />
                    </div>
                </div>

                <!-- Operation button -->
                <div class="flex justify-between gap-2">
                    <div class="flex gap-2">
                        <UButton size="sm" variant="ghost" icon="i-lucide-x" @click="handleClear">
                            {{ t("common.colorPicker.clear") }}
                        </UButton>

                        <UButton
                            size="sm"
                            variant="ghost"
                            icon="i-lucide-code"
                            @click="handleUseCssVar"
                        >
                            {{ t("common.colorPicker.cssVariable") }}
                        </UButton>
                    </div>

                    <UButton size="sm" icon="i-lucide-check" @click="handleClose">
                        {{ t("common.confirm") }}
                    </UButton>
                </div>
            </div>
        </template>
    </UPopover>
</template>

<style scoped>
/* Transparent background chessboard texture */
.transparent-bg {
    background-image:
        linear-gradient(45deg, #ccc 25%, transparent 25%),
        linear-gradient(-45deg, #ccc 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #ccc 75%),
        linear-gradient(-45deg, transparent 75%, #ccc 75%);
    background-size: 8px 8px;
    background-position:
        0 0,
        0 4px,
        4px -4px,
        -4px 0px;
}
</style>
