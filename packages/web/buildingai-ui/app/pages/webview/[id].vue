<script setup lang="ts">
definePageMeta({ auth: false });

const { params: URLQueryParams } = useRoute();
const webviewId = URLQueryParams.id as string;

const originalUrl = computed(() => {
    try {
        return decodeURIComponent(webviewId);
    } catch {
        return webviewId;
    }
});

useHead({
    title: `Webview: ${originalUrl.value}`,
    meta: [
        {
            name: "description",
            content: `Webview: ${originalUrl.value}`,
        },
    ],
});
</script>

<template>
    <iframe
        :src="originalUrl"
        class="h-full w-full border-0"
        :title="originalUrl"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
    />
</template>
