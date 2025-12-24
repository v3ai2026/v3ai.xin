<script setup lang="ts">
import type { PayconfigTableData } from "@buildingai/service/consoleapi/payconfig";
import { useI18n } from "vue-i18n";

const props = defineProps<{ payconfig: PayconfigTableData }>();
const emits = defineEmits<{
    (e: "update:isEnable", value: boolean): void;
}>();
const router = useRouter();
const { t } = useI18n();

/** 获取下拉菜单项 */
const dropdownActions = computed(() => {
    const items = [
        {
            label: t("console-common.edit"),
            icon: "i-lucide-edit",
            onSelect: () =>
                router.push({
                    path: useRoutePath("system-payconfig:update"),
                    query: {
                        id: props.payconfig.id,
                    },
                }),
        },
    ];
    return items;
});

const isEnable = computed({
    get: () => (props.payconfig.isEnable ? true : false),
    set: (newVal) => {
        emits("update:isEnable", newVal);
    },
});
</script>

<template>
    <BdCard show-actions :actions="dropdownActions">
        <!-- 图标 -->
        <template #icon="{ groupHoverClass, selectedClass }">
            <UAvatar
                :src="payconfig.logo"
                alt="微信支付"
                size="3xl"
                :ui="{ root: 'rounded-lg' }"
                :class="[groupHoverClass, selectedClass]"
            />
        </template>
        <!-- 标题 -->
        <template #title>
            <h3 class="text-secondary-foreground flex items-center text-base font-semibold">
                <UTooltip :text="t('payment-config.wxPay')" :delay="0">
                    <span class="line-clamp-1"> {{ payconfig.name }} </span>
                </UTooltip>
                <span class="text-muted-foreground text-sm">({{ t("payment-config.wxPay") }})</span>
                <div class="ml-auto flex items-center gap-2">
                    <USwitch v-model="isEnable" size="sm" class="mb-1" />
                    <!-- <span class="text-muted-foreground text-sm">{{
                        payconfig.isEnable
                            ? t("payment-config.enable")
                            : t("payment-config.disabled")
                    }}</span> -->
                </div>
            </h3>
        </template>
    </BdCard>
</template>
