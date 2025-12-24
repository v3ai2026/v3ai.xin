<script lang="ts" setup>
/**
 * 网页组件属性编辑器
 * @description 用于编辑网页组件的属性，包括URL、设备类型、外壳等设置
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

// 设备类型选项
const deviceTypeOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.device.mobile"), value: "mobile" },
    { label: t("console-widgets.options.device.web"), value: "web" },
];

// 预设设备颜色
const deviceColorPresets: { label: string; value: string }[] = [
    { label: t("console-widgets.options.deviceColors.spaceBlack"), value: "#1d1d1f" },
    { label: t("console-widgets.options.deviceColors.silver"), value: "#f1f2f4" },
    { label: t("console-widgets.options.deviceColors.gold"), value: "#fad5a5" },
    { label: t("console-widgets.options.deviceColors.deepPurple"), value: "#5f3dc4" },
    { label: t("console-widgets.options.deviceColors.blue"), value: "#007aff" },
];
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    { label: t('console-widgets.sections.basic'), value: 'basic', slot: 'basic' },
                    {
                        label: t('console-widgets.sections.device'),
                        value: 'device',
                        slot: 'device',
                    },
                    {
                        label: t('console-widgets.sections.display'),
                        value: 'display',
                        slot: 'display',
                    },
                    {
                        label: t('console-widgets.sections.interaction'),
                        value: 'interaction',
                        slot: 'interaction',
                    },
                ]"
                :default-value="['basic', 'device', 'display', 'interaction']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #basic>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.options.variants.link')"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                            }"
                        >
                            <UTextarea
                                v-model="model.url"
                                placeholder="https://www.example.com"
                                size="md"
                                :rows="4"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #device>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.showDevice')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showFrame" size="md" />
                        </UFormField>

                        <template v-if="model.showFrame">
                            <UFormField
                                size="xs"
                                :label="t('console-widgets.labels.deviceType')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <USelectMenu
                                    v-model="model.deviceType"
                                    :items="deviceTypeOptions"
                                    value-key="value"
                                    label-key="label"
                                    :ui="{ base: 'w-full' }"
                                    size="md"
                                />
                            </UFormField>

                            <UFormField
                                v-if="model.deviceType === 'mobile'"
                                size="xs"
                                :label="t('console-widgets.labels.deviceColor')"
                                class="flex w-full justify-between"
                                :ui="{
                                    wrapper: 'flex',
                                    label: 'text-muted',
                                    container: 'width160',
                                }"
                            >
                                <BdColorPicker
                                    v-model="model.deviceColor"
                                    size="md"
                                    :placeholder="t('console-widgets.placeholders.selectColor')"
                                />
                            </UFormField>

                            <div v-if="model.deviceType === 'mobile'" class="space-y-2">
                                <label class="text-muted text-xs">{{
                                    t("console-widgets.labels.presetColors")
                                }}</label>
                                <div class="flex flex-wrap gap-2">
                                    <button
                                        v-for="preset in deviceColorPresets"
                                        :key="preset.value"
                                        :style="{ backgroundColor: preset.value }"
                                        :class="[
                                            'h-8 w-8 rounded-full border-2 transition-all',
                                            model.deviceColor === preset.value
                                                ? 'scale-110 border-blue-500'
                                                : 'border-muted hover:border-gray-400',
                                        ]"
                                        :title="preset.label"
                                        @click="model.deviceColor = preset.value"
                                    />
                                </div>
                            </div>
                        </template>
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
                            :label="t('console-widgets.labels.scale')"
                        >
                            <BdSlider
                                v-model="model.scale"
                                :min="0.5"
                                :max="2"
                                :step="0.1"
                                size="md"
                            />
                        </UFormField>
                        <div class="text-accent-foreground text-xs">
                            {{ t("console-widgets.messages.currentScale", { scale: model.scale }) }}
                        </div>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.loadingText')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput
                                v-model="model.loadingText"
                                :placeholder="t('console-widgets.webpage.loadingDefault')"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #interaction>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.allowInteraction')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.interactive" size="md" />
                        </UFormField>
                        <div class="text-accent-foreground text-xs">
                            {{ t("console-widgets.messages.interactionTip") }}
                        </div>
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
