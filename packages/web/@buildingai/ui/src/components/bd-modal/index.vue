<script setup lang="ts">
import type { BdModalEmits, BdModalProps } from "./types";

/**
 * BdModal component
 *
 * Based on Nuxt UI's Modal component, providing more convenient features and custom options
 *
 * @example
 * <BdModal v-model:open="isOpen" title="My title">
 *   <template #trigger>
 *     <UButton>Open modal</UButton>
 *   </template>
 *   <div>Modal content</div>
 *   <template #footer>
 *     <div class="flex justify-end gap-2">
 *       <UButton @click="isOpen = false">Cancel</UButton>
 *       <UButton color="primary" @click="isOpen = false">Confirm</UButton>
 *     </div>
 *   </template>
 * </BdModal>
 */
const props = withDefaults(defineProps<BdModalProps>(), {
    title: "Title",
    transition: true,
    fullscreen: false,
    dismissible: false,
    overlay: true,
    portal: true,
    disabledClose: false,
    // Support both APIs: v-model and v-model:open (Nuxt UI preferred)
    open: false,
    modelValue: false,
    width: "sm",
    contentId: "",
    position: "center",
    closeIcon: "tabler:x",
    closeOnEsc: true,
    showFooter: false,
    ui: () => ({}),
});

const emit = defineEmits<BdModalEmits>();

// Strongly typed model: prefer `open`, fallback to `modelValue`
const isOpen = computed<boolean>({
    get: () => (props.open ?? props.modelValue ?? false) as boolean,
    set: (value: boolean) => {
        emit("update:open", value);
        emit("update:modelValue", value);
    },
});

/** Close modal */
function close() {
    if (props.disabledClose) return;
    isOpen.value = false;
    emit("close");
}

/** Confirm button click event */
function confirm() {
    isOpen.value = false;
    emit("confirm");
}

/** Open modal */
function open() {
    isOpen.value = true;
    console.log("open", isOpen.value);
    emit("open");
}

/** Listen to modal open status */
watch(isOpen, (val: boolean) => {
    if (val) {
        emit("open");
    }
});

/** Shortcut support */
defineShortcuts({
    // Use Alt+O to switch modal status
    "alt+o": () => {
        isOpen.value = !isOpen.value;
    },
    // Use ESC to close modal
    escape: () => {
        if (isOpen.value && props.closeOnEsc && !props.disabledClose) {
            close();
        }
    },
});

// Define all properties received by the component, passed to via v-bind="$attrs"
defineOptions({ inheritAttrs: false });

// Expose component methods
defineExpose({ close, open });
</script>

<template>
    <div>
        <div v-if="$slots.trigger" class="cursor-pointer" @click="open">
            <slot name="trigger" />
        </div>

        <!-- Modal component -->
        <UModal
            v-model:open="isOpen"
            v-bind="$attrs"
            :ui="ui"
            :portal="portal"
            :fullscreen="fullscreen"
            :overlay="overlay"
            :transition="transition"
            :dismissible="dismissible"
            @close="
                () => {
                    isOpen = false;
                    emit('close');
                }
            "
        >
            <!-- Modal content -->
            <template #content>
                <div
                    :id="contentId"
                    class="relative flex flex-col gap-4 overflow-hidden p-4 sm:p-6"
                >
                    <!-- Modal header -->
                    <div class="pr- flex items-center justify-between">
                        <slot name="title">
                            <div>
                                <h2 class="text-lg font-medium md:text-xl">
                                    {{ title }}
                                </h2>
                                <p v-if="description" class="text-muted-foreground mt-1 text-sm">
                                    {{ description }}
                                </p>
                            </div>
                        </slot>
                        <UButton
                            v-if="!disabledClose"
                            class="absolute top-4 right-4"
                            :icon="closeIcon"
                            color="neutral"
                            size="sm"
                            variant="ghost"
                            aria-label="Close modal"
                            @click="close"
                        />
                    </div>
                    <div class="flex-1 overflow-hidden overflow-y-auto">
                        <slot />
                    </div>
                    <!-- Modal footer -->
                    <template v-if="showFooter || $slots.footer">
                        <slot name="footer">
                            <div class="flex justify-end gap-2">
                                <UButton color="neutral" variant="soft" size="lg" @click="close">
                                    {{ $t("common.cancel") }}
                                </UButton>
                                <UButton color="primary" size="lg" @click="confirm">
                                    {{ $t("common.confirm") }}
                                </UButton>
                            </div>
                        </slot>
                    </template>
                </div>
            </template>
        </UModal>
    </div>
</template>
