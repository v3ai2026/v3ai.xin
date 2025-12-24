<script lang="ts" setup>
/**
 * 页面区块组件属性编辑器
 * @description 用于编辑页面区块组件的属性，包括标题、描述、功能列表、链接设置等
 */

import { useVModel } from "@vueuse/core";

import WidgetsBaseProperty from "../../base/widgets-base-property.vue";
import type { FeatureItem, LinkItems, Props } from "./config";

const props = defineProps<{
    modelValue: Props;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: Props): void;
}>();

const model = useVModel(props, "modelValue", emit);

const { t } = useI18n();

// 布局方向选项
const orientationOptions: { label: string; value: "vertical" | "horizontal" }[] = [
    { label: t("console-widgets.options.layout.vertical"), value: "vertical" },
    { label: t("console-widgets.options.layout.horizontal"), value: "horizontal" },
];

// 链接颜色选项
const colorOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.labels.primary"), value: "primary" },
    { label: t("console-widgets.labels.secondary"), value: "secondary" },
    { label: t("console-widgets.labels.success"), value: "success" },
    { label: t("console-widgets.labels.warning"), value: "warning" },
    { label: t("console-widgets.labels.error"), value: "error" },
    { label: t("console-widgets.labels.neutral"), value: "neutral" },
];

// 链接变体选项
const variantOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.variants.solid"), value: "solid" },
    { label: t("console-widgets.options.variants.outline"), value: "outline" },
    { label: t("console-widgets.options.variants.soft"), value: "soft" },
    { label: t("console-widgets.options.variants.ghost"), value: "ghost" },
    { label: t("console-widgets.options.variants.link"), value: "link" },
    { label: "subtle", value: "subtle" },
];

// 阴影选项
const shadowOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.shadows.none"), value: "none" },
    { label: t("console-widgets.options.shadows.sm"), value: "sm" },
    { label: t("console-widgets.options.shadows.md"), value: "md" },
    { label: t("console-widgets.options.shadows.lg"), value: "lg" },
    { label: t("console-widgets.options.shadows.xl"), value: "xl" },
];

// 新增功能项
const addFeature = () => {
    const newFeature: FeatureItem = {
        id: `feature-${Date.now()}`,
        title: t("console-widgets.placeholders.newFeature"),
        description: t("console-widgets.placeholders.featureDesc"),
        icon: "i-lucide-star",
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
    };
    model.value.features.push(newFeature);
};

// 删除功能项
const removeFeature = (index: number) => {
    model.value.features.splice(index, 1);
};

// 复制功能项
const duplicateFeature = (index: number) => {
    const originalFeature = model.value.features[index];
    if (originalFeature) {
        const duplicatedFeature: FeatureItem = {
            ...originalFeature,
            id: `feature-${Date.now()}`,
            title: `${originalFeature.title} ${t("console-widgets.placeholders.copy")}`,
        };
        model.value.features.splice(index + 1, 0, duplicatedFeature);
    }
};

// 新增链接项
const addLink = () => {
    const newLink: LinkItems = {
        id: `link-${Date.now()}`,
        label: t("console-widgets.placeholders.newLink"),
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        icon: "",
        trailingIcon: "",
        color: "neutral",
        variant: "solid",
    };
    model.value.links.push(newLink);
};

// 删除链接项
const removeLink = (index: number) => {
    model.value.links.splice(index, 1);
};

