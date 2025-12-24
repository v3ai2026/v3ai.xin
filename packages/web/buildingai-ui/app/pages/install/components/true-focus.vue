<script setup lang="ts">
import { motion } from "motion-v";
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from "vue";

interface TrueFocusProps {
    sentence?: string;
    manualMode?: boolean;
    blurAmount?: number;
    borderColor?: string;
    glowColor?: string;
    animationDuration?: number;
    pauseBetweenAnimations?: number;
}

const props = withDefaults(defineProps<TrueFocusProps>(), {
    sentence: "True Focus",
    manualMode: false,
    blurAmount: 5,
    borderColor: "green",
    glowColor: "rgba(0, 255, 0, 0.6)",
    animationDuration: 0.5,
    pauseBetweenAnimations: 1,
});

const words = computed(() => props.sentence.split(" "));
const currentIndex = ref(0);
const lastActiveIndex = ref<number | null>(null);
const containerRef = useTemplateRef<HTMLDivElement>("containerRef");
const wordRefs = ref<HTMLSpanElement[]>([]);
const focusRect = ref({ x: 0, y: 0, width: 0, height: 0 });

let interval: ReturnType<typeof setInterval> | null = null;

watch(
    [currentIndex, () => words.value.length],
    async () => {
        if (currentIndex.value === null || currentIndex.value === -1) return;
        if (!wordRefs.value[currentIndex.value] || !containerRef.value) return;

        await nextTick();

        const parentRect = containerRef.value.getBoundingClientRect();
        const activeRect = wordRefs.value[currentIndex.value]?.getBoundingClientRect();
        if (!activeRect) return;

        focusRect.value = {
            x: activeRect.left - parentRect.left,
            y: activeRect.top - parentRect.top,
            width: activeRect.width,
            height: activeRect.height,
        };
    },
    { immediate: true },
);

const handleMouseEnter = (index: number) => {
    if (props.manualMode) {
        lastActiveIndex.value = index;
        currentIndex.value = index;
    }
};

const handleMouseLeave = () => {
    if (props.manualMode) {
        currentIndex.value = lastActiveIndex.value || 0;
    }
};

const setWordRef = (el: HTMLSpanElement | null, index: number) => {
    if (el) {
        wordRefs.value[index] = el;
    }
};

onMounted(async () => {
    await nextTick();

    if (wordRefs.value[0] && containerRef.value) {
        const parentRect = containerRef.value.getBoundingClientRect();
        const activeRect = wordRefs.value[0].getBoundingClientRect();

        focusRect.value = {
            x: activeRect.left - parentRect.left,
            y: activeRect.top - parentRect.top,
            width: activeRect.width,
            height: activeRect.height,
        };
    }

    watch(
        [
            () => props.manualMode,
            () => props.animationDuration,
            () => props.pauseBetweenAnimations,
            () => words.value,
        ],
        () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }

            if (!props.manualMode) {
                interval = setInterval(
                    () => {
                        currentIndex.value = (currentIndex.value + 1) % words.value.length;
                    },
                    (props.animationDuration + props.pauseBetweenAnimations) * 1000,
                );
            }
        },
        { immediate: true },
    );
});

onUnmounted(() => {
    if (interval) {
        clearInterval(interval);
    }
});
</script>

<template>
    <div class="relative flex flex-wrap items-center justify-center gap-[1em]" ref="containerRef">
        <span
            v-for="(word, index) in words"
            :key="index"
            :ref="(el) => setWordRef(el as HTMLSpanElement, index)"
            class="relative cursor-pointer text-7xl font-black transition-[filter,color] duration-300 ease-in-out"
            :style="{
                filter: index === currentIndex ? 'blur(0px)' : `blur(${blurAmount}px)`,
                '--border-color': borderColor,
                '--glow-color': glowColor,
                transition: `filter ${animationDuration}s ease`,
            }"
            @mouseenter="handleMouseEnter(index)"
            @mouseleave="handleMouseLeave"
        >
            {{ word }}
        </span>

        <motion.div
            class="pointer-events-none absolute top-0 left-0 box-content border-none"
            :animate="{
                x: focusRect.x,
                y: focusRect.y,
                width: focusRect.width,
                height: focusRect.height,
                opacity: currentIndex >= 0 ? 1 : 0,
            }"
            :transition="{
                duration: animationDuration,
            }"
            :style="{
                '--border-color': borderColor,
                '--glow-color': glowColor,
            }"
        >
            <span
                class="absolute top-[-10px] left-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-r-0 border-b-0 border-[var(--border-color,#fff)] [filter:drop-shadow(0_0_4px_var(--border-color,#fff))] transition-none"
            ></span>

            <span
                class="absolute top-[-10px] right-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-b-0 border-l-0 border-[var(--border-color,#fff)] [filter:drop-shadow(0_0_4px_var(--border-color,#fff))] transition-none"
            ></span>

            <span
                class="absolute bottom-[-10px] left-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-t-0 border-r-0 border-[var(--border-color,#fff)] [filter:drop-shadow(0_0_4px_var(--border-color,#fff))] transition-none"
            ></span>

            <span
                class="absolute right-[-10px] bottom-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-t-0 border-l-0 border-[var(--border-color,#fff)] [filter:drop-shadow(0_0_4px_var(--border-color,#fff))] transition-none"
            ></span>
        </motion.div>
    </div>
</template>
