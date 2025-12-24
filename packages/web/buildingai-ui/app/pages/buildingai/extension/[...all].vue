<script setup lang="ts">
definePageMeta({ auth: true });

const route = useRoute();

const isConsoleRoute = computed(() => route.path.includes("/console"));

const extensionId = computed(() => {
    if (isConsoleRoute.value) return "";
    return route.fullPath.match(/\/buildingai\/extension\/([^/]+)/)?.[1] || "";
});

const extensionPath = computed(() => {
    const all = route.params.all;
    return Array.isArray(all) && all.length > 1 ? all.slice(1).join("/") : "";
});

const iframeUrl = computed(() => {
    const base = `/extension/${extensionId.value}/`;
    return extensionPath.value ? `${base}${extensionPath.value}` : base;
});

const iframeRef = ref<HTMLIFrameElement | null>(null);
const isUpdatingFromRoute = ref(false);
const isUpdatingFromIframe = ref(false);

const buildRoutePath = (path: string) => {
    return path
        ? `/buildingai/extension/${extensionId.value}/${path}`
        : `/buildingai/extension/${extensionId.value}`;
};

const updateUrl = (newRoutePath: string) => {
    if (route.path === newRoutePath) return;
    isUpdatingFromIframe.value = true;
    window.history.replaceState({ ...window.history.state }, "", newRoutePath);
    nextTick(() => {
        isUpdatingFromIframe.value = false;
    });
};

const syncIframeUrlToRoute = () => {
    if (
        isConsoleRoute.value ||
        !iframeRef.value?.contentWindow ||
        isUpdatingFromRoute.value ||
        isUpdatingFromIframe.value
    ) {
        return;
    }

    try {
        const { pathname, search, hash } = iframeRef.value.contentWindow.location;
        const match = (pathname + search + hash).match(/^\/extension\/[^/]+\/(.*)$/);
        updateUrl(buildRoutePath(match?.[1] || ""));
    } catch {
        // Cross-origin
    }
};

watch(
    () => extensionPath.value,
    (newPath) => {
        if (isConsoleRoute.value || !iframeRef.value || isUpdatingFromIframe.value) return;

        const targetUrl = newPath
            ? `/extension/${extensionId.value}/${newPath}`
            : `/extension/${extensionId.value}/`;

        if (iframeRef.value.src.endsWith(targetUrl)) return;

        isUpdatingFromRoute.value = true;
        iframeRef.value.src = targetUrl;
        nextTick(() => {
            isUpdatingFromRoute.value = false;
        });
    },
);

onMounted(() => {
    const handleMessage = (event: MessageEvent) => {
        const { type, path } = event.data || {};
        if (type !== "extension-navigation" || path.startsWith("console")) return;
        updateUrl(buildRoutePath(path));
    };

    window.addEventListener("message", handleMessage);
    onUnmounted(() => window.removeEventListener("message", handleMessage));
});

useHead({
    title: `Extension: ${extensionId.value}`,
    meta: [{ name: "description", content: `Extension frontend: ${extensionId.value}` }],
});
</script>

<template>
    <iframe
        v-if="!isConsoleRoute"
        ref="iframeRef"
        :src="iframeUrl"
        class="h-full w-full border-0"
        :title="`Extension Frontend: ${extensionId}`"
        @load="() => nextTick(syncIframeUrlToRoute)"
    />
    <NuxtPage v-else />
</template>
