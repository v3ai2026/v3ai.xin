<script lang="ts" setup>
/**
 * 价格计划组件属性编辑器
 * @description 用于编辑价格计划组件的属性，包括基本信息、价格设置、功能列表、按钮等配置
 */

import { useVModel } from "@vueuse/core";

import WidgetsBaseProperty from "../../base/widgets-base-property.vue";
import type { Props } from "./config";

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

// 新增功能项
const addFeature = () => {
    model.value.features.push(t("console-widgets.labels.newFeature"));
};

// 删除功能项
const removeFeature = (index: number) => {
    model.value.features.splice(index, 1);
};
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    { label: t('console-widgets.sections.basic'), value: 'basic', slot: 'basic' },
                    {
                        label: t('console-widgets.sections.pricing'),
                        value: 'pricing',
                        slot: 'pricing',
                    },
                    {
                        label: t('console-widgets.sections.features'),
                        value: 'features',
                        slot: 'features',
                    },
                    {
                        label: t('console-widgets.sections.button'),
                        value: 'button',
                        slot: 'button',
                    },
                    { label: t('console-widgets.sections.badge'), value: 'badge', slot: 'badge' },
                    {
                        label: t('console-widgets.sections.appearance'),
                        value: 'appearance',
                        slot: 'appearance',
                    },
                ]"
                :default-value="['basic', 'pricing', 'features', 'button', 'badge', 'appearance']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #basic>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.planName')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput
                                v-model="model.planName"
                                :placeholder="t('console-widgets.pricingPlans.planName')"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.planDescription')"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                            }"
                        >
                            <UTextarea
                                v-model="model.planDescription"
                                :placeholder="t('console-widgets.pricingPlans.planDescription')"
                                :rows="3"
                                size="md"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #pricing>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.currency')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput v-model="model.currencySymbol" placeholder="$" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.currentPrice')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput
                                v-model.number="model.currentPrice"
                                type="number"
                                placeholder="199"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.originalPrice')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput
                                v-model.number="model.originalPrice"
                                type="number"
                                placeholder="249"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.period')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput v-model="model.pricePeriod" placeholder="/month" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #features>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <div class="flex items-center justify-between">
                            <span class="text-muted text-sm">{{
                                t("console-widgets.sections.features")
                            }}</span>
                            <UButton size="xs" variant="outline" @click="addFeature">
                                <UIcon name="i-heroicons-plus" class="h-3 w-3" />
                            </UButton>
                        </div>

                        <div class="space-y-2">
                            <div
                                v-for="(feature, index) in model.features"
                                :key="index"
                                class="flex items-center gap-2"
                            >
                                <UInput
                                    v-model="model.features[index]"
                                    :placeholder="
                                        t('console-widgets.placeholders.enterFeatureDescription')
                                    "
                                    size="sm"
                                    class="flex-1"
                                />
                                <UButton
                                    size="xs"
                                    variant="outline"
                                    color="error"
                                    @click="removeFeature(index)"
                                >
                                    <UIcon name="i-heroicons-trash" class="h-3 w-3" />
                                </UButton>
                            </div>
                        </div>
                    </div>
                </template>

                <template #button>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.buttonText')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput v-model="model.buttonText" placeholder="Buy now" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.options.variants.link')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <LinkPicker v-model="model.to" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.button.color')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <USelect
                                v-model="model.buttonColor"
                                :items="buttonColorOptions"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.button.variant')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <USelect
                                v-model="model.buttonVariant"
                                :items="buttonVariantOptions"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #badge>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.showBadge')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showPopularBadge" size="md" />
                        </UFormField>

                        <template v-if="model.showPopularBadge">
                            <UFormField
                                size="xs"
                                :label="t('console-widgets.pricingPlans.labelText')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <UInput
                                    v-model="model.popularBadgeText"
                                    placeholder="Most popular"
                                    size="md"
                                />
                            </UFormField>

                            <UFormField
                                size="xs"
                                :label="t('console-widgets.pricingPlans.labelColor')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <USelect
                                    v-model="model.badgeColor"
                                    :items="badgeColorOptions"
                                    size="md"
                                    :ui="{ base: 'w-full' }"
                                />
                            </UFormField>

                            <UFormField
                                size="xs"
                                :label="t('console-widgets.pricingPlans.labelVariant')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <USelect
                                    v-model="model.badgeVariant"
                                    :items="badgeVariantOptions"
                                    size="md"
                                    :ui="{ base: 'w-full' }"
                                />
                            </UFormField>
                        </template>
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
