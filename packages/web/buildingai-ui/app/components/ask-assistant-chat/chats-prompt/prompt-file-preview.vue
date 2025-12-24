<script setup lang="ts">
import type { FileItem } from "./use-prompt";

export interface FilePreviewItem {
    name: string;
    url: string;
    /** @deprecated Use mediaType instead */

    /** Media type */
    mediaType?: "image" | "video" | "audio" | "file";
}

const props = defineProps<{
    files: (FileItem | FilePreviewItem)[];
    showActions?: boolean;
}>();

const emit = defineEmits<{
    (e: "remove", file: FileItem | FilePreviewItem): void;
    (e: "view", file: FileItem | FilePreviewItem): void;
    (e: "retry", file: FileItem): void;
}>();

const hasUploadStatus = (file: FileItem | FilePreviewItem): file is FileItem => "status" in file;

/**
 * Get media type of file, compatible with legacy isImage property
 */
const getFileMediaType = (
    file: FileItem | FilePreviewItem,
): "image" | "video" | "audio" | "file" => {
    if ("mediaType" in file && file.mediaType) {
        return file.mediaType;
    }
    // Legacy support for isImage
    if ("isImage" in file && file.isImage) {
        return "image";
    }
    return "file";
};

const handleRemove = (file: FileItem | FilePreviewItem) => emit("remove", file);

const handleRetry = (file: FileItem) => emit("retry", file);

const handleFileClick = (file: FileItem | FilePreviewItem) => {
    const mediaType = getFileMediaType(file);
    if (mediaType === "image") {
        useImagePreview(
            props.files.filter((f) => getFileMediaType(f) === "image").map((item) => item.url),
            props.files.filter((f) => getFileMediaType(f) === "image").indexOf(file),
        );
    } else {
        emit("view", file);
    }
};
</script>

