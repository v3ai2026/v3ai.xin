<script lang="ts" setup>
/**
 * 渐变按钮组件属性编辑器
 * @description 用于配置渐变按钮的各项属性，包括边框宽度、渐变颜色、动画时长等
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

// 渐变颜色管理
const updateColor = (index: number, colorValue: string) => {
    const newColors = [...model.value.colors];
    newColors[index] = colorValue;
    model.value.colors = newColors;
};

const addColor = () => {
    model.value.colors = [...model.value.colors, "#FF0000"];
};

const removeColor = (index: number) => {
    if (model.value.colors.length > 2) {
        const newColors = [...model.value.colors];
        newColors.splice(index, 1);
        model.value.colors = newColors;
    }
};
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
                        label: t('console-widgets.sections.colors'),
                        value: 'colors',
                        slot: 'colors',
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
                :default-value="['content', 'appearance', 'colors', 'animation', 'advanced']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 按钮文本 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gradientButton.label')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput
                                v-model="model.label"
                                :placeholder="t('console-widgets.gradientButton.labelPlaceholder')"
                                size="md"
                            />
                        </UFormField>

                        <!-- 按钮背景色 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gradientButton.bgColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.bgColor"
                                size="md"
                                :placeholder="
                                    t('console-widgets.gradientButton.bgColorPlaceholder')
                                "
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
                    </div>
                </template>

                <template #appearance>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 边框宽度 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gradientButton.borderWidth')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.borderWidth"
                                :min="1"
                                :max="10"
                                :step="1"
                                size="md"
                            />
                        </UFormField>

                        <!-- 边框圆角 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gradientButton.borderRadius')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.borderRadius"
                                :min="0"
                                :max="50"
                                :step="1"
                                size="md"
                            />
                        </UFormField>

                        <!-- 模糊强度 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gradientButton.blur')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider v-model="model.blur" :min="0" :max="20" :step="1" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #colors>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <div class="space-y-3">
                            <div class="flex items-center justify-between">
                                <h4 class="text-sm font-medium text-gray-700">
                                    {{ t("console-widgets.gradientButton.colors") }}
                                </h4>
                                <UButton
                                    size="xs"
                                    variant="soft"
                                    color="primary"
                                    icon="i-heroicons-plus"
                                    @click="addColor"
                                >
                                    {{ t("console-widgets.gradientButton.addColor") }}
                                </UButton>
                            </div>

                            <div class="space-y-2">
                                <div
                                    v-for="(color, colorIndex) in model.colors"
                                    :key="colorIndex"
                                    class="flex items-center gap-2"
                                >
                                    <div class="flex-1">
                                        <BdColorPicker
                                            :model-value="color"
                                            size="sm"
                                            @update:model-value="updateColor(colorIndex, $event)"
                                        />
                                    </div>
                                    <UButton
                                        v-if="model.colors.length > 2"
                                        size="xs"
                                        variant="ghost"
                                        color="error"
                                        icon="i-heroicons-trash"
                                        @click="removeColor(colorIndex)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #animation>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 动画时长 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.gradientButton.duration')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.duration"
                                :min="500"
                                :max="10000"
                                :step="100"
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
                                :placeholder="t('console-widgets.gradientButton.classPlaceholder')"
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
