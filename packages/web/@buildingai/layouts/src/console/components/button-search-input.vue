<script setup lang="ts">
const controlsStore = useControlsStore();

const openSearchDialog = () => {
    controlsStore.toggleGlobalSearch();
};

defineShortcuts({
    meta_k: openSearchDialog,
});
</script>

<template>
    <UTooltip :text="$t('layouts.search')" :kbds="['meta', 'K']" :delay-duration="0">
        <UButton
            icon="i-heroicons-magnifying-glass-20-solid"
            color="neutral"
            :padded="false"
            variant="outline"
            size="sm"
            :ui="{ base: 'w-full justify-between bg-transparent overflow-hidden flex-none' }"
            @click="openSearchDialog"
        >
            <div class="w-full text-left text-sm">
                <span class="w-0 whitespace-nowrap">{{ $t("layouts.search") }}...</span>
            </div>
            <UKbd>⌘</UKbd>
            <UKbd>K</UKbd>
        </UButton>
    </UTooltip>
</template>
