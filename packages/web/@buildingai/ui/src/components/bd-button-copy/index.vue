<script setup lang="ts">
import { useClipboard } from "@vueuse/core";

import type { BdButtonCopyProps } from "./types";

// Define all properties received by the component, passed to UButton via v-bind="$attrs"
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<BdButtonCopyProps>(), {
    copiedText: "",
    defaultText: "",
    copiedIcon: "i-lucide-copy-check",
    defaultIcon: "i-lucide-copy",
});

const { t } = useI18n();
const { copy, copied } = useClipboard();

async function handleCopy() {
    await copy(props.content);
    useMessage().success(props.copiedText || props.defaultText || t("common.chat.messages.copied"));
}
</script>

<template>
    <UTooltip
        :text="copied ? t('common.chat.messages.copied') : t('common.chat.messages.copy')"
        :delay="100"
    >
        <UButton
            v-bind="$attrs"
            :icon="copied ? copiedIcon : defaultIcon"
            class="p-2"
            @click="handleCopy"
        >
            <slot :copied="copied"> </slot>
        </UButton>
    </UTooltip>
</template>