// 复制链接项
const duplicateLink = (index: number) => {
    const originalLink = model.value.links[index];
    if (originalLink) {
        const duplicatedLink: LinkItems = {
            ...originalLink,
            id: `link-${Date.now()}`,
            label: `${originalLink.label} ${t("console-widgets.placeholders.copy")}`,
        };
        model.value.links.splice(index + 1, 0, duplicatedLink);
    }
};
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    { label: t('console-widgets.sections.basic'), value: 'basic', slot: 'basic' },
                    { label: t('console-widgets.sections.image'), value: 'image', slot: 'image' },
                    { label: t('console-widgets.sections.button'), value: 'links', slot: 'links' },
                    {
                        label: t('console-widgets.sections.features'),
                        value: 'features',
                        slot: 'features',
                    },
                    {
                        label: t('console-widgets.sections.layout'),
                        value: 'layout',
                        slot: 'layout',
                    },
                    {
                        label: t('console-widgets.sections.spacing'),
                        value: 'spacing',
                        slot: 'spacing',
                    },
                ]"
                :default-value="['basic', 'image', 'features', 'links', 'layout', 'spacing']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #basic>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 副标题设置 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.showSubtitle')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showHeadline" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.showHeadline"
                            size="xs"
                            :label="t('console-widgets.labels.subtitleContent')"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'w-full' }"
                        >
                            <UInput
                                v-model="model.headline"
                                :placeholder="t('console-widgets.placeholders.enterSubtitle')"
                                size="md"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>

                        <!-- 图标设置 -->
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
                            :label="t('console-widgets.labels.iconName')"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <UInput v-model="model.icon" placeholder="i-lucide-rocket" size="md" />
                        </UFormField>

                        <!-- 标题设置 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.showTitle')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showTitle" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.showTitle"
                            size="xs"
                            :label="t('console-widgets.labels.titleContent')"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <UInput
                                v-model="model.title"
                                :placeholder="t('console-widgets.placeholders.enterTitle')"
                                size="md"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>

                        <!-- 描述设置 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.pricingPlans.showDescription')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showDescription" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.showDescription"
                            size="xs"
                            label="描述内容"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <UTextarea
                                v-model="model.description"
                                :placeholder="t('console-widgets.placeholders.enterDescription')"
                                :rows="5"
                                size="md"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #image>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 图片显示开关 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.show')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showImage" size="md" />
                        </UFormField>

                        <div v-if="model.showImage" class="space-y-3">
                            <UFormField
                                size="xs"
                                label="图片URL"
                                :ui="{ wrapper: 'flex', label: 'text-muted' }"
                            >
                                <UInput
                                    v-model="model.imageUrl"
                                    placeholder="https://example.com/image.jpg"
                                    size="md"
                                    :ui="{ root: 'w-full' }"
                                />
                            </UFormField>

                            <UFormField
                                size="xs"
                                label="图片描述"
                                :ui="{ wrapper: 'flex', label: 'text-muted' }"
                            >
                                <UInput
                                    v-model="model.imageAlt"
                                    placeholder="图片描述文本"
                                    size="md"
                                    :ui="{ root: 'w-full' }"
                                />
                            </UFormField>

                            <div class="grid grid-cols-2 gap-2">
                                <UFormField
                                    size="xs"
                                    :label="t('console-widgets.common.width')"
                                    :ui="{
                                        wrapper: 'flex',
                                        label: 'text-muted',
                                        container: 'w-[80px]',
                                    }"
                                >
                                    <BdSlider
                                        v-model="model.imageWidth"
                                        :min="200"
                                        :max="800"
                                        size="md"
                                    />
                                </UFormField>

                                <UFormField
                                    size="xs"
                                    :label="t('console-widgets.common.height')"
                                    :ui="{
                                        wrapper: 'flex',
                                        label: 'text-muted',
                                        container: 'w-[80px]',
                                    }"
                                >
                                    <BdSlider
                                        v-model="model.imageHeight"
                                        :min="0"
                                        :max="600"
                                        size="md"
                                    />
                                </UFormField>
                            </div>
                        </div>
                    </div>
                </template>

                <template #links>
                    <div class="w-full space-y-4 px-1 pt-2 pb-4">
                        <!-- 链接按钮开关 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.options.variants.link')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showLinks" size="md" />
                        </UFormField>

                        <div v-if="model.showLinks" class="space-y-4">
                            <div class="flex items-center justify-between">
                                <span class="text-muted text-sm">{{
                                    t("console-widgets.sections.button")
                                }}</span>
                                <UButton size="xs" variant="outline" @click="addLink">
                                    <UIcon name="i-heroicons-plus" class="h-3 w-3" />
                                    添加链接
                                </UButton>
                            </div>

                            <div class="space-y-4">
                                <div
                                    v-for="(link, linkIndex) in model.links"
                                    :key="link.id"
                                    class="border-muted space-y-3 rounded-lg border p-3"
                                >
                                    <!-- 链接操作栏 -->
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium">{{
                                            link.label ||
                                            t("console-widgets.pageSection.linkItem") +
                                                ` ${linkIndex + 1}`
                                        }}</span>
                                        <div class="flex gap-1">
                                            <UButton
                                                size="xs"
                                                variant="outline"
                                                @click="duplicateLink(linkIndex)"
                                                title="复制链接"
                                            >
                                                <UIcon
                                                    name="i-heroicons-document-duplicate"
                                                    class="h-3 w-3"
                                                />
                                            </UButton>
                                            <UButton
                                                size="xs"
                                                variant="outline"
                                                color="error"
                                                @click="removeLink(linkIndex)"
                                                title="删除链接"
                                            >
                                                <UIcon name="i-heroicons-trash" class="h-3 w-3" />
                                            </UButton>
                                        </div>
                                    </div>

                                    <!-- 链接配置 -->
                                    <div class="space-y-2">
                                        <div class="grid grid-cols-2 gap-2">
                                            <UFormField
                                                size="xs"
                                                :label="
                                                    t('console-widgets.pricingPlans.buttonText')
                                                "
                                            >
                                                <UInput
                                                    v-model="model.links[linkIndex]!.label"
                                                    :placeholder="
                                                        t('console-widgets.pricingPlans.buttonText')
                                                    "
                                                    size="sm"
                                                />
                                            </UFormField>
                                            <UFormField
                                                size="xs"
                                                :label="t('console-widgets.button.linkUrl')"
                                            >
                                                <LinkPicker
                                                    v-model="model.links[linkIndex]!.to"
                                                    size="sm"
                                                />
                                            </UFormField>
                                        </div>
                                        <div class="grid grid-cols-2 gap-2">
                                            <UFormField
                                                size="xs"
                                                :label="t('console-widgets.labels.icon')"
                                            >
                                                <UInput
                                                    v-model="model.links[linkIndex]!.icon"
                                                    placeholder="i-lucide-play"
                                                    size="sm"
                                                    :ui="{ root: 'w-full' }"
                                                />
                                            </UFormField>
                                            <UFormField size="xs" label="尾随图标">
                                                <UInput
                                                    v-model="model.links[linkIndex]!.trailingIcon"
                                                    placeholder="i-lucide-arrow-right"
                                                    size="sm"
                                                    :ui="{ root: 'w-full' }"
                                                />
                                            </UFormField>
                                        </div>
                                        <div class="grid grid-cols-2 gap-2">
                                            <UFormField
                                                size="xs"
                                                :label="t('console-widgets.labels.color')"
                                            >
                                                <USelect
                                                    v-model="model.links[linkIndex]!.color"
                                                    :items="colorOptions"
                                                    size="sm"
                                                    :ui="{ base: 'w-full' }"
                                                />
                                            </UFormField>
                                            <UFormField
                                                size="xs"
                                                :label="t('console-widgets.labels.variant')"
                                            >
                                                <USelect
                                                    v-model="model.links[linkIndex]!.variant"
                                                    :items="variantOptions"
                                                    size="sm"
                                                    :ui="{ base: 'w-full' }"
                                                />
                                            </UFormField>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #features>
                    <div class="w-full space-y-4 px-1 pt-2 pb-4">
                        <!-- 功能列表开关 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.showFeatures')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showFeatures" size="md" />
                        </UFormField>

                        <div v-if="model.showFeatures" class="space-y-4">
                            <!-- 功能列表样式设置 -->
                            <div class="space-y-3">
                                <div class="pb-1 text-xs font-medium">样式设置</div>

                                <UFormField
                                    size="xs"
                                    :label="t('console-widgets.options.variants.outline')"
                                    class="flex w-full justify-between"
                                    :ui="{ wrapper: 'flex', label: 'text-muted' }"
                                >
                                    <USwitch v-model="model.showFeatureBorder" size="md" />
                                </UFormField>

                                <div v-if="!model.showFeatureBorder" class="space-y-2">
                                    <UFormField
                                        size="xs"
                                        :label="t('console-widgets.common.shadow')"
                                        class="flex justify-between"
                                        :ui="{
                                            wrapper: 'flex',
                                            label: 'text-muted',
                                            container: 'width160',
                                        }"
                                    >
                                        <USelect
                                            v-model="model.featureShadow"
                                            :items="shadowOptions"
                                            size="sm"
                                            :ui="{ base: 'w-full' }"
                                        />
                                    </UFormField>

                                    <UFormField
                                        size="xs"
                                        :label="t('console-widgets.common.shadow')"
                                        class="flex justify-between"
                                        :ui="{
                                            wrapper: 'flex',
                                            label: 'text-muted',
                                            container: 'width160',
                                        }"
                                    >
                                        <USelect
                                            v-model="model.featureShadowHover"
                                            :items="shadowOptions"
                                            size="sm"
                                            :ui="{ base: 'w-full' }"
                                        />
                                    </UFormField>
                                </div>
                            </div>

                            <div class="flex items-center justify-between">
                                <span class="text-muted text-sm">功能项目</span>
                                <UButton size="xs" variant="outline" @click="addFeature">
                                    <UIcon name="i-heroicons-plus" class="h-3 w-3" />
                                    添加功能
                                </UButton>
                            </div>

                            <div class="space-y-4">
                                <div
                                    v-for="(feature, featureIndex) in model.features"
                                    :key="feature.id"
                                    class="border-muted space-y-3 rounded-lg border p-3"
                                >
                                    <!-- 功能操作栏 -->
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium">{{
                                            feature.title || `功能 ${featureIndex + 1}`
                                        }}</span>
                                        <div class="flex gap-1">
                                            <UButton
                                                size="xs"
                                                variant="outline"
                                                @click="duplicateFeature(featureIndex)"
                                                title="复制功能"
                                            >
                                                <UIcon
                                                    name="i-heroicons-document-duplicate"
                                                    class="h-3 w-3"
                                                />
                                            </UButton>
                                            <UButton
                                                size="xs"
                                                variant="outline"
                                                color="error"
                                                @click="removeFeature(featureIndex)"
                                                title="删除功能"
                                            >
                                                <UIcon name="i-heroicons-trash" class="h-3 w-3" />
                                            </UButton>
                                        </div>
                                    </div>

                                    <!-- 功能配置 -->
                                    <div class="space-y-2">
                                        <div class="grid grid-cols-2 gap-2">
                                            <UFormField size="xs" label="功能标题">
                                                <UInput
                                                    v-model="model.features[featureIndex]!.title"
                                                    placeholder="功能标题"
                                                    size="sm"
                                                />
                                            </UFormField>
                                            <UFormField size="xs" label="功能图标">
                                                <UInput
                                                    v-model="model.features[featureIndex]!.icon"
                                                    placeholder="i-lucide-star"
                                                    size="sm"
                                                />
                                            </UFormField>
                                        </div>
                                        <UFormField size="xs" label="功能描述">
                                            <UTextarea
                                                v-model="model.features[featureIndex]!.description"
                                                placeholder="功能描述"
                                                size="sm"
                                                :rows="3"
                                                :ui="{ root: 'w-full' }"
                                            />
                                        </UFormField>
                                        <div class="grid gap-2">
                                            <UFormField
                                                size="xs"
                                                :label="t('console-widgets.options.variants.link')"
                                            >
                                                <LinkPicker
                                                    v-model="model.features[featureIndex]!.to"
                                                    size="sm"
                                                />
                                            </UFormField>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <template #layout>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            label="布局方向"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <USelect
                                v-model="model.orientation"
                                :items="orientationOptions"
                                size="md"
                                :ui="{ base: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            label="反向布局"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.reverse" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #spacing>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.spacing')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdSlider v-model="model.sectionGap" :min="16" :max="128" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.spacing')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdSlider v-model="model.featuresGap" :min="8" :max="64" size="md" />
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
                :default-value="['background', 'padding']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #background>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.bgColor')"
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
                            :label="t('console-widgets.common.bgColor')"
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
                                :max="100"
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
                                :max="100"
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
                                :max="100"
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
                                :max="100"
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
