<script setup lang="ts">
const emits = defineEmits<{
    (e: "file-select", file: File): void;
    (e: "url-submit", url: string): void;
}>();

const props = defineProps<{
    disabled?: boolean;
    maxSize?: number;
    accept?: string;
}>();

const controlsStore = useControlsStore();
const fileInputRefs = useTemplateRef<HTMLInputElement>("fileInputRefs");
const remoteUrls = shallowRef<string>("");
const isOpen = shallowRef(false);
const toast = useMessage();
const { t } = useI18n();

const supportedFileTypes = computed(() => {
    if (!controlsStore.selectedModel) {
        return ".pdf,.doc,.docx,.txt,.md";
    }

    const features = controlsStore.selectedModel.features || [];
    const supportedTypes: string[] = [];

    // 始终支持文档类型（因为提示内容说"支持各类文档"）
    const documentTypes = [
        ".pdf",
        ".docx",
        ".txt",
        ".md",
        ".rtf",
        ".csv",
        ".xlsx",
        ".xls",
        ".pptx",
    ];
    supportedTypes.push(...documentTypes);

    // 如果模型支持图片，添加图片类型
    if (features.includes("vision")) {
        supportedTypes.push(".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp");
    }

    // if (features.includes("video")) {
    //     supportedTypes.push(".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm");
    // }

    // 如果模型支持音频，添加音频类型
    if (features.includes("audio")) {
        supportedTypes.push(".mp3", ".wav", ".flac", ".aac", ".ogg", ".m4a");
    }

    return supportedTypes.join(",");
});

const tooltipContent = computed(() => {
    const maxCount = 10;
    const maxSize = props.maxSize || 100;
    const supportsImage = controlsStore.selectedModel?.features?.includes("vision") || false;

    const firstLine = t("common.chat.messages.uploadAttachmentTextOnly");
    const secondLine = t("common.chat.messages.fileUploadLimit", {
        count: maxCount,
        size: maxSize,
    });
    const imageText = supportsImage ? t("common.chat.messages.supportsImage") : "";

    return `${firstLine}\n${secondLine}${imageText}`;
});

const handleClickButton = () => {
    isOpen.value = false;
    fileInputRefs.value?.click();
};

function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
        emits("file-select", file);
    }
    // Clear input value to allow selecting the same file again
    input.value = "";
}

function getFileExtensionFromUrl(url: string): string {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const extension = pathname.split(".").pop()?.toLowerCase() || "";
        return extension ? `.${extension}` : "";
    } catch {
        // If URL parsing fails, try to extract extension from path
        const extension = url.split(".").pop()?.toLowerCase() || "";
        return extension ? `.${extension}` : "";
    }
}

function isFileTypeSupported(fileExtension: string): boolean {
    if (!fileExtension) return false;

    const supportedTypes = supportedFileTypes.value.split(",").map((type) => type.trim());
    return supportedTypes.includes(fileExtension.toLowerCase());
}

function handleUrlSubmit() {
    const url = remoteUrls.value.trim();
    if (!url) return;

    // Validate URL format
    try {
        new URL(url);
    } catch {
        toast.error(t("common.message.invalidUrl"));
        return;
    }

    // Check if file type is supported
    const fileExtension = getFileExtensionFromUrl(url);
    if (!isFileTypeSupported(fileExtension)) {
        toast.error(t("common.message.unsupportedFileType"));
        return;
    }

    emits("url-submit", url);
    remoteUrls.value = "";
    isOpen.value = false;
}
</script>

<template>
    <UPopover v-model:open="isOpen">
        <UTooltip :delay-duration="0" :ui="{ content: 'w-xs h-auto' }">
            <UButton
                @click.stop
                size="lg"
                variant="ghost"
                icon="i-lucide-paperclip"
                class="rounded-full font-bold"
                :disabled="disabled"
            >
            </UButton>
            <template #content>
                <div class="text-background text-xs whitespace-pre-line">
                    {{ tooltipContent }}
                </div>
            </template>
        </UTooltip>
        <template #content>
            <div class="p-3">
                <div>
                    <UInput
                        v-model="remoteUrls"
                        :ui="{ root: 'w-full', trailing: '!pe-0 !pr-1' }"
                        :placeholder="t('common.chat.messages.inputUrlPlaceholder')"
                    >
                        <template #trailing>
                            <UButton size="xs" @click.stop="handleUrlSubmit">
                                {{ t("common.confirm") }}
                            </UButton>
                        </template>
                    </UInput>
                </div>
                <USeparator
                    class="my-2"
                    :ui="{ container: 'text-xs font-normal text-muted-foreground' }"
                    label="OR"
                />
                <div class="flex items-center gap-2">
                    <UButton
                        size="sm"
                        :label="t('common.upload')"
                        :ui="{ base: 'flex-1 justify-center' }"
                        icon="i-lucide-cloud-upload"
                        variant="outline"
                        :disabled="disabled"
                        @click="handleClickButton"
                    />
                </div>
                <input
                    ref="fileInputRefs"
                    type="file"
                    :accept="accept || supportedFileTypes"
                    class="hidden"
                    :disabled="disabled"
                    @change="handleFileSelect"
                />
            </div>
        </template>
    </UPopover>
</template>
