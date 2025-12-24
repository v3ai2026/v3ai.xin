<script setup lang="ts">
import type { FinancialCenterInfo } from "@buildingai/service/consoleapi/financial-center";
import { apiGetFinancialCenterInfo } from "@buildingai/service/consoleapi/financial-center";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const financialCenterInfo = shallowRef<FinancialCenterInfo | null>(null);

onMounted(async () => {
    const res = await apiGetFinancialCenterInfo();
    financialCenterInfo.value = res;
});
</script>

<template>
    <div class="p-2">
        <!-- 经营概况 -->
        <div class="mb-6">
            <h3 class="mb-2 text-lg font-medium">
                {{ t("financial.financialCenter.finance.title") }}
            </h3>
            <UCard>
                <div class="grid grid-cols-5 text-center">
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.finance.totalIncomeAmount || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.finance.totalIncomeAmount") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.finance.totalIncomeNum || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.finance.totalIncomeNum") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.finance.totalRefundAmount || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.finance.totalRefundAmount") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.finance.totalRefundNum || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.finance.totalRefundNum") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.finance.totalNetIncome || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.finance.totalNetIncome") }}
                        </div>
                    </div>
                </div>
            </UCard>
        </div>
        <!-- 订单概况 -->
        <div class="mb-6">
            <h3 class="mb-2 text-lg font-medium">
                {{ t("financial.financialCenter.recharge.title") }}
            </h3>
            <UCard>
                <div class="grid grid-cols-5 text-center">
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.recharge.rechargeAmount || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.recharge.rechargeAmount") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.recharge.rechargeNum || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.recharge.rechargeNum") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.recharge.rechargeRefundAmount || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.recharge.rechargeRefundAmount") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.recharge.rechargeRefundNum || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.recharge.rechargeRefundNum") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.recharge.rechargeNetIncome || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.recharge.rechargeNetIncome") }}
                        </div>
                    </div>
                </div>
            </UCard>
        </div>
        <div class="mb-6">
            <h3 class="mb-2 text-lg font-medium">
                {{ t("financial.financialCenter.user.title") }}
            </h3>
            <UCard>
                <div class="grid grid-cols-5 text-center">
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">{{ financialCenterInfo?.user.totalUserNum || 0 }}</div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.user.totalUserNum") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.user.totalRechargeNum || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.user.totalRechargeNum") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.user.totalRechargeAmount || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.user.totalRechargeAmount") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.user.totalChatNum || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.user.totalChatNum") }}
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <div class="text-xl">
                            {{ financialCenterInfo?.user.totalPowerSum || 0 }}
                        </div>
                        <div class="text-muted-foreground text-xs">
                            {{ t("financial.financialCenter.user.totalPowerSum") }}
                        </div>
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</template>
