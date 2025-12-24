<script setup lang="ts">
const WebDesigner = defineAsyncComponent(() => import("@buildingai/designer/web-designer.vue"));

definePageMeta({ layout: "design" });
</script>

<template>
    <WebDesigner :design-id="''" terminal="web" />
</template>
