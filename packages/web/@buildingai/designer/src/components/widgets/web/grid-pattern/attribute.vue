<script lang="ts" setup>
/**
 * 网格图案组件属性编辑器
 * @description 用于编辑网格图案组件的属性，包括方格尺寸、网格数量、文字和效果设置
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
                        label: t('console-widgets.sections.gridSettings'),
                        value: 'gridSettings',
                        slot: 'gridSettings',
                    },
                    {
                        label: t('console-widgets.sections.squareSize'),
                        value: 'squareSize',
                        slot: 'squareSize',
                    },
                    {
                        label: t('console-widgets.sections.effects'),
                        value: 'effects',
                        slot: 'effects',
                    },
                    {
                        label: t('console-widgets.sections.advanced'),
                        value: 'advanced',
                        slot: 'advanced',
                    },
                ]"
                :default-value="['content', 'gridSettings', 'squareSize', 'effects', 'advanced']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gridPattern.showText')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USwitch v-model="model.showText" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.showText"
                            size="xs"
                            :label="t('console-widgets.gridPattern.text')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UTextarea
                                v-model="model.text"
                                :placeholder="t('console-widgets.placeholders.enterText')"
                                size="md"
                                :rows="2"
                            />
                        </UFormField>

                        <UFormField
                            v-if="model.showText"
                            size="xs"
                            :label="t('console-widgets.gridPattern.textSize')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.textSize"
                                :min="12"
                                :max="100"
                                :step="1"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            v-if="model.showText"
                            size="xs"
                            :label="t('console-widgets.gridPattern.textColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.textColor"
                                size="md"
                                :placeholder="t('console-widgets.placeholders.selectColor')"
                            />
                        </UFormField>

                        <UFormField
                            v-if="model.showText"
                            size="xs"
                            :label="t('console-widgets.gridPattern.fontWeight')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelect
                                v-model="model.fontWeight"
                                :items="fontWeightOptions"
                                label-key="label"
                                value-key="value"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #gridSettings>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gridPattern.horizontalSquares')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.squares[0]"
                                :min="1"
                                :max="50"
                                :step="1"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gridPattern.verticalSquares')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.squares[1]"
                                :min="1"
                                :max="50"
                                :step="1"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #squareSize>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gridPattern.squareWidth')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.width"
                                :min="10"
                                :max="100"
                                :step="5"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gridPattern.squareHeight')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.height"
                                :min="10"
                                :max="100"
                                :step="5"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #effects>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gridPattern.maskEffect')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USwitch v-model="model.maskEffect" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gridPattern.skewEffect')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USwitch v-model="model.skewEffect" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #advanced>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gridPattern.containerClass')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.className"
                                :placeholder="t('console-widgets.placeholders.customClass')"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gridPattern.squaresClass')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.squaresClassName"
                                :placeholder="t('console-widgets.placeholders.customClass')"
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
                                :placeholder="t('console-widgets.placeholders.selectBottomBgColor')"
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
                                :placeholder="
                                    t('console-widgets.placeholders.selectComponentBgColor')
                                "
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
                            :label="t('console-widgets.common.topRadius')"
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
                            :label="t('console-widgets.common.bottomRadius')"
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
