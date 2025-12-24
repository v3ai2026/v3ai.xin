<script setup lang="ts">
import { computed } from "vue";

import type { InteractionMode } from "../../hooks/use-panzoom";

interface Props {
    /**
     * 当前缩放比例
     */
    scale?: number;
    /**
     * 当前交互模式
     */
    modelValue?: InteractionMode;
}

const props = withDefaults(defineProps<Props>(), {
    scale: 1,
    modelValue: "touchpad",
});

const emit = defineEmits<{
    (e: "zoomIn"): void;
    (e: "zoomOut"): void;
    (e: "reset"): void;
    (e: "focus"): void;
    (e: "update:modelValue", value: InteractionMode): void;
}>();

// 格式化缩放比例
const formattedScale = computed(() => {
    return `${Math.round(props.scale * 100)}%`;
});

// 交互模式选项
const interactionModes = [
    {
        label: "鼠标友好模式",
        value: "mouse" as const,
        description: "按住鼠标左键拖动画布，直接滚轮缩放",
        icon: "i-lucide-mouse",
    },
    {
        label: "触摸板友好模式",
        value: "touchpad" as const,
        description: "双指同向移动拖放，双指张开捏合缩放",
        icon: "i-lucide-tv-minimal",
    },
];
</script>

<template>
    <div
        class="border-muted bg-background absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-lg border p-1 shadow-lg"
    >
        <div class="flex items-center gap-0.5">
            <UPopover
                :content="{
                    align: 'center',
                    side: 'top',
                    sideOffset: 20,
                }"
            >
                <UButton variant="ghost" color="neutral" size="sm" class="p-2">
                    <UIcon
                        :name="
                            props.modelValue === 'mouse' ? 'i-lucide-mouse' : 'i-lucide-tv-minimal'
                        "
                        class="size-4"
                    />
                    <UIcon name="i-heroicons-chevron-down" class="size-4" />
                </UButton>

                <template #content>
                    <div class="flex w-100 gap-4 p-2">
                        <div
                            v-for="mode in interactionModes"
                            :key="mode.value"
                            class="hover:bg-muted flex cursor-pointer items-center rounded-lg p-3 transition-all"
                            :class="{
                                'bg-primary-50 text-primary-600': props.modelValue === mode.value,
                            }"
                            @click="emit('update:modelValue', mode.value)"
                        >
                            <UIcon :name="mode.icon" class="h-5 w-5 flex-none" />
                            <div class="ml-3 flex-1">
                                <div class="mb-1 text-sm font-medium">
                                    {{ mode.label }}
                                </div>
                                <div class="text-muted-foreground text-xs">
                                    {{ mode.description }}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </UPopover>

            <UButton variant="ghost" color="neutral" size="sm" class="p-2" @click="emit('zoomOut')">
                <UIcon name="i-heroicons-minus" class="size-4" />
            </UButton>

            <UButton
                variant="ghost"
                color="neutral"
                size="sm"
                class="min-w-12 px-3 py-2"
                @click="emit('reset')"
            >
                {{ formattedScale }}
            </UButton>

            <UButton variant="ghost" color="neutral" size="sm" class="p-2" @click="emit('zoomIn')">
                <UIcon name="i-heroicons-plus" class="size-4" />
            </UButton>

            <UTooltip text="聚焦当前页面" :delay-duration="0" :popper="{ placement: 'top' }">
                <UButton
                    variant="ghost"
                    color="neutral"
                    size="sm"
                    class="p-2"
                    @click="emit('focus')"
                >
                    <UIcon name="i-lucide-fullscreen" class="size-4" />
                </UButton>
            </UTooltip>
        </div>
    </div>
</template>
