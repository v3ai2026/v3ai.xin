<script lang="ts" setup>
/**
 * 视频文字组件属性编辑器
 * @description 用于编辑视频文字组件的属性，包括视频上传、播放设置、文字样式和遮罩效果
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

// 预加载选项
const preloadOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.videoText.preloadOptions.auto"), value: "auto" },
    { label: t("console-widgets.videoText.preloadOptions.metadata"), value: "metadata" },
    { label: t("console-widgets.videoText.preloadOptions.none"), value: "none" },
];

// 文字锚点选项
const textAnchorOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.videoText.textAnchorOptions.start"), value: "start" },
    { label: t("console-widgets.videoText.textAnchorOptions.middle"), value: "middle" },
    { label: t("console-widgets.videoText.textAnchorOptions.end"), value: "end" },
];

// 基线对齐选项
const dominantBaselineOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.videoText.dominantBaselineOptions.hanging"), value: "hanging" },
    { label: t("console-widgets.videoText.dominantBaselineOptions.middle"), value: "middle" },
    { label: t("console-widgets.videoText.dominantBaselineOptions.baseline"), value: "baseline" },
];

// 字体族选项
const fontFamilyOptions: { label: string; value: string }[] = [
    { label: "Sans-serif", value: "sans-serif" },
    { label: "Serif", value: "serif" },
    { label: "Monospace", value: "monospace" },
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
];
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    {
                        label: t('console-widgets.sections.media'),
                        value: 'media',
                        slot: 'media',
                    },
                    {
                        label: t('console-widgets.sections.content'),
                        value: 'content',
                        slot: 'content',
                    },
                    {
                        label: t('console-widgets.sections.playback'),
                        value: 'playback',
                        slot: 'playback',
                    },
                    {
                        label: t('console-widgets.sections.typography'),
                        value: 'typography',
                        slot: 'typography',
                    },
                ]"
                :default-value="['media', 'content', 'playback', 'typography']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #media>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 视频上传 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.src')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdUploader
                                v-model="model.src"
                                class="size-20"
                                icon="i-lucide-upload"
                                accept=".mp4,.webm,.ogg"
                                text=" "
                                :maxCount="1"
                                :single="true"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 显示文字 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.content')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UTextarea
                                v-model="model.content"
                                :placeholder="t('console-widgets.placeholders.enterText')"
                                size="md"
                                :rows="2"
                            />
                        </UFormField>

                        <!-- 自定义类名 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.className')"
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

                <template #playback>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 自动播放 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.autoPlay')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USwitch v-model="model.autoPlay" size="md" />
                        </UFormField>

                        <!-- 静音播放 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.muted')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USwitch v-model="model.muted" size="md" />
                        </UFormField>

                        <!-- 循环播放 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.loop')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USwitch v-model="model.loop" size="md" />
                        </UFormField>

                        <!-- 预加载方式 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.preload')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelect
                                v-model="model.preload"
                                :items="preloadOptions"
                                label-key="label"
                                value-key="value"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #typography>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 字体大小 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.fontSize')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.fontSize"
                                :min="1"
                                :max="50"
                                :step="1"
                                size="md"
                            />
                        </UFormField>

                        <!-- 字体粗细 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.fontWeight')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdSlider
                                v-model="model.fontWeight"
                                :min="100"
                                :max="900"
                                :step="100"
                                size="md"
                            />
                        </UFormField>

                        <!-- 字体族 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.fontFamily')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelect
                                v-model="model.fontFamily"
                                :items="fontFamilyOptions"
                                label-key="label"
                                value-key="value"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>

                        <!-- 文字锚点 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.textAnchor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelect
                                v-model="model.textAnchor"
                                :items="textAnchorOptions"
                                label-key="label"
                                value-key="value"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>

                        <!-- 基线对齐 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.videoText.dominantBaseline')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelect
                                v-model="model.dominantBaseline"
                                :items="dominantBaselineOptions"
                                label-key="label"
                                value-key="value"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>
            </UAccordion>
        </template>
    </WidgetsBaseProperty>
</template>
