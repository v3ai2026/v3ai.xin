<script lang="ts" setup>
/**
 * 图片魔方组件属性编辑器
 * @description 用于编辑图片魔方组件的属性，包括布局类型、图片列表和样式设置
 */
import { useVModel } from "@vueuse/core";
import { computed, watch } from "vue";

import WidgetsBaseProperty from "../../base/widgets-base-property.vue";
import type { ImageCubeLayoutType, Props } from "./config";

const props = defineProps<{
    modelValue: Props;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: Props): void;
}>();

const model = useVModel(props, "modelValue", emit);

const { t } = useI18n();

/**
 * 布局类型选项
 */
const layoutTypeOptions = [
    {
        label: t("console-widgets.options.imageCube.oneRowOne"),
        value: "one-row-one",
        icon: "local-icon-RowOne",
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="50" height="50" rx="8" fill="currentColor" stroke="none" opacity="0.3"/>
    </svg>`,
    },
    {
        label: t("console-widgets.options.imageCube.oneRowTwo"),
        value: "one-row-two",
        icon: "local-icon-RowTwo",
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="30" height="50" rx="6" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="55" y="25" width="30" height="50" rx="6" fill="currentColor" stroke="none" opacity="0.3"/>
    </svg>`,
    },
    {
        label: t("console-widgets.options.imageCube.oneRowThree"),
        value: "one-row-three",
        icon: "local-icon-RowThree",
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="25" width="24" height="50" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="38" y="25" width="24" height="50" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="68" y="25" width="24" height="50" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
    </svg>`,
    },
    {
        label: t("console-widgets.options.imageCube.leftOneRightTwo"),
        value: "left-one-right-two",
        icon: "local-icon-LeftOneRightTwo",
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="32" height="50" rx="6" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="53" y="25" width="32" height="22" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="53" y="53" width="32" height="22" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
    </svg>`,
    },
    {
        label: t("console-widgets.options.imageCube.leftTwoRightOne"),
        value: "left-two-right-one",
        icon: "local-icon-LeftTwoRightOne",
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="25" width="32" height="22" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="15" y="53" width="32" height="22" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="53" y="25" width="32" height="50" rx="6" fill="currentColor" stroke="none" opacity="0.3"/>
    </svg>`,
    },
    {
        label: t("console-widgets.options.imageCube.topOneBottomTwo"),
        value: "top-one-bottom-two",
        icon: "local-icon-TopOneBottomTwo",
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="20" width="70" height="22" rx="6" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="15" y="50" width="32" height="30" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="53" y="50" width="32" height="30" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
    </svg>`,
    },
    {
        label: t("console-widgets.options.imageCube.topTwoBottomOne"),
        value: "top-two-bottom-one",
        icon: "local-icon-TopTwoBottomOne",
        svg: `<svg viewBox="0 0 100 100" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="20" width="32" height="22" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="53" y="20" width="32" height="22" rx="4" fill="currentColor" stroke="none" opacity="0.3"/>
      <rect x="15" y="50" width="70" height="30" rx="6" fill="currentColor" stroke="none" opacity="0.3"/>
    </svg>`,
    },
];

/**
 * 获取需要显示的图片数量
 */
const requiredImageCount = computed(() => {
    switch (model.value.layoutType) {
        case "one-row-one":
            return 1;
        case "one-row-two":
            return 2;
        case "one-row-three":
            return 3;
        case "left-one-right-two":
        case "left-two-right-one":
        case "top-one-bottom-two":
        case "top-two-bottom-one":
            return 3;
        default:
            return 2;
    }
});

/**
 * 监听布局类型变化，自动调整图片数量
 */
watch(
    () => model.value.layoutType,
    () => {
        // 根据布局类型调整图片数量
        const currentCount = model.value.images.length;
        const requiredCount = requiredImageCount.value;

        if (currentCount < requiredCount) {
            // 需要添加图片
            for (let i = currentCount; i < requiredCount; i++) {
                model.value.images.push({
                    image: "",
                    to: {
                        type: "custom",
                        name: "自定义链接",
                        path: "",
                        query: {},
                    },
                });
            }
        } else if (currentCount > requiredCount) {
            // 需要移除多余的图片
            model.value.images = model.value.images.slice(0, requiredCount);
        }
    },
);

/**
 * 获取图片项标题
 */
