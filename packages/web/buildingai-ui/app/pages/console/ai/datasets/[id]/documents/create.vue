<script setup lang="ts">
import type { Dataset } from "@buildingai/service/consoleapi/ai-datasets";

const CreateDataset = defineAsyncComponent(() => import("../../components/create/index.vue"));

const datasetId = computed(() => (useRoute().params as Record<string, string>).id);
const datasetDetail = inject<Dataset>("datasets");

definePageMeta({ layout: "full-screen" });
</script>

<template>
    <CreateDataset class="h-full w-full" :id="datasetId" :datasetsDetail="datasetDetail" />
</template>
