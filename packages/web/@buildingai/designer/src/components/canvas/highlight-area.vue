<script setup lang="ts">
interface HighlightArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

defineProps<{
    area: HighlightArea | null;
    hasCollision: boolean;
}>();
</script>

<template>
    <div class="pointer-events-none absolute inset-0 z-[100]">
        <!-- 高亮区域 -->
        <div
            v-if="area"
            class="bg-opacity-10 absolute border will-change-transform"
            :class="hasCollision ? 'border-red-500 bg-red-100' : 'border-primary'"
            :style="{
                left: `${area.x}px`,
                top: `${area.y}px`,
                width: `${area.width}px`,
                height: `${area.height}px`,
            }"
        />
    </div>
</template>
