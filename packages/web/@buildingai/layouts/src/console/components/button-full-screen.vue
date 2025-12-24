<script setup lang="ts">
import { useFullscreen } from "@vueuse/core";

const { toggle: toggleFullscreen, isFullscreen } = useFullscreen();
</script>

<template>
    <UButton
        variant="ghost"
        color="neutral"
        size="md"
        :icon="isFullscreen ? 'i-lucide-minimize' : 'i-lucide-maximize'"
        @click="toggleFullscreen"
    >
    </UButton>
</template>
