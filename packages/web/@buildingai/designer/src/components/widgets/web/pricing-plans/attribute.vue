<script lang="ts" setup>
/**
 * 价格计划列表组件属性编辑器
 * @description 用于编辑价格计划列表组件的属性，包括标题、计划管理、布局设置等
 */

import { useVModel } from "@vueuse/core";

import WidgetsBaseProperty from "../../base/widgets-base-property.vue";
import type { PricingPlanItem, Props } from "./config";

const props = defineProps<{
    modelValue: Props;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: Props): void;
}>();

const model = useVModel(props, "modelValue", emit);

const { t } = useI18n();

// 阴影选项
const shadowOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.shadows.none"), value: "none" },
    { label: t("console-widgets.options.shadows.sm"), value: "sm" },
    { label: t("console-widgets.options.shadows.md"), value: "md" },
    { label: t("console-widgets.options.shadows.lg"), value: "lg" },
    { label: t("console-widgets.options.shadows.xl"), value: "xl" },
];

// 列数选项
const columnOptions: { label: string; value: number }[] = [
    { label: t("console-widgets.options.columns.one"), value: 1 },
    { label: t("console-widgets.options.columns.two"), value: 2 },
    { label: t("console-widgets.options.columns.three"), value: 3 },
    { label: t("console-widgets.options.columns.four"), value: 4 },
];

// 按钮颜色选项
const buttonColorOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.labels.primary"), value: "primary" },
    { label: t("console-widgets.labels.secondary"), value: "secondary" },
    { label: t("console-widgets.labels.success"), value: "success" },
    { label: t("console-widgets.labels.warning"), value: "warning" },
    { label: t("console-widgets.labels.error"), value: "error" },
    { label: t("console-widgets.labels.neutral"), value: "neutral" },
];

// 按钮变体选项
const buttonVariantOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.variants.solid"), value: "solid" },
    { label: t("console-widgets.options.variants.outline"), value: "outline" },
    { label: t("console-widgets.options.variants.soft"), value: "soft" },
    { label: t("console-widgets.options.variants.ghost"), value: "ghost" },
    { label: t("console-widgets.options.variants.link"), value: "link" },
];

// 标签颜色选项
const badgeColorOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.labels.primary"), value: "primary" },
    { label: t("console-widgets.labels.secondary"), value: "secondary" },
    { label: t("console-widgets.labels.success"), value: "success" },
    { label: t("console-widgets.labels.warning"), value: "warning" },
    { label: t("console-widgets.labels.error"), value: "error" },
    { label: t("console-widgets.labels.neutral"), value: "neutral" },
];

// 标签变体选项
const badgeVariantOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.variants.solid"), value: "solid" },
    { label: t("console-widgets.options.variants.outline"), value: "outline" },
    { label: t("console-widgets.options.variants.soft"), value: "soft" },
    { label: t("console-widgets.options.variants.ghost"), value: "ghost" },
];

// 新增价格计划
const addPlan = () => {
    const newPlan: PricingPlanItem = {
        id: `plan-${Date.now()}`,
        planName: t("console-widgets.labels.newPlan"),
        planDescription: t("console-widgets.labels.description"),
        showPopularBadge: false,
        popularBadgeText: t("console-widgets.labels.recommend"),
        currentPrice: 99,
        originalPrice: 0,
        pricePeriod: "/month",
        currencySymbol: "$",
        features: [t("console-widgets.labels.feature1"), t("console-widgets.labels.feature2")],
        buttonText: t("console-widgets.placeholders.buyNow"),
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        buttonColor: "primary",
        buttonVariant: "solid",
        badgeColor: "primary",
        badgeVariant: "solid",
    };
    model.value.plans.push(newPlan);
};

// 删除价格计划
const removePlan = (index: number) => {
    model.value.plans.splice(index, 1);
};

// 复制价格计划
const duplicatePlan = (index: number) => {
    const originalPlan = model.value.plans[index];
    if (originalPlan) {
        const duplicatedPlan: PricingPlanItem = {
            ...originalPlan,
            id: `plan-${Date.now()}`,
            planName: `${originalPlan.planName} ${t("console-widgets.placeholders.copy")}`,
        };
        model.value.plans.splice(index + 1, 0, duplicatedPlan);
    }
};

