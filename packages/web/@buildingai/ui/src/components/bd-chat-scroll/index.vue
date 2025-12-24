<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, useTemplateRef, watch } from "vue";

import type { BdInfiniteScrollEmits, BdInfiniteScrollProps } from "./types";

defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BdInfiniteScrollProps>(), {
    loading: false,
    hasMore: true,
    threshold: 200,
    loadingText: "Loading...",
});

const emits = defineEmits<BdInfiniteScrollEmits>();

/** Scroll container element reference */
let scrollContainer: HTMLElement | null = null;

/** Loading indicator element reference */
const loadingRef = useTemplateRef<HTMLDivElement>("loadingRef");

/** IntersectionObserver instance */
let observer: IntersectionObserver | null = null;

/**
 * Find scroll container element
 */
function findScrollContainer(element: HTMLElement | null): HTMLElement | null {
    if (!element) return null;

    let parent = element.parentElement;
    while (parent) {
        const { overflow, overflowY } = getComputedStyle(parent);
        if (["auto", "scroll"].includes(overflow) || ["auto", "scroll"].includes(overflowY)) {
            return parent;
        }
        parent = parent.parentElement;
    }

    return document.documentElement;
}

/**
 * Create and initialize IntersectionObserver
 * When the loading indicator element enters the viewport, trigger load more
 */
function createObserver() {
    // If the creation conditions are not met, return directly
    if (!window.IntersectionObserver || !loadingRef.value || !props.hasMore || props.loading)
        return;

    // In the flip mode, we need to monitor the top instead of the bottom
    // Because the content is flipped, we set the top rootMargin
    observer = new IntersectionObserver(
        (entries) => {
            if (entries[0]?.isIntersecting) {
                // Trigger load more event
                emits("loadMore");
            }
        },
        {
            root: scrollContainer,
            // In the flip mode, the top becomes the bottom in visual terms, so set the top margin
            rootMargin: `${props.threshold}px`,
            threshold: 0,
        },
    );

    observer.observe(loadingRef.value);
}

function resetObserver() {
    if (observer) {
        observer.disconnect();
        observer = null;
    }

    if (scrollContainer?.scrollTop == 0) {
        (scrollContainer as HTMLElement).scrollTop = 1;
    }

    nextTick(createObserver);
}

watch(
    () => [props.loading, props.hasMore],
    () => {
        resetObserver();
    },
);

onMounted(() => {
    createObserver();
    scrollContainer = findScrollContainer(loadingRef.value);
});
onUnmounted(() => {
    observer?.disconnect();
    observer = null;
});
</script>

<template>
    <div class="relative flex scale-y-[-1] flex-col items-center" v-bind="$attrs">
        <!-- Content area -->
        <div class="flex scale-y-[-1] flex-col-reverse" :class="contentClass">
            <slot />
        </div>

        <!-- Loading indicator -->
        <div
            v-if="!props.loading && props.hasMore"
            ref="loadingRef"
            class="absolute bottom-0 z-[-1] flex h-screen w-full scale-y-[-1] items-center justify-center"
        >
            <div class="flex items-center justify-center gap-1 opacity-0">
                <UIcon
                    name="i-ph-spinner-gap-bold"
                    size="16"
                    class="text-secondary-foreground animate-spin"
                />
                <span class="text-secondary-foreground ml-2 text-sm">
                    {{ props.loadingText }}
                </span>
            </div>
        </div>
    </div>
</template>