function getImageTitle(index: number) {
    const type = model.value.layoutType;

    if (type === "left-one-right-two" && index === 0) {
        return t("console-widgets.options.imageCubeLayout.leftLarge");
    } else if (type === "left-two-right-one" && index === 2) {
        return t("console-widgets.options.imageCubeLayout.rightLarge");
    } else if (type === "top-one-bottom-two" && index === 0) {
        return t("console-widgets.options.imageCubeLayout.topLarge");
    } else if (type === "top-two-bottom-one" && index === 2) {
        return t("console-widgets.options.imageCubeLayout.bottomLarge");
    }

    return `${t("console-widgets.labels.image")} ${index + 1}`;
}
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    {
                        label: t('console-widgets.labels.cubeLayout'),
                        value: 'layout',
                        slot: 'layout',
                    },
                    { label: t('console-widgets.sections.image'), value: 'images', slot: 'images' },
                ]"
                :default-value="['layout', 'images']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #layout>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <div class="grid grid-cols-4 gap-2">
                            <div
                                v-for="option in layoutTypeOptions"
                                :key="option.value"
                                class="group flex cursor-pointer items-center justify-center rounded-xl p-3 transition-all duration-200 hover:scale-105"
                                :class="{
                                    'bg-muted ring-primary-200 ring-2':
                                        model.layoutType === option.value,
                                    'bg-accent hover:bg-accent-100':
                                        model.layoutType !== option.value,
                                }"
                                @click="model.layoutType = option.value as ImageCubeLayoutType"
                            >
                                <div
                                    class="text-accent-foreground dark:text-muted-foreground h-10 w-10 transition-all duration-200"
                                    :class="{
                                        'dark:!text-default !text-gray-800 opacity-100':
                                            model.layoutType === option.value,
                                        'opacity-60 group-hover:opacity-80':
                                            model.layoutType !== option.value,
                                    }"
                                    v-html="option.svg"
                                />
                            </div>
                        </div>
                    </div>
                </template>

                <template #images>
                    <div class="w-full space-y-3 pt-2 pb-4">
                        <div
                            v-for="(image, index) in model.images.slice(0, requiredImageCount)"
                            :key="index"
                            class="bg-accent rounded-lg p-3"
                        >
                            <p class="text-secondary-foreground mb-3 text-base">
                                {{ getImageTitle(index) }}
                            </p>
                            <div class="flex items-center justify-around">
                                <div class="space-y-3">
                                    <BdUploader
                                        v-model="image.image"
                                        class="h-[130px] w-[230px]"
                                        icon="i-lucide-upload"
                                        accept=".jpg,.png,.jpeg"
                                        text=" "
                                        :maxCount="1"
                                        :single="true"
                                    />

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
                                        <LinkPicker v-model="image.to" size="md" />
                                    </UFormField>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </UAccordion>
        </template>

        <template #style>
            <UAccordion
                :items="[
                    {
                        label: t('console-widgets.sections.colors'),
                        value: 'colors',
                        slot: 'colors',
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
                :default-value="['colors', 'padding', 'radius']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #colors>
                    <div class="space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.backgroundColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.rootBgColor"
                                size="sm"
                                :placeholder="t('console-widgets.common.backgroundColor')"
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
                                :max="48"
                                :step="1"
                                size="sm"
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
                                :max="48"
                                :step="1"
                                size="sm"
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
                                :max="48"
                                :step="1"
                                size="sm"
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
                                :max="48"
                                :step="1"
                                size="sm"
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
                                v-model="model.style.imageGap"
                                :min="0"
                                :max="30"
                                :step="1"
                                size="sm"
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
                                :max="24"
                                :step="1"
                                size="sm"
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
                                :max="24"
                                :step="1"
                                size="sm"
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
                                v-model="model.style.imageRadius"
                                :min="0"
                                :max="24"
                                :step="1"
                                size="sm"
                            />
                        </UFormField>
                    </div>
                </template>
            </UAccordion>
        </template>
    </WidgetsBaseProperty>
</template>
<style lang="scss" scoped>
.layout-option {
    border: 1px solid var(--border-muted);
    transition: all 0.3s;

    &:hover {
        border-color: var(--primary-400);
        background-color: var(--primary-100);
    }

    &.bg-primary-100 {
        background-color: var(--primary-200);
        border-color: var(--primary-500);
    }
}
</style>
