<script lang="ts" setup>
import { apiUpdateUserAmount } from "@buildingai/service/consoleapi/user";
import { number, object } from "yup";

const props = defineProps<{
    user: { id: string; power?: number } | null;
}>();

const emits = defineEmits<{
    (e: "close", refresh?: boolean): void;
}>();

const { t } = useI18n();
const toast = useMessage();

const powerAdjustForm = shallowReactive({
    type: 1, // 1: 增加, 0: 减少
    amount: 0,
});

const schema = object({
    amount: number()
        .required(t("user.backend.form.adjustAmountRequired"))
        .min(0, t("user.backend.form.adjustAmountMin")),
});

const adjustedPower = computed(() => {
    if (!props.user) return 0;
    const currentPower = props.user.power || 0;
    const amount = powerAdjustForm.amount || 0;

    if (powerAdjustForm.type === 1) {
        return currentPower + amount;
    } else {
        return Math.max(0, currentPower - amount);
    }
});

const handleConfirmPowerEdit = async () => {
    try {
        if (!props.user?.id) {
            toast.error("用户ID不存在");
            return;
        }

        await apiUpdateUserAmount(props.user.id, powerAdjustForm.amount, powerAdjustForm.type);

        const userStore = useUserStore();

        if (userStore.userInfo?.id === props.user?.id) {
            userStore.getUser();
        }

        toast.success(t("user.backend.form.adjustPowerSuccess"));
        emits("close", true);
    } catch (error) {
        console.error("调整余额失败:", error);
        toast.error(t("user.backend.form.adjustPowerError"));
    }
};
</script>

<template>
    <BdModal
        :title="t('user.backend.form.editPower')"
        :ui="{
            content: 'max-w-sm overflow-y-auto h-fit',
        }"
        @close="emits('close', false)"
    >
        <UForm
            :state="powerAdjustForm"
            :schema="schema"
            class="space-y-4"
            @submit="handleConfirmPowerEdit"
        >
            <UFormField :label="t('user.backend.form.currentPower')" name="currentPower">
                <UInput
                    :model-value="user?.power || 0"
                    size="lg"
                    disabled
                    variant="subtle"
                    class="w-full"
                    type="number"
                />
            </UFormField>

            <UFormField :label="t('user.backend.form.powerAdjust')" name="type">
                <URadioGroup
                    v-model="powerAdjustForm.type"
                    :items="[
                        { label: t('user.backend.form.add'), value: 1 },
                        { label: t('user.backend.form.reduce'), value: 0 },
                    ]"
                    orientation="horizontal"
                    color="primary"
                />
            </UFormField>

            <UFormField :label="t('user.backend.form.adjustAmount')" name="amount">
                <UInput
                    v-model="powerAdjustForm.amount"
                    :placeholder="t('user.backend.form.adjustAmountInput')"
                    size="lg"
                    class="w-full"
                    type="number"
                    min="0"
                />
            </UFormField>

            <UFormField :label="t('user.backend.form.adjustedPower')" name="adjustedPower">
                <UInput
                    :model-value="adjustedPower"
                    size="lg"
                    disabled
                    variant="subtle"
                    class="w-full"
                    type="number"
                />
            </UFormField>

            <div class="flex justify-end gap-2">
                <UButton color="neutral" variant="soft" @click="emits('close', false)">
                    {{ t("console-common.cancel") }}
                </UButton>
                <UButton color="primary" type="submit">
                    {{ t("console-common.confirm") }}
                </UButton>
            </div>
        </UForm>
    </BdModal>
</template>
