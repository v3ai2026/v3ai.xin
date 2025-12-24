<script setup lang="ts">
const emits = defineEmits<{
    close: [value: boolean];
}>();

const { t } = useI18n();
</script>

<template>
    <BdModal
        :ui="{ content: 'max-w-xs overflow-y-auto h-fit' }"
        :title="t('marketing.frontend.recharge.systemTip')"
        @close="emits('close', true)"
    >
        <div class="space-y-4">
            <!-- Success Message -->
            <div class="flex flex-col items-center justify-center gap-2 p-4">
                <div class="flex items-center justify-center gap-2">
                    <UIcon name="tabler:circle-check-filled" class="text-2xl text-green-500" />
                    <h1 class="text-xl font-bold">
                        {{ t("marketing.frontend.recharge.rechargeSuccess") }}
                    </h1>
                </div>
                <p class="text-muted-foreground text-sm">
                    {{ t("marketing.frontend.recharge.rechargeSuccessTip") }}
                </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-2">
                <UButton color="neutral" variant="soft" @click="emits('close', false)">
                    {{ t("marketing.frontend.recharge.continueRecharge") }}
                </UButton>
                <UButton color="primary" type="submit" @click="emits('close', true)">
                    {{ t("marketing.frontend.recharge.viewRecords") }}
                </UButton>
            </div>
        </div>
    </BdModal>
</template>
