<script setup lang="ts">
import FilePreview from "./files.vue";
import HtmlPreview from "./html.vue";

interface FilePreviewData {
    name: string;
    url: string;
}

const props = defineProps<{
    type: "file" | "html";
    data: FilePreviewData | string | null;
}>();

const emit = defineEmits<{
    (e: "close"): void;
}>();

const handleClose = () => emit("close");

defineShortcuts({
    Escape: () => handleClose(),
});
</script>

<template>
    <div v-if="data" class="bg-background border-border flex h-full w-full flex-col border-l">
        <FilePreview
            v-if="props.type === 'file'"
            :file="props.data as FilePreviewData"
            @close="handleClose"
        />
        <HtmlPreview
            v-else-if="props.type === 'html'"
            :html-content="props.data as string"
            @close="handleClose"
        />
    </div>
</template>
