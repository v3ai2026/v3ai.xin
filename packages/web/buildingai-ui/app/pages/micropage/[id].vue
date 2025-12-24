<script setup lang="ts">
/**
 * 前台微页面预览页面
 * @description 展示微页面的最终效果
 */
import { apiGetWebMicropageDetail } from "@buildingai/service/webapi/decorate";
const WebPreview = defineAsyncComponent(() => import("@buildingai/designer/web-preview.vue"));

// 设置页面元信息
definePageMeta({
    layout: "default",
    title: "页面预览",
    auth: false,
});

const { params: URLQueryParams } = useRoute();
const micropageId = computed(() => (URLQueryParams as Record<string, string>).id);

// 获取微页面详情
const { data: micropage, pending } = await useAsyncData(() =>
    apiGetWebMicropageDetail(micropageId.value as string),
);

// 如果页面不存在，抛出404错误
if (!micropage.value && !pending.value) {
    throw createError({
        statusCode: 404,
        statusMessage: "页面不存在",
        fatal: true,
    });
}

// 动态设置页面标题
if (micropage.value?.name) {
    useHead({
        title: micropage.value.name,
        meta: [
            {
                name: "description",
                content: micropage.value.name,
            },
        ],
    });
}
</script>

<template>
    <WebPreview
        :data="micropage.content"
        :showToolbar="false"
        terminal="web"
        :configs="micropage.configs"
    />
</template>
