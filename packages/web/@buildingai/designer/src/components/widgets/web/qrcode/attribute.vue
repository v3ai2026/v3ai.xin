<script lang="ts" setup>
/**
 * 二维码组件属性编辑器
 * @description 用于编辑二维码组件的属性，包括内容、显示、logo等设置
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

// 错误校正级别选项
const errorLevelOptions: { label: string; value: string; description: string }[] = [
    {
        label: t("console-widgets.options.errorCorrection.low"),
        value: "L",
        description: t("console-widgets.options.errorCorrection.lowDesc"),
    },
    {
        label: t("console-widgets.options.errorCorrection.medium"),
        value: "M",
        description: t("console-widgets.options.errorCorrection.mediumDesc"),
    },
    {
        label: t("console-widgets.options.errorCorrection.high"),
        value: "Q",
        description: t("console-widgets.options.errorCorrection.highDesc"),
    },
    {
        label: t("console-widgets.options.errorCorrection.highest"),
        value: "H",
        description: t("console-widgets.options.errorCorrection.highestDesc"),
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
                        label: t('console-widgets.sections.display'),
                        value: 'display',
                        slot: 'display',
                    },
                    { label: t('console-widgets.sections.logo'), value: 'logo', slot: 'logo' },
                ]"
                :default-value="['content', 'display', 'logo']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
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
                                :placeholder="t('console-widgets.placeholders.enterQRContent')"
                                :rows="4"
                                size="md"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.errorLevel')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <USelectMenu
                                v-model="model.level"
                                :items="errorLevelOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            >
                                <template #item="{ item }">
                                    <div>
                                        <div class="font-medium">{{ item?.label }}</div>
                                        <div class="text-accent-foreground text-xs">
                                            {{ item?.description }}
                                        </div>
                                    </div>
                                </template>
                            </USelectMenu>
                        </UFormField>
                    </div>
                </template>

                <template #display>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.options.sizes.sm')"
                        >
                            <BdSlider v-model="model.qrcodeSize" :min="100" :max="400" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                            :label="t('console-widgets.options.sizes.sm')"
                        >
                            <BdSlider v-model="model.margin" :min="0" :max="8" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.foregroundColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.foregroundColor"
                                size="md"
                                :placeholder="t('console-widgets.placeholders.selectColor')"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.bgColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.backgroundColor"
                                size="md"
                                :placeholder="t('console-widgets.common.bgColor')"
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
                            :label="t('console-widgets.pricingPlans.showTitle')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showTitle" size="md" />
                        </UFormField>

                        <UFormField
                            v-if="model.showTitle"
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
                    </div>
                </template>

                <template #logo>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.show')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showLogo" size="md" />
                        </UFormField>

                        <template v-if="model.showLogo">
                            <UFormField
                                size="xs"
                                :label="t('console-widgets.labels.logoImage')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160 flex justify-end',
                                }"
                            >
                                <BdUploader
                                    v-model="model.logoSrc"
                                    class="size-20"
                                    icon="i-lucide-upload"
                                    accept=".jpg,.png,.jpeg,.svg"
                                    text=" "
                                    :maxCount="1"
                                    :maxSize="5"
                                    :single="true"
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
                                :label="t('console-widgets.options.sizes.sm')"
                            >
                                <BdSlider v-model="model.logoSize" :min="20" :max="80" size="md" />
                            </UFormField>
                        </template>
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
                            :label="t('console-widgets.labels.containerBg')"
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

<style lang="scss" scoped>
.property-groups-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 16px;
    padding: 8px;
    background-color: #f9fafb;
    border-radius: 8px;

    .group-nav-item {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 6px 10px;
        font-size: 12px;
        color: #6b7280;
        background-color: transparent;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
            background-color: #e5e7eb;
            color: #374151;
        }

        &.active {
            background-color: #3b82f6;
            color: #ffffff;
        }

        .nav-icon {
            width: 14px;
            height: 14px;
        }

        .nav-text {
            white-space: nowrap;
        }
    }
}

.property-content {
    .property-group {
        .group-title {
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
            margin: 0 0 16px 0;
            padding-bottom: 8px;
            border-bottom: 1px solid #e5e7eb;
        }

        .form-item {
            margin-bottom: 16px;

            .form-label {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                font-weight: 500;
                color: #374151;
                margin-bottom: 6px;
            }

            .form-help {
                font-size: 11px;
                color: #6b7280;
                margin-top: 4px;
                margin-bottom: 0;
                line-height: 1.4;
            }

            .range-value {
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                margin-top: 4px;
            }

            .logo-preview {
                margin-top: 8px;
                padding: 8px;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                background-color: #f9fafb;

                .preview-image {
                    max-width: 60px;
                    max-height: 60px;
                    object-fit: contain;
                    border-radius: 4px;
                }
            }
        }
    }
}
</style>
