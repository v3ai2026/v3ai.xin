<script setup lang="ts">
const props = defineProps<{
    modelValue: string;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
}>();

const avatar = useVModel(props, "modelValue", emit);
const showAvatar = shallowRef<boolean>(!!avatar.value);
</script>

<template>
    <div class="bg-muted rounded-lg p-3">
        <div class="flex items-center justify-between gap-2">
            <div class="flex flex-col gap-1">
                <span class="text-foreground text-sm font-medium">
                    {{ $t("ai-agent.backend.configuration.chatAvatar") }}
                </span>
                <span class="text-muted-foreground text-xs">
                    {{ $t("ai-agent.backend.configuration.chatAvatarDesc") }}
                </span>
            </div>
            <USwitch v-model="showAvatar" />
        </div>
        <div class="mt-4" v-if="showAvatar">
            <BdUploader
                v-model="avatar"
                class="h-20 w-20"
                text=" "
                icon="i-lucide-upload"
                accept=".jpg,.png,.jpeg,.gif,.webp"
                :maxCount="1"
                :single="true"
                :multiple="false"
            />
        </div>
    </div>
</template>
