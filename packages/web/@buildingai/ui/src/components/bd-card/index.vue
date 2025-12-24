<script setup lang="ts">
import { cn } from "@buildingai/utils/cn";
import { computed, useSlots } from "vue";

import type { ActionItem, BdCardEmits, BdCardProps } from "./types";

/**
 * General card component
 * Supports selection, operation menu, icon display and other functions
 * Use slot system to achieve high customization
 */

const props = withDefaults(defineProps<BdCardProps>(), {
    selectable: false,
    selected: false,
    clickable: false,
    size: "md",
    showActions: false,
    actions: () => [],
    variant: "default",
    disabled: false,
    loading: false,
});

const emit = defineEmits<BdCardEmits>();

/**
 * Get card size class name
 * When the bottom slot exists, adjust the bottom padding of the md size
 */
const sizeClasses = computed(() => {
    const hasFooter = !!useSlots().footer;
    const sizeMap = {
        sm: "p-3",
        md: hasFooter ? "px-6 pt-6 pb-4" : "p-6",
        lg: "p-6",
        xl: "p-8",
    };
    return sizeMap[props.size];
});

/**
 * Get card variant class name
 */
const variantClasses = computed(() => {
    const variantMap = {
        default: "bg-background shadow-default border border-transparent",
        outlined: "bg-background border border-border/70 hover:border-border hover:bg-muted/70",
        elevated: "bg-background shadow-lg",
        flat: "bg-background",
    };
    return variantMap[props.variant];
});

/**
 * Handle card click
 */
function handleCardClick(event: MouseEvent) {
    if (props.disabled || props.loading) return;
    if (props.clickable) {
        emit("click", event);
    }
}

/**
 * Handle selection status change
 */
function handleSelect(value: boolean | "indeterminate") {
    if (props.disabled || props.loading) return;
    if (typeof value === "boolean") {
        emit("select", value);
    }
}

/**
 * Handle operation menu click
 */
function handleAction(action: ActionItem) {
    if (props.disabled || props.loading) return;
    if (action.onSelect) {
        action.onSelect();
    }
    emit("action", action);
}

/**
 * Filter valid operation items
 */
const filteredActions = computed(() => {
    return props.actions.filter(Boolean);
});

/**
 * Whether to display the selection box
 */
const showCheckbox = computed(() => {
    return props.selectable && !props.disabled && !props.loading;
});
</script>

<template>
    <div
        class="group relative flex flex-col overflow-hidden rounded-lg transition-all duration-200"
        :class="[
            variantClasses,
            {
                // 'ring-primary-500 ring-2 ring-offset-2 dark:ring-offset-gray-800': selected,
                'border-primary hover:border-primary': selected && variant === 'outlined',
                'cursor-pointer hover:shadow-lg':
                    clickable && !disabled && !loading && variant !== 'outlined',
                'hover:shadow-md': !clickable && !disabled && !loading && variant !== 'outlined',
                'cursor-not-allowed opacity-60': disabled,
                'pointer-events-none': loading,
            },
            props.class,
        ]"
        @click="handleCardClick"
    >
        <!-- Loading mask -->
        <div
            v-if="loading"
            class="bg-background/80 absolute inset-0 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm"
        >
            <UIcon name="i-lucide-loader-2" class="text-primary h-6 w-6 animate-spin" />
        </div>

        <!-- Top right operation menu -->
        <div
            v-if="showActions && filteredActions.length > 0 && !disabled && !loading"
            class="absolute top-4 right-4 z-40"
            @click.stop
        >
            <UDropdownMenu
                :items="[
                    filteredActions.map((action) => ({
                        ...action,
                        onSelect: () => handleAction(action),
                    })),
                ]"
                :popper="{ placement: 'bottom-end' }"
            >
                <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-ellipsis-vertical"
                    size="sm"
                />
            </UDropdownMenu>
        </div>

        <!-- Card main content -->
        <div :class="cn('flex-1', sizeClasses)">
            <!-- Icon/avatar area -->
            <div v-if="$slots.icon" class="group/icon relative inline-block" @click.stop>
                <!-- Top left selection box -->
                <div v-if="showCheckbox" class="absolute top-0 left-0 z-10 size-12">
                    <div
                        class="flex h-full w-full items-center justify-center rounded-full"
                        v-ripple
                    >
                        <UCheckbox
                            :model-value="selected"
                            @update:model-value="handleSelect"
                            class="cursor-pointer opacity-0 transition-opacity duration-200 group-hover/icon:opacity-100"
                            :class="{ 'opacity-100': selected }"
                            size="xl"
                        />
                    </div>
                </div>

                <!-- Icon content slot -->
                <slot
                    name="icon"
                    :selected="selected"
                    :disabled="disabled"
                    :loading="loading"
                    :group-hover-class="showCheckbox ? 'group-hover/icon:opacity-0' : ''"
                    :selected-class="showCheckbox && selected ? 'opacity-0' : ''"
                />
            </div>

            <!-- Main content area -->
            <div v-if="$slots.default" class="space-y-2" :class="{ 'mt-4': $slots.icon }">
                <slot :selected="selected" :disabled="disabled" :loading="loading" />
            </div>

            <!-- Title area -->
            <div
                v-if="$slots.title"
                class="space-y-2"
                :class="{ 'mt-4': $slots.icon || $slots.default }"
            >
                <slot name="title" :selected="selected" :disabled="disabled" :loading="loading" />
            </div>

            <!-- Description area -->
            <div
                v-if="$slots.description"
                class="space-y-2"
                :class="{ 'mt-2': $slots.title || $slots.icon || $slots.default }"
            >
                <slot
                    name="description"
                    :selected="selected"
                    :disabled="disabled"
                    :loading="loading"
                />
            </div>

            <!-- Tags area -->
            <div
                v-if="$slots.tags"
                class="flex flex-wrap gap-2"
                :class="{
                    'mt-3': $slots.description || $slots.title || $slots.icon || $slots.default,
                }"
            >
                <slot name="tags" :selected="selected" :disabled="disabled" :loading="loading" />
            </div>

            <!-- Details area -->
            <div
                v-if="$slots.details"
                class="space-y-2"
                :class="{
                    'mt-4':
                        $slots.tags ||
                        $slots.description ||
                        $slots.title ||
                        $slots.icon ||
                        $slots.default,
                }"
            >
                <slot name="details" :selected="selected" :disabled="disabled" :loading="loading" />
            </div>
        </div>

        <!-- Bottom operation area -->
        <div v-if="$slots.footer" class="border-default border-t px-6 py-3">
            <slot name="footer" :selected="selected" :disabled="disabled" :loading="loading" />
        </div>

        <!-- Extended slot: for special layout -->
        <slot name="extra" :selected="selected" :disabled="disabled" :loading="loading" />
    </div>
</template>
