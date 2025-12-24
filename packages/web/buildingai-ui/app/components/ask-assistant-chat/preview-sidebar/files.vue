<script setup lang="ts">
import { getMediaType, isAudioFile, isVideoFile } from "../../../utils/file";

interface FilePreviewItem {
    name: string;
    url: string;
    type?: string;
    extension?: string;
}

const props = defineProps<{
    file: FilePreviewItem | null;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const fileExtension = computed(() => props.file?.name.split(".").pop()?.toLowerCase() || "");

const isPdf = computed(() => fileExtension.value === "pdf");

const isDocument = computed(() =>
    ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension.value),
);

const isVideo = computed(() => (props.file ? isVideoFile(props.file) : false));

const isAudio = computed(() => (props.file ? isAudioFile(props.file) : false));

const mediaType = computed(() => (props.file ? getMediaType(props.file) : "file"));

const fileIcon = computed(() => {
    if (isPdf.value) return "i-lucide-file-text";
    if (isDocument.value) return "i-lucide-file-box";
    if (isVideo.value) return "i-lucide-video";
    if (isAudio.value) return "i-lucide-music";
    return "i-lucide-file";
});

const typeLabel = computed(() => {
    if (mediaType.value === "video") return "Video";
    if (mediaType.value === "audio") return "Audio";
    return `${fileExtension.value.toUpperCase()} File`;
});

const handleClose = () => emit("close");

const handleDownload = () => {
    if (props.file?.url) window.open(props.file.url, "_blank");
};
</script>

<template>
    <div v-if="file" class="flex h-full w-full flex-col">
        <div class="flex items-center justify-between px-4 py-3">
            <div class="flex min-w-0 flex-1 items-center gap-3">
                <div class="flex size-10 items-center justify-center rounded-lg p-2 shadow-md">
                    <UIcon :name="fileIcon" class="size-6 flex-none" />
                </div>
                <div class="min-w-0 flex-1">
                    <h3 class="text-foreground truncate text-sm font-semibold">
                        {{ file.name }}
                    </h3>
                    <p class="text-muted-foreground truncate text-xs">
                        {{ typeLabel }}
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-1">
                <UButton
                    icon="i-lucide-download"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="handleDownload"
                />
                <UButton
                    icon="i-lucide-x"
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="handleClose"
                />
            </div>
        </div>

        <div class="flex-1 overflow-auto">
            <div v-if="isPdf" class="h-full">
                <iframe :src="file.url" class="h-full w-full border-0" />
            </div>

            <div v-else-if="isVideo" class="flex h-full items-center justify-center p-4">
                <video
                    :src="file.url"
                    controls
                    class="max-h-full max-w-full rounded-lg shadow-lg"
                    preload="metadata"
                >
                    <p class="text-muted-foreground">
                        Your browser doesn't support video playback.
                        <a :href="file.url" target="_blank" class="text-primary hover:underline">
                            Download video file
                        </a>
                    </p>
                </video>
            </div>

            <div
                v-else-if="isAudio"
                class="flex h-full flex-col items-center justify-center gap-6 p-8"
            >
                <div class="bg-primary/10 flex size-24 items-center justify-center rounded-full">
                    <UIcon name="i-lucide-music" class="text-primary size-12" />
                </div>
                <div class="text-center">
                    <p class="text-foreground mb-2 truncate px-4 text-base font-medium break-all">
                        {{ file.name }}
                    </p>
                    <p class="text-muted-foreground mb-4 text-sm">Audio File</p>
                </div>
                <audio :src="file.url" controls class="w-full max-w-md" preload="metadata">
                    <p class="text-muted-foreground">
                        Your browser doesn't support audio playback.
                        <a :href="file.url" target="_blank" class="text-primary hover:underline">
                            Download audio file
                        </a>
                    </p>
                </audio>
            </div>

            <div
                v-else
                class="bg-muted/30 flex h-full flex-col items-center justify-center gap-4 p-8"
            >
                <UIcon
                    :name="isDocument ? 'i-lucide-file-box' : 'i-lucide-file'"
                    class="text-muted-foreground size-20"
                />
                <div class="text-center">
                    <p class="text-foreground mb-2 truncate px-4 text-base font-medium break-all">
                        {{ file.name }}
                    </p>
                    <p class="text-muted-foreground mb-4 truncate text-sm">
                        {{
                            isDocument
                                ? "This file type cannot be previewed directly"
                                : "Preview not available for this file type"
                        }}
                    </p>
                    <UButton icon="i-lucide-download" color="primary" @click="handleDownload">
                        Download File
                    </UButton>
                </div>
            </div>
        </div>
    </div>
</template>
