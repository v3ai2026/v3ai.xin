<script lang="ts" setup>
/**
 * 批注组件属性编辑器
 * @description 用于编辑批注组件的属性，包括内容、类型、外观等设置
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

// 批注类型选项
const typeOptions: { label: string; value: string; color: string }[] = [
    { label: t("console-widgets.labels.info"), value: "info", color: "#3b82f6" },
    { label: t("console-widgets.labels.success"), value: "success", color: "#22c55e" },
    { label: t("console-widgets.labels.warning"), value: "warning", color: "#f59e0b" },
    { label: t("console-widgets.labels.error"), value: "error", color: "#ef4444" },
    { label: t("console-widgets.options.annotation.note"), value: "note", color: "#64748b" },
];

// 边框样式选项
const variantOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.variants.solid"), value: "solid" },
    { label: t("console-widgets.options.variants.outline"), value: "outline" },
    { label: t("console-widgets.options.variants.soft"), value: "soft" },
    { label: t("console-widgets.options.variants.subtle"), value: "subtle" },
];

// 阴影选项
const shadowOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.shadows.none"), value: "none" },
    { label: t("console-widgets.options.shadows.sm"), value: "sm" },
    { label: t("console-widgets.options.shadows.md"), value: "md" },
    { label: t("console-widgets.options.shadows.lg"), value: "lg" },
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
                    { label: t('console-widgets.sections.style'), value: 'type', slot: 'type' },
                    { label: t('console-widgets.sections.icons'), value: 'icon', slot: 'icon' },
                    {
                        label: t('console-widgets.sections.appearance'),
                        value: 'appearance',
                        slot: 'appearance',
                    },
                ]"
                :default-value="['content', 'type', 'icon', 'appearance']"
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
                                :placeholder="t('console-widgets.placeholders.enterTitle')"
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
                                :placeholder="t('console-widgets.placeholders.enterContent')"
                                :rows="6"
                                size="md"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.closable')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.closable" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #type>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.annotationType')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <USelectMenu
                                v-model="model.type"
                                :items="typeOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            >
                                <template #leading>
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="h-3 w-3 rounded-full"
                                            :style="{
                                                backgroundColor: typeOptions.find(
                                                    (t) => t.value === model.type,
                                                )?.color,
                                            }"
                                        />
                                        {{ typeOptions.find((t) => t.value === model.type)?.label }}
                                    </div>
                                </template>
                                <template #item="{ item }">
                                    <div class="flex items-center gap-2">
                                        <div
                                            class="h-3 w-3 rounded-full"
                                            :style="{ backgroundColor: item.color }"
                                        />
                                        {{ item.label }}
                                    </div>
                                </template>
                            </USelectMenu>
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.options.variants.outline')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <USelectMenu
                                v-model="model.variant"
                                :items="variantOptions"
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
                            :label="t('console-widgets.common.radius')"
                        >
                            <BdSlider v-model="model.borderRadius" :min="0" :max="20" size="md" />
                        </UFormField>

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
                    </div>
                </template>

                <template #icon>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.showIcon')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showIcon" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.showIcon"
                            size="xs"
                            :label="t('console-widgets.labels.customIcon')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <IconPicker v-model="model.icon" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #appearance>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.backgroundColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.bgColor"
                                size="md"
                                :placeholder="t('console-widgets.placeholders.auto')"
                                alpha
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.borderColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.borderColor"
                                size="md"
                                :placeholder="t('console-widgets.placeholders.auto')"
                                alpha
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.textColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.textColor"
                                size="md"
                                :placeholder="t('console-widgets.placeholders.auto')"
                                alpha
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
