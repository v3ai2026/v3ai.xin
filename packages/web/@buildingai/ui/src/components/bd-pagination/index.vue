<script lang="ts" setup>
import type { BdPaginationEmits, BdPaginationProps } from "./types";
const props = withDefaults(defineProps<BdPaginationProps>(), {
    pageSizes: () => [5, 10, 20, 50],
});

const emit = defineEmits<BdPaginationEmits>();

function onPageChange(value: number) {
    emit("update:page", value);
    emit("change");
}
</script>

<template>
    <UPagination
        :model-page="props.page"
        :itemsPerPage="size"
        :max="5"
        :total="total"
        size="lg"
        variant="soft"
        :ui="{
            root: 'record-nth-child-2 record-nth-last-child-2',
        }"
        :prev-button="{
            icon: 'tabler:chevron-left',
        }"
        :next-button="{
            icon: 'tabler:chevron-right',
        }"
        :first-button="{
            icon: 'tabler:chevron-left-pipe',
            color: 'gray',
        }"
        :last-button="{
            icon: 'tabler:chevron-right-pipe',
            trailing: true,
            color: 'gray',
        }"
        show-first
        show-last
        @update:page="onPageChange"
    />
</template>

<style lang="scss" scoped>
.record-nth-child-2:nth-child(2) {
    border-radius: 0.375rem;
}

@media (min-width: 640px) {
    .record-nth-child-2:nth-child(2) {
        border-radius: 0;
    }
}

.record-nth-last-child-2:nth-last-child(2) {
    border-radius: 0.375rem 0 0 0;
}

@media (min-width: 640px) {
    .record-nth-last-child-2:nth-last-child(2) {
        border-radius: 0;
    }
}
</style>
