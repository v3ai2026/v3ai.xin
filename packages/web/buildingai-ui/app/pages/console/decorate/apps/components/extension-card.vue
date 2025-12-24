<script lang="ts" setup>
import type { ExtensionFormData } from "@buildingai/service/consoleapi/extensions";

const props = defineProps<{
    extension: ExtensionFormData;
}>();

const emits = defineEmits<{
    (e: "select-extension", extension: ExtensionFormData): void;
}>();

const selectExtension = () => {
    emits("select-extension", props.extension);
};
</script>

<template>
    <div class="cursor-pointer" @click.stop="selectExtension">
        <UCard :ui="{ body: 'flex flex-col justify-between gap-2' }">
            <div class="flex flex-row justify-between gap-2">
                <div class="h-18">
                    <h3 class="text-lg font-semibold">
                        {{ props.extension.alias || props.extension.name }}
                    </h3>
                    <p class="text-muted-foreground line-clamp-2 text-sm">
                        {{ props.extension.description }}
                    </p>
                </div>
                <div
                    class="border-default bg-muted flex size-18 flex-none items-center justify-center rounded-lg border"
                >
                    <UAvatar
                        :src="extension.icon"
                        :alt="extension.name"
                        icon="i-lucide-puzzle"
                        :ui="{
                            root: `size-full rounded-md ${extension.icon ? '' : 'bg-primary'}`,
                            icon: 'size-7 text-white',
                        }"
                    >
                    </UAvatar>
                </div>
            </div>
            <div>
                <UBadge
                    :color="props.extension.status === 1 ? 'success' : 'neutral'"
                    variant="soft"
                    >{{ props.extension.status === 1 ? "启用" : "禁用" }}</UBadge
                >
            </div>
        </UCard>
    </div>
</template>
