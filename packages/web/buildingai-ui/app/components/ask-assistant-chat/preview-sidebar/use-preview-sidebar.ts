import { computed, ref } from "vue";

export type PreviewType = "file" | "html";

export interface FilePreviewData {
    name: string;
    url: string;
}

export type PreviewData = FilePreviewData | string;

const RUN_HTML_HOOK = "chat:run:html";

export function usePreviewSidebar() {
    const previewType = ref<PreviewType | null>(null);
    const previewData = ref<PreviewData | null>(null);

    const isPreviewOpen = computed(() => previewType.value !== null);

    const openPreview = (type: PreviewType, data: PreviewData) => {
        previewType.value = type;
        previewData.value = data;
    };

    const closePreview = () => {
        previewType.value = null;
        previewData.value = null;
    };

    const openFilePreview = (file: FilePreviewData) => openPreview("file", file);
    const openHtmlPreview = (htmlContent: string) => openPreview("html", htmlContent);
    const togglePreview = (type: PreviewType, data: PreviewData) =>
        isPreviewOpen.value ? closePreview() : openPreview(type, data);

    useNuxtApp().hook(RUN_HTML_HOOK, openHtmlPreview);

    return {
        previewType,
        previewData,
        isPreviewOpen,
        openFilePreview,
        openHtmlPreview,
        closePreview,
        togglePreview,
    };
}
