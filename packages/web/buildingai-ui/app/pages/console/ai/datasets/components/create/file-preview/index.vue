<script lang="ts" setup>
import type { FileItem } from "@buildingai/service/models/globals";

import { formatFileSize } from "@//utils/helper";

const emits = defineEmits<{
    (e: "update:fileList", v: FileItem[]): void;
}>();

const props = defineProps<{
    fileList: FileItem[];
}>();

const removeFile = (id?: string) => {
    const next = props.fileList.filter((item) => item.id !== id);
    emits("update:fileList", next);
};
</script>

<template>
    <div class="space-y-3">
        <div
            v-for="file in fileList"
            :key="file.id"
            class="bg-muted flex items-center justify-between rounded-lg p-4"
        >
            <div class="flex min-w-0 flex-1 items-center space-x-3">
                <UIcon name="i-lucide-file" class="text-muted-foreground flex-none text-lg" />
                <div class="min-w-0 flex-1">
                    <p
                        class="truncate text-sm font-medium"
                        :class="{ 'text-error': file.status === 'error' }"
                    >
                        {{ file.file?.name || file.originalName || "未知文件" }}
                    </p>
                    <p class="text-muted-foreground flex gap-2 text-xs">
                        <span>
                            {{ file.extension }}
                        </span>
                        <span>•</span>
                        <span>
                            {{ formatFileSize(file.file?.size || file.size || 0) }}
                        </span>
                    </p>
                    <p v-if="file.status === 'error'" class="text-error text-xs">
                        {{ file.error }}
                    </p>
                </div>
            </div>
            <div class="ml-4 flex cursor-pointer items-center space-x-2">
                <UButton
                    size="xs"
                    variant="ghost"
                    color="error"
                    icon="i-heroicons-trash"
                    @click="removeFile(file.id)"
                />
            </div>
        </div>
    </div>
</template>