<template>
    <div class="flex flex-wrap gap-2">
        <div v-for="(file, fIndex) in files" :key="fIndex" class="group relative">
            <!-- Image preview -->
            <div v-if="getFileMediaType(file) === 'image'" class="group relative">
                <img
                    :src="file.url"
                    @click="handleFileClick(file)"
                    class="size-12.5 max-h-48 cursor-pointer rounded-lg object-cover"
                />

                <div
                    v-if="hasUploadStatus(file) && file.status === 'uploading'"
                    class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50"
                >
                    <div class="text-center text-white">
                        <div class="text-xs font-medium">{{ Math.round(file.progress) }}%</div>
                    </div>
                </div>

                <div
                    v-if="hasUploadStatus(file) && file.status === 'error'"
                    class="bg-muted/50 absolute inset-0 flex items-center justify-center rounded-lg"
                >
                    <UButton
                        size="xs"
                        color="error"
                        variant="ghost"
                        icon="i-lucide-refresh-cw"
                        @click="handleRetry(file as FileItem)"
                    />
                </div>

                <UBadge
                    v-if="
                        showActions &&
                        (!hasUploadStatus(file) ||
                            file.status === 'success' ||
                            file.status === 'error')
                    "
                    size="xs"
                    icon="i-lucide-x"
                    color="neutral"
                    class="absolute top-1 right-1 rounded-full"
                    @click="handleRemove(file)"
                />
            </div>

            <!-- Video preview -->
            <div v-else-if="getFileMediaType(file) === 'video'" class="group relative">
                <div
                    class="relative h-12.5 w-20 cursor-pointer rounded-lg bg-black"
                    @click="handleFileClick(file)"
                >
                    <video
                        :src="file.url"
                        class="size-full rounded-lg object-cover"
                        preload="metadata"
                    />
                    <div class="absolute inset-0 flex items-center justify-center">
                        <UIcon name="i-lucide-play-circle" class="size-6 text-white opacity-80" />
                    </div>
                </div>

                <div
                    v-if="hasUploadStatus(file) && file.status === 'uploading'"
                    class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50"
                >
                    <div class="text-center text-white">
                        <div class="text-xs font-medium">{{ Math.round(file.progress) }}%</div>
                    </div>
                </div>

                <div
                    v-if="hasUploadStatus(file) && file.status === 'error'"
                    class="bg-muted/50 absolute inset-0 flex items-center justify-center rounded-lg"
                >
                    <UButton
                        size="xs"
                        color="error"
                        variant="ghost"
                        icon="i-lucide-refresh-cw"
                        @click="handleRetry(file as FileItem)"
                    />
                </div>

                <UBadge
                    v-if="
                        showActions &&
                        (!hasUploadStatus(file) ||
                            file.status === 'success' ||
                            file.status === 'error')
                    "
                    size="xs"
                    icon="i-lucide-x"
                    color="neutral"
                    class="absolute top-1 right-1 rounded-full"
                    @click="handleRemove(file)"
                />
            </div>

            <!-- Audio preview -->
            <div v-else-if="getFileMediaType(file) === 'audio'" class="group relative">
                <div
                    class="border-border bg-muted/50 relative flex cursor-pointer items-center gap-2 rounded-lg border p-2 pr-4!"
                    @click="handleFileClick(file)"
                >
                    <div
                        class="border-border flex size-8.5 items-center justify-center rounded-lg border shadow-md"
                    >
                        <UIcon name="i-lucide-audio-lines" class="text-foreground size-4" />
                    </div>

                    <div class="flex flex-col">
                        <UTooltip :text="file.name" :delay-duration="0">
                            <div class="text-foreground max-w-[200px] truncate text-sm font-bold">
                                {{ file.name }}
                            </div>
                        </UTooltip>
                        <audio
                            :src="file.url"
                            :controls="false"
                            class="h-6 w-48"
                            preload="metadata"
                        ></audio>
                    </div>

                    <div
                        v-if="hasUploadStatus(file) && file.status === 'uploading'"
                        class="bg-muted/50 absolute inset-0 flex items-center justify-center rounded-lg"
                    >
                        <div class="text-center">
                            <div class="text-xs font-medium">{{ Math.round(file.progress) }}%</div>
                        </div>
                    </div>

                    <div
                        v-if="hasUploadStatus(file) && file.status === 'error'"
                        class="bg-muted/50 absolute inset-0 flex items-center justify-center rounded-lg"
                    >
                        <UButton
                            size="xs"
                            color="error"
                            variant="ghost"
                            icon="i-lucide-refresh-cw"
                            @click="handleRetry(file as FileItem)"
                        />
                    </div>

                    <UBadge
                        v-if="showActions && (!hasUploadStatus(file) || file.status === 'success')"
                        size="xs"
                        icon="i-lucide-x"
                        color="neutral"
                        class="absolute top-1 right-1 rounded-full"
                        @click="handleRemove(file)"
                    />
                </div>
            </div>

            <div
                v-else
                class="border-border bg-muted/50 relative flex cursor-pointer items-center gap-2 rounded-lg border p-2 pr-4!"
                @click="handleFileClick(file)"
            >
                <div
                    class="border-border flex size-8 items-center justify-center rounded-lg border shadow-md"
                >
                    <UIcon name="i-lucide-file-box" class="text-foreground size-4" />
                </div>

                <UTooltip :text="file.name" :delay-duration="0">
                    <div class="text-foreground me-auto max-w-[250px] truncate text-sm font-bold">
                        {{ file.name }}
                    </div>
                </UTooltip>

                <div
                    v-if="hasUploadStatus(file) && file.status === 'uploading'"
                    class="flex items-center gap-2"
                >
                    <div class="bg-muted h-2 w-16 rounded-full">
                        <div
                            class="bg-primary h-2 rounded-full transition-all duration-300"
                            :style="{ width: `${file.progress}%` }"
                        ></div>
                    </div>
                    <span class="text-muted-foreground w-8 text-xs">
                        {{ Math.round(file.progress) }}%
                    </span>
                </div>

                <div
                    v-if="hasUploadStatus(file) && file.status === 'error'"
                    class="bg-muted/50 absolute inset-0 flex items-center justify-center rounded-lg"
                >
                    <UButton
                        size="xs"
                        color="error"
                        variant="ghost"
                        icon="i-lucide-refresh-cw"
                        @click="handleRetry(file as FileItem)"
                    />
                </div>

                <UBadge
                    v-if="
                        showActions &&
                        (!hasUploadStatus(file) ||
                            file.status === 'success' ||
                            file.status === 'error')
                    "
                    size="xs"
                    icon="i-lucide-x"
                    color="neutral"
                    class="absolute top-1 right-1 rounded-full"
                    @click="handleRemove(file)"
                />
            </div>
        </div>
    </div>
</template>
