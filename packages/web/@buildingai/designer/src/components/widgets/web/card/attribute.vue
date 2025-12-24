<script lang="ts" setup>
/**
 * 卡片组件属性编辑器
 * @description 用于编辑卡片组件的属性，包括内容、图片、按钮、外观等设置
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
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    {
                        label: t('console-widgets.sections.content'),
                        value: 'content',
                        slot: 'content',
                    },
                    { label: t('console-widgets.sections.image'), value: 'image', slot: 'image' },
                    {
                        label: t('console-widgets.sections.button'),
                        value: 'button',
                        slot: 'button',
                    },
                    {
                        label: t('console-widgets.sections.appearance'),
                        value: 'appearance',
                        slot: 'appearance',
                    },
                    { label: t('console-widgets.sections.link'), value: 'link', slot: 'link' },
                ]"
                :default-value="['content', 'image', 'button', 'appearance', 'link']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.title')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput
                                v-model="model.title"
                                :placeholder="t('console-widgets.placeholders.cardTitle')"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.subtitle')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput
                                v-model="model.subtitle"
                                :placeholder="t('console-widgets.placeholders.cardSubtitle')"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.content')"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                            }"
                        >
                            <UTextarea
                                v-model="model.content"
                                :placeholder="t('console-widgets.placeholders.cardContent')"
                                :rows="8"
                                size="md"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #image>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.show')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showImage" size="md" />
                        </UFormField>

                        <template v-if="model.showImage">
                            <UFormField
                                size="xs"
                                :label="t('console-widgets.labels.image')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160 flex justify-end',
                                }"
                            >
                                <BdUploader
                                    v-model="model.image"
                                    class="size-20"
                                    icon="i-lucide-upload"
                                    accept=".jpg,.png,.jpeg"
                                    text=" "
                                    :maxCount="1"
                                    :single="true"
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
                                :label="t('console-widgets.common.height')"
                            >
                                <BdSlider
                                    v-model="model.imageHeight"
                                    :min="100"
                                    :max="400"
                                    size="md"
                                />
                            </UFormField>
                        </template>
                    </div>
                </template>

                <template #button>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.show')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showButton" size="md" />
                        </UFormField>

                        <template v-if="model.showButton">
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
                                <UInput
                                    v-model="model.buttonText"
                                    :placeholder="t('console-widgets.pricingPlans.buttonText')"
                                    size="md"
                                />
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
                                <USelectMenu
                                    v-model="model.buttonColor"
                                    :items="buttonColorOptions"
                                    value-key="value"
                                    label-key="label"
                                    :ui="{ base: 'w-full' }"
                                    size="md"
                                />
                            </UFormField>

                            <UFormField
                                size="xs"
                                :label="t('console-widgets.labels.variant')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <USelectMenu
                                    v-model="model.buttonVariant"
                                    :items="buttonVariantOptions"
                                    value-key="value"
                                    label-key="label"
                                    :ui="{ base: 'w-full' }"
                                    size="md"
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
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.shadow"
                                :items="shadowOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
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
                            :label="t('console-widgets.common.width')"
                        >
                            <BdSlider v-model="model.borderWidth" :min="0" :max="10" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.borderColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.borderColor"
                                size="md"
                                :placeholder="t('console-widgets.common.borderColor')"
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
                    </div>
                </template>

                <template #link>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
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
