<script lang="ts" setup>
/**
 * 扭曲背景组件属性编辑器
 * @description 用于编辑扭曲背景组件的属性，包括内容、动画效果、光束设置和字体样式
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

// 字体粗细选项
const fontWeightOptions: { label: string; value: number }[] = [
    { label: t("console-widgets.options.fontWeight.normal"), value: 400 },
    { label: t("console-widgets.options.fontWeight.medium"), value: 500 },
    { label: t("console-widgets.options.fontWeight.semibold"), value: 600 },
    { label: t("console-widgets.options.fontWeight.bold"), value: 700 },
    { label: t("console-widgets.options.fontWeight.extraBold"), value: 800 },
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
                        label: t('console-widgets.sections.animation'),
                        value: 'animation',
                        slot: 'animation',
                    },
                    {
                        label: t('console-widgets.sections.effects'),
                        value: 'effects',
                        slot: 'effects',
                    },
                    {
                        label: t('console-widgets.sections.typography'),
                        value: 'typography',
                        slot: 'typography',
                    },
                    {
                        label: t('console-widgets.sections.advanced'),
                        value: 'advanced',
                        slot: 'advanced',
                    },
                ]"
                :default-value="['content', 'animation', 'effects', 'typography', 'advanced']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.title')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.title"
                                :placeholder="t('console-widgets.warpBackground.titlePlaceholder')"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.description')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UTextarea
                                v-model="model.description"
                                :placeholder="
                                    t('console-widgets.warpBackground.descriptionPlaceholder')
                                "
                                size="md"
                                :rows="3"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #animation>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.perspective')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.perspective"
                                :min="50"
                                :max="500"
                                :step="10"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.beamDuration')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.beamDuration"
                                :min="1"
                                :max="10"
                                :step="0.1"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.beamDelayMin')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.beamDelayMin"
                                :min="0"
                                :max="5"
                                :step="0.1"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.beamDelayMax')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.beamDelayMax"
                                :min="1"
                                :max="10"
                                :step="0.1"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #effects>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.beamsPerSide')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.beamsPerSide"
                                :min="1"
                                :max="10"
                                :step="1"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.beamSize')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.beamSize"
                                :min="1"
                                :max="20"
                                :step="0.5"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.gridColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.gridColor"
                                size="md"
                                :placeholder="t('console-widgets.placeholders.selectColor')"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #typography>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 标题样式 -->
                        <div class="space-y-3">
                            <h4 class="text-sm font-medium text-gray-700">
                                {{ t("console-widgets.warpBackground.titleStyle") }}
                            </h4>

                            <UFormField
                                size="xs"
                                :label="t('console-widgets.warpBackground.titleSize')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <BdSlider
                                    v-model="model.titleSize"
                                    :min="12"
                                    :max="72"
                                    :step="1"
                                    size="md"
                                />
                            </UFormField>

                            <UFormField
                                size="xs"
                                :label="t('console-widgets.warpBackground.titleColor')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <BdColorPicker
                                    v-model="model.titleColor"
                                    size="md"
                                    :placeholder="t('console-widgets.placeholders.selectColor')"
                                />
                            </UFormField>

                            <UFormField
                                size="xs"
                                :label="t('console-widgets.warpBackground.titleWeight')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <USelect
                                    v-model="model.titleWeight"
                                    :items="fontWeightOptions"
                                    label-key="label"
                                    value-key="value"
                                    size="md"
                                    :ui="{ base: 'w-full' }"
                                />
                            </UFormField>
                        </div>

                        <!-- 描述样式 -->
                        <div class="space-y-3 border-t border-gray-200 pt-3">
                            <h4 class="text-sm font-medium text-gray-700">
                                {{ t("console-widgets.warpBackground.descStyle") }}
                            </h4>

                            <UFormField
                                size="xs"
                                :label="t('console-widgets.warpBackground.descSize')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <BdSlider
                                    v-model="model.descSize"
                                    :min="10"
                                    :max="32"
                                    :step="1"
                                    size="md"
                                />
                            </UFormField>

                            <UFormField
                                size="xs"
                                :label="t('console-widgets.warpBackground.descColor')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <BdColorPicker
                                    v-model="model.descColor"
                                    size="md"
                                    :placeholder="t('console-widgets.placeholders.selectColor')"
                                />
                            </UFormField>

                            <UFormField
                                size="xs"
                                :label="t('console-widgets.warpBackground.descWeight')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <USelect
                                    v-model="model.descWeight"
                                    :items="fontWeightOptions"
                                    label-key="label"
                                    value-key="value"
                                    size="md"
                                    :ui="{ base: 'w-full' }"
                                />
                            </UFormField>
                        </div>
                    </div>
                </template>

                <template #advanced>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.warpBackground.className')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.className"
                                :placeholder="t('console-widgets.placeholders.customClass')"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>
            </UAccordion>
        </template>
    </WidgetsBaseProperty>
</template>
