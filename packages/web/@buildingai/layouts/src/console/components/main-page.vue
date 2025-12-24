<script setup lang="ts">
defineProps<{ layout: "mixture" | "sidebar" }>();
</script>

<template>
    <main
        class="w-full flex-1 overflow-auto px-4 lg:px-6"
        :class="layout === 'sidebar' ? 'pt-0' : 'my-4 lg:my-6'"
    >
        <NuxtPage />
    </main>
</template>
