<script lang="ts" setup>
/**
 * 彩虹按钮组件属性编辑器
 * @description 用于配置彩虹按钮的各项属性，包括按钮文字、HTML标签类型、动画速度等
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

// HTML标签选项
const htmlTagOptions: { label: string; value: string }[] = [
    { label: "Button", value: "button" },
    { label: "Div", value: "div" },
    { label: "Span", value: "span" },
    { label: "A", value: "a" },
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
                        label: t('console-widgets.sections.advanced'),
                        value: 'advanced',
                        slot: 'advanced',
                    },
                ]"
                :default-value="['content', 'animation', 'advanced']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 按钮文字 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.rainbowButton.text')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.text"
                                :placeholder="t('console-widgets.rainbowButton.textPlaceholder')"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.button.linkUrl')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <LinkPicker v-model="model.to" size="md" />
                        </UFormField>

                        <!-- 文字颜色 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.rainbowButton.textColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.textColor"
                                size="md"
                                :placeholder="
                                    t('console-widgets.rainbowButton.textColorPlaceholder')
                                "
                                alpha
                            />
                        </UFormField>

                        <!-- 按钮背景色 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.rainbowButton.buttonBgColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.buttonBgColor"
                                size="md"
                                :placeholder="
                                    t('console-widgets.rainbowButton.buttonBgColorPlaceholder')
                                "
                                alpha
                            />
                        </UFormField>
                    </div>
                </template>

                <template #animation>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 动画速度 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.rainbowButton.speed')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.speed"
                                :min="0.5"
                                :max="10"
                                :step="0.1"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #advanced>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- HTML标签类型 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.rainbowButton.htmlTag')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelect
                                v-model="model.is"
                                :items="htmlTagOptions"
                                label-key="label"
                                value-key="value"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>

                        <!-- 自定义类名 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.customClass')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.class"
                                :placeholder="t('console-widgets.rainbowButton.classPlaceholder')"
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