// 为计划功能添加新功能
const addFeatureToPlan = (planIndex: number) => {
    const plan = model.value.plans[planIndex];
    if (plan) {
        plan.features.push(t("console-widgets.placeholders.newFeature"));
    }
};

// 删除计划功能
const removeFeatureFromPlan = (planIndex: number, featureIndex: number) => {
    const plan = model.value.plans[planIndex];
    if (plan) {
        plan.features.splice(featureIndex, 1);
    }
};
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    { label: t('console-widgets.sections.basic'), value: 'basic', slot: 'basic' },
                    {
                        label: t('console-widgets.sections.management'),
                        value: 'plans',
                        slot: 'plans',
                    },
                    {
                        label: t('console-widgets.sections.layout'),
                        value: 'layout',
                        slot: 'layout',
                    },
                    {
                        label: t('console-widgets.sections.appearance'),
                        value: 'appearance',
                        slot: 'appearance',
                    },
                ]"
                :default-value="['basic', 'plans']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #basic>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.showTitle')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showTitle" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.showTitle"
                            size="xs"
                            :label="t('console-widgets.pricingPlans.title')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput
                                v-model="model.title"
                                :placeholder="t('console-widgets.placeholders.enterTitle')"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.showDescription')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showDescription" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.showDescription"
                            size="xs"
                            :label="t('console-widgets.pricingPlans.description')"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                            }"
                        >
                            <UTextarea
                                v-model="model.description"
                                :placeholder="t('console-widgets.placeholders.enterDescription')"
                                :rows="3"
                                size="md"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #plans>
                    <div class="w-full space-y-4 px-1 pt-2 pb-4">
                        <div class="flex items-center justify-between">
                            <span class="text-muted text-sm">{{
                                t("console-widgets.labels.addPlan")
                            }}</span>
                            <UButton size="xs" variant="outline" @click="addPlan">
                                <UIcon name="i-heroicons-plus" class="h-3 w-3" />
                                {{ t("console-widgets.labels.addPlan") }}
                            </UButton>
                        </div>

                        <div class="space-y-4">
                            <div
                                v-for="(plan, planIndex) in model.plans"
                                :key="plan.id"
                                class="border-muted space-y-3 rounded-lg border p-3"
                            >
                                <!-- 计划操作栏 -->
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium">{{
                                        plan.planName ||
                                        `${t("console-widgets.components.pricingPlan")} ${planIndex + 1}`
                                    }}</span>
                                    <div class="flex gap-1">
                                        <UButton
                                            size="xs"
                                            variant="outline"
                                            @click="duplicatePlan(planIndex)"
                                            :title="t('console-widgets.labels.copyPlan')"
                                        >
                                            <UIcon
                                                name="i-heroicons-document-duplicate"
                                                class="h-3 w-3"
                                            />
                                        </UButton>
                                        <UButton
                                            size="xs"
                                            variant="outline"
                                            color="error"
                                            @click="removePlan(planIndex)"
                                            :title="t('console-widgets.labels.deletePlan')"
                                        >
                                            <UIcon name="i-heroicons-trash" class="h-3 w-3" />
                                        </UButton>
                                    </div>
                                </div>

                                <!-- 基本信息 -->
                                <div class="space-y-2">
                                    <div
                                        class="border-muted text-accent-foreground border-b pb-1 text-xs font-medium"
                                    >
                                        {{ t("console-widgets.labels.basicInfo") }}
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.pricingPlans.planName')"
                                        >
                                            <UInput
                                                v-model="model.plans[planIndex]!.planName"
                                                :placeholder="
                                                    t('console-widgets.pricingPlans.planName')
                                                "
                                                size="sm"
                                            />
                                        </UFormField>
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.pricingPlans.currentPrice')"
                                        >
                                            <UInput
                                                v-model.number="
                                                    model.plans[planIndex]!.currentPrice
                                                "
                                                type="number"
                                                placeholder="99"
                                                size="sm"
                                            />
                                        </UFormField>
                                    </div>
                                    <UFormField
                                        size="xs"
                                        :label="t('console-widgets.pricingPlans.planDescription')"
                                    >
                                        <UTextarea
                                            v-model="model.plans[planIndex]!.planDescription"
                                            :placeholder="
                                                t('console-widgets.pricingPlans.planDescription')
                                            "
                                            size="sm"
                                            :rows="3"
                                            :ui="{ root: 'w-full' }"
                                        />
                                    </UFormField>
                                </div>

                                <!-- 价格设置 -->
                                <div class="space-y-2">
                                    <div
                                        class="border-muted text-accent-foreground border-b pb-1 text-xs font-medium"
                                    >
                                        {{ t("console-widgets.labels.priceSettings") }}
                                    </div>
                                    <div class="grid grid-cols-3 gap-2">
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.pricingPlans.originalPrice')"
                                        >
                                            <UInput
                                                v-model.number="
                                                    model.plans[planIndex]!.originalPrice
                                                "
                                                type="number"
                                                placeholder="149"
                                                size="sm"
                                            />
                                        </UFormField>
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.pricingPlans.currency')"
                                        >
                                            <UInput
                                                v-model="model.plans[planIndex]!.currencySymbol"
                                                placeholder="$"
                                                size="sm"
                                            />
                                        </UFormField>
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.pricingPlans.period')"
                                        >
                                            <UInput
                                                v-model="model.plans[planIndex]!.pricePeriod"
                                                placeholder="/month"
                                                size="sm"
                                            />
                                        </UFormField>
                                    </div>
                                </div>

                                <!-- 按钮设置 -->
                                <div class="space-y-2">
                                    <div
                                        class="border-muted text-accent-foreground border-b pb-1 text-xs font-medium"
                                    >
                                        {{ t("console-widgets.labels.buttonSettings") }}
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.pricingPlans.buttonText')"
                                        >
                                            <UInput
                                                v-model="model.plans[planIndex]!.buttonText"
                                                :placeholder="
                                                    t('console-widgets.placeholders.buyNow')
                                                "
                                                size="sm"
                                                :ui="{ root: 'w-full' }"
                                            />
                                        </UFormField>
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.button.color')"
                                        >
                                            <USelect
                                                v-model="model.plans[planIndex]!.buttonColor"
                                                :items="buttonColorOptions"
                                                size="sm"
                                                :ui="{ base: 'w-full' }"
                                            />
                                        </UFormField>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.button.variant')"
                                        >
                                            <USelect
                                                v-model="model.plans[planIndex]!.buttonVariant"
                                                :items="buttonVariantOptions"
                                                size="sm"
                                                :ui="{ base: 'w-full' }"
                                            />
                                        </UFormField>
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.options.variants.link')"
                                        >
                                            <LinkPicker
                                                v-model="model.plans[planIndex]!.to"
                                                size="sm"
                                            />
                                        </UFormField>
                                    </div>
                                </div>

                                <!-- 热门标签 -->
                                <div class="space-y-2">
                                    <div
                                        class="border-muted text-accent-foreground border-b pb-1 text-xs font-medium"
                                    >
                                        {{ t("console-widgets.labels.hotBadge") }}
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <USwitch
                                            v-model="model.plans[planIndex]!.showPopularBadge"
                                            size="sm"
                                        />
                                        <span class="text-muted text-xs">{{
                                            t("console-widgets.labels.showHotBadge")
                                        }}</span>
                                    </div>

                                    <template v-if="model.plans[planIndex]!.showPopularBadge">
                                        <div class="grid grid-cols-3 gap-2">
                                            <UFormField
                                                size="xs"
                                                :label="t('console-widgets.pricingPlans.labelText')"
                                            >
                                                <UInput
                                                    v-model="
                                                        model.plans[planIndex]!.popularBadgeText
                                                    "
                                                    placeholder="Most popular"
                                                    size="sm"
                                                />
                                            </UFormField>
                                            <UFormField
                                                size="xs"
                                                :label="
                                                    t('console-widgets.pricingPlans.labelColor')
                                                "
                                            >
                                                <USelect
                                                    v-model="model.plans[planIndex]!.badgeColor"
                                                    :items="badgeColorOptions"
                                                    size="sm"
                                                />
                                            </UFormField>
                                            <UFormField
                                                size="xs"
                                                :label="
                                                    t('console-widgets.pricingPlans.labelVariant')
                                                "
                                            >
                                                <USelect
                                                    v-model="model.plans[planIndex]!.badgeVariant"
                                                    :items="badgeVariantOptions"
                                                    size="sm"
                                                />
                                            </UFormField>
                                        </div>
                                    </template>
                                </div>

                                <!-- 功能列表 -->
                                <div class="space-y-2">
                                    <div
                                        class="border-muted flex items-center justify-between border-b pb-1"
                                    >
                                        <span class="text-accent-foreground text-xs font-medium">{{
                                            t("console-widgets.labels.featureList")
                                        }}</span>
                                        <UButton
                                            size="xs"
                                            variant="outline"
                                            @click="addFeatureToPlan(planIndex)"
                                        >
                                            <UIcon name="i-heroicons-plus" class="h-3 w-3" />
                                        </UButton>
                                    </div>
                                    <div class="space-y-1">
                                        <div
                                            v-for="(feature, featureIndex) in plan.features"
                                            :key="featureIndex"
                                            class="flex items-center gap-1"
                                        >
                                            <UInput
                                                v-model="
                                                    model.plans[planIndex]!.features[featureIndex]
                                                "
                                                :placeholder="
                                                    t('console-widgets.labels.featureDescription')
                                                "
                                                size="xs"
                                                class="flex-1"
                                            />
                                            <UButton
                                                size="xs"
                                                variant="outline"
                                                color="error"
                                                @click="
                                                    removeFeatureFromPlan(planIndex, featureIndex)
                                                "
                                            >
                                                <UIcon name="i-heroicons-trash" class="h-3 w-3" />
                                            </UButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #layout>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.columns')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <USelect
                                v-model="model.columns"
                                :items="columnOptions"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.common.spacing')"
                        >
                            <BdSlider v-model="model.gap" :min="8" :max="48" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #appearance>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.shadow')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <USelect
                                v-model="model.shadow"
                                :items="shadowOptions"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.common.radius')"
                        >
                            <BdSlider v-model="model.borderRadius" :min="0" :max="50" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.common.width')"
                        >
                            <BdSlider v-model="model.borderWidth" :min="0" :max="10" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.borderWidth > 0"
                            size="xs"
                            :label="t('console-widgets.common.borderColor')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'w-[100px] flex justify-end',
                            }"
                        >
                            <BdColorPicker v-model="model.borderColor" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.backgroundColor')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'w-[100px] flex justify-end',
                            }"
                        >
                            <BdColorPicker v-model="model.style.bgColor" />
                        </UFormField>
                    </div>
                </template>
            </UAccordion>
        </template>

        <template #style>
            <UAccordion
                :items="[
                    {
                        label: t('console-widgets.sections.background'),
                        value: 'background',
                        slot: 'background',
                    },
                    {
                        label: t('console-widgets.sections.padding'),
                        value: 'padding',
                        slot: 'padding',
                    },
                    {
                        label: t('console-widgets.sections.radius'),
                        value: 'radius',
                        slot: 'radius',
                    },
                ]"
                :default-value="['background', 'padding', 'radius']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #background>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.rootBgColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.rootBgColor"
                                size="md"
                                :placeholder="t('console-widgets.common.bgColor')"
                                alpha
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.cardBgColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.bgColor"
                                size="md"
                                :placeholder="t('console-widgets.common.bgColor')"
                                alpha
                            />
                        </UFormField>
                    </div>
                </template>

                <template #padding>
                    <div class="space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.common.paddingTop')"
                        >
                            <BdSlider
                                v-model="model.style.paddingTop"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.common.paddingRight')"
                        >
                            <BdSlider
                                v-model="model.style.paddingRight"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.common.paddingBottom')"
                        >
                            <BdSlider
                                v-model="model.style.paddingBottom"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.common.paddingLeft')"
                        >
                            <BdSlider
                                v-model="model.style.paddingLeft"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #radius>
                    <div class="space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.common.radius')"
                        >
                            <BdSlider
                                v-model="model.style.borderRadiusTop"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.common.radius')"
                        >
                            <BdSlider
                                v-model="model.style.borderRadiusBottom"
                                :min="0"
                                :max="50"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>
            </UAccordion>
        </template>
    </WidgetsBaseProperty>
</template>
