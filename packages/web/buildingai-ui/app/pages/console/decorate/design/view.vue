<script setup lang="ts">
/**
 * 网页设计预览页面
 * @description 简单预览网页设计的最终效果
 */
const WebPreview = defineAsyncComponent(() => import("@buildingai/designer/web-preview.vue"));

// 设置页面元信息
definePageMeta({
    layout: "full-screen",
    title: "设计预览",
});

const { query: URLQueryParams } = useRoute();
const designId = URLQueryParams.id as string;
</script>

<template>
    <WebPreview :design-id="designId" terminal="web" />
</template>

<style scoped>
.preview-container {
    margin: 0;
    padding: 0;
}

.canvas-container {
    margin: 0;
    padding: 0;
}

.design-component {
    transition: opacity 0.2s ease-in-out;
}
</style>
