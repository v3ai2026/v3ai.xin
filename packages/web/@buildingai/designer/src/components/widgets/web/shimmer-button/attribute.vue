<script lang="ts" setup>
/**
 * 闪光按钮组件属性编辑器
 * @description 用于配置闪光按钮的各项属性，包括按钮文字、闪光效果、动画时长等
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
                        label: t('console-widgets.sections.appearance'),
                        value: 'appearance',
                        slot: 'appearance',
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
                :default-value="['content', 'appearance', 'animation', 'advanced']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 按钮文字 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.shimmerButton.text')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.text"
                                :placeholder="t('console-widgets.shimmerButton.textPlaceholder')"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.button.linkUrl')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <LinkPicker v-model="model.to" size="md" />
                        </UFormField>

                        <!-- 按钮背景色 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.shimmerButton.background')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.background"
                                size="md"
                                :placeholder="
                                    t('console-widgets.shimmerButton.backgroundPlaceholder')
                                "
                                alpha
                            />
                        </UFormField>
                    </div>
                </template>

                <template #appearance>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 闪光颜色 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.shimmerButton.shimmerColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.shimmerColor"
                                size="md"
                                :placeholder="
                                    t('console-widgets.shimmerButton.shimmerColorPlaceholder')
                                "
                                alpha
                            />
                        </UFormField>

                        <!-- 边框圆角 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.shimmerButton.borderRadius')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.borderRadius"
                                :placeholder="
                                    t('console-widgets.shimmerButton.borderRadiusPlaceholder')
                                "
                                size="md"
                            />
                        </UFormField>

                        <!-- 闪光大小 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.shimmerButton.shimmerSize')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.shimmerSize"
                                :placeholder="
                                    t('console-widgets.shimmerButton.shimmerSizePlaceholder')
                                "
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #animation>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 闪光动画时长 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.shimmerButton.shimmerDuration')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.shimmerDuration"
                                :placeholder="
                                    t('console-widgets.shimmerButton.shimmerDurationPlaceholder')
                                "
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #advanced>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 自定义类名 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.customClass')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.class"
                                :placeholder="t('console-widgets.shimmerButton.classPlaceholder')"
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
