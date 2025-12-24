<script lang="ts" setup>
/**
 * 段落组件属性编辑器
 * @description 用于编辑段落组件的属性，包括富文本内容、字体样式、排版和布局设置
 */

import { useVModel } from "@vueuse/core";
import { ref } from "vue";

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
const editorModalOpen = ref<boolean>(false);

// 文本对齐选项
const textAlignOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.textAlign.left"), value: "left" },
    { label: t("console-widgets.options.textAlign.center"), value: "center" },
    { label: t("console-widgets.options.textAlign.right"), value: "right" },
    { label: t("console-widgets.options.textAlign.justify"), value: "justify" },
];

// 字体粗细选项
const fontWeightOptions: { label: string; value: number }[] = [
    { label: t("console-widgets.options.fontWeight.light"), value: 300 },
    { label: t("console-widgets.options.fontWeight.normal"), value: 400 },
    { label: t("console-widgets.options.fontWeight.medium"), value: 500 },
    { label: t("console-widgets.options.fontWeight.semibold"), value: 600 },
    { label: t("console-widgets.options.fontWeight.bold"), value: 700 },
    { label: t("console-widgets.options.fontWeight.extraBold"), value: 800 },
];

// 字体样式选项
const fontStyleOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.fontStyle.normal"), value: "normal" },
    { label: t("console-widgets.options.fontStyle.italic"), value: "italic" },
];

// 文本装饰选项
const textDecorationOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.textDecoration.none"), value: "none" },
    { label: t("console-widgets.options.textDecoration.underline"), value: "underline" },
    { label: t("console-widgets.options.textDecoration.lineThrough"), value: "line-through" },
    { label: t("console-widgets.options.textDecoration.overline"), value: "overline" },
];

// 超出隐藏选项
const overflowOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.labels.show"), value: "visible" },
    { label: t("console-widgets.labels.hide"), value: "hidden" },
    { label: t("console-widgets.options.overflow.ellipsis"), value: "ellipsis" },
];

// 常用字体族选项
const fontFamilyOptions: { label: string; value: string }[] = [
    {
        label: t("console-widgets.options.fontFamily.default"),
        value: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    },
    {
        label: t("console-widgets.options.fontFamily.microsoft"),
        value: "'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif",
    },
    {
        label: t("console-widgets.options.fontFamily.pingfang"),
        value: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
    },
    { label: t("console-widgets.options.fontFamily.simsun"), value: "'SimSun', 'NSimSun', serif" },
    {
        label: t("console-widgets.options.fontFamily.simhei"),
        value: "'SimHei', 'Microsoft YaHei', sans-serif",
    },
    { label: t("console-widgets.options.fontFamily.kaiti"), value: "'KaiTi', 'STKaiti', serif" },
    {
        label: t("console-widgets.options.fontFamily.monospace"),
        value: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
    },
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
                    {
                        label: t('console-widgets.sections.typography'),
                        value: 'typography',
                        slot: 'typography',
                    },
                    {
                        label: t('console-widgets.sections.layout'),
                        value: 'layout',
                        slot: 'layout',
                    },
                    {
                        label: t('console-widgets.sections.advanced'),
                        value: 'advanced',
                        slot: 'advanced',
                    },
                ]"
                :default-value="['content', 'typography', 'layout', 'advanced']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField size="xs" :label="t('console-widgets.text.content')">
                            <UTextarea
                                v-model="model.content"
                                :placeholder="t('console-widgets.text.content')"
                                :rows="10"
                                size="md"
                                :ui="{ base: 'font-mono text-sm', root: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.enableRichText')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.enableRichText" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.enableRichText"
                            size="xs"
                            :label="t('console-widgets.labels.useRichEditor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <BdModal
                                v-model:open="editorModalOpen"
                                :title="t('console-widgets.labels.editRichContent')"
                                dismissible
                                :ui="{ content: 'max-w-4xl' }"
                            >
                                <template #trigger>
                                    <UButton variant="outline" size="md">
                                        {{ t("console-widgets.labels.openRichEditor") }}
                                    </UButton>
                                </template>

                                <div class="min-h-[450px]">
                                    <BdEditor v-model="model.content" />
                                </div>
                            </BdModal>
                        </UFormField>
                    </div>
                </template>

                <template #typography>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.textColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.color"
                                size="md"
                                :placeholder="t('console-widgets.placeholders.selectFontColor')"
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
                            :label="t('console-widgets.common.fontSize')"
                        >
                            <BdSlider v-model="model.fontSize" :min="10" :max="48" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.fontWeight')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.fontWeight"
                                :items="fontWeightOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.fontStyle')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.fontStyle"
                                :items="fontStyleOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.textDecoration')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.textDecoration"
                                :items="textDecorationOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.fontFamily')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.fontFamily"
                                :items="fontFamilyOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #layout>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.textAlign')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.textAlign"
                                :items="textAlignOptions"
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
                            :label="t('console-widgets.common.spacing')"
                        >
                            <BdSlider
                                v-model="model.lineHeight"
                                :min="1"
                                :max="3"
                                :step="0.1"
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
                            :label="t('console-widgets.common.spacing')"
                        >
                            <BdSlider v-model="model.marginBottom" :min="0" :max="50" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.labels.firstLineIndent')"
                        >
                            <BdSlider v-model="model.textIndent" :min="0" :max="100" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #advanced>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.options.sizes.lg')"
                        >
                            <BdSlider v-model="model.maxLines" :min="0" :max="20" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.overflowHandling')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.overflow"
                                :items="overflowOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            />
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
                            :label="t('console-widgets.common.componentBgColor')"
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
