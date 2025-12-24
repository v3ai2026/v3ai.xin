<script setup lang="ts">
const props = defineProps<{
    htmlContent: string | null;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const iframeRefs = useTemplateRef<HTMLIFrameElement>("iframeRefs");
const iframeTitle = shallowRef<string>("HTML Preview");
const toggleIframe = shallowRef(true);

const extractTitle = (html: string): string => {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match?.[1]?.trim() || "HTML Preview" : "HTML Preview";
};

const sendMessageHtmlCode = () => {
    const html = props.htmlContent;
    const contentWindow = iframeRefs.value?.contentWindow;
    if (html && contentWindow) {
        contentWindow.postMessage({ BuildingAICode: html }, location.origin);
        iframeTitle.value = extractTitle(html);
    }
};

const handler = (e: MessageEvent) => {
    if (e.source !== iframeRefs.value?.contentWindow) {
        return;
    }

    if (e.origin !== location.origin) {
        return;
    }

    if (e.data?.iframeLoaded) {
        sendMessageHtmlCode();
        return;
    }

    if (e.data?.title) {
        iframeTitle.value = e.data.title;
    }
};

onMounted(() => window.addEventListener("message", handler));
onUnmounted(() => window.removeEventListener("message", handler));

watch(
    () => props.htmlContent,
    async () => {
        sendMessageHtmlCode();
        toggleIframe.value = false;
        await nextTick();
        toggleIframe.value = true;
    },
);
</script>

<template>
    <div v-if="htmlContent" class="flex h-full w-full flex-col">
        <div class="flex items-center justify-between px-4 py-3">
            <div class="flex min-w-0 flex-1 items-center gap-3">
                <div class="flex size-10 items-center justify-center rounded-lg p-2 shadow-md">
                    <UIcon name="i-lucide-code" class="size-6 flex-none" />
                </div>
                <div class="min-w-0 flex-1">
                    <h3 class="text-foreground truncate text-sm font-semibold">
                        {{ iframeTitle }}
                    </h3>
                    <p class="text-muted-foreground truncate text-xs">
                        {{ $t("common.preview") }}
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-1">
                <UButton
                    icon="i-lucide-x"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="emit('close')"
                />
            </div>
        </div>

        <div class="flex-1 overflow-auto">
            <iframe
                v-if="toggleIframe"
                ref="iframeRefs"
                src="/runchat.html"
                class="h-full w-full border-0"
            />
        </div>
    </div>
</template>
