<script setup lang="ts">
const WebDesigner = defineAsyncComponent(() => import("@buildingai/designer/web-designer.vue"));

const { query: URLQueryParams } = useRoute();
const designId = ref(URLQueryParams.id as string);

definePageMeta({ layout: "design" });
</script>

<template>
    <WebDesigner :design-id="designId" terminal="web" />
</template>
