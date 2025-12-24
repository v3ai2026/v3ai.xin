<script setup lang="ts">
const PayConfigForm = defineAsyncComponent(() => import("./components/form.vue"));

const router = useRouter();
</script>

<template>
    <div class="user-edit-container">
        <div
            class="bg-background sticky top-0 z-10 mb-4 flex w-full items-center justify-baseline pb-2"
        >
            <UButton color="neutral" variant="soft" @click="router.back()">
                <UIcon name="i-lucide-arrow-left" class="size-5 cursor-pointer" />
                <span class="text-base font-medium">{{ $t("console-common.back") }}</span>
            </UButton>

            <h1 class="ml-4 text-xl font-bold">{{ $t("payment-config.wxTitle") }}</h1>
        </div>
        <PayConfigForm />
    </div>
</template>
