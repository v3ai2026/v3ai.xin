<script lang="ts" setup>
/**
 * 折叠面板组件属性编辑器
 * @description 用于编辑折叠面板组件的属性，包括面板项目管理、样式配置等
 */
import { useVModel } from "@vueuse/core";
import Draggable from "vuedraggable";

import WidgetsBaseProperty from "../../base/widgets-base-property.vue";
import type { AccordionItem, Props } from "./config";

const props = defineProps<{
    modelValue: Props;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: Props): void;
}>();

const model = useVModel(props, "modelValue", emit);

const { t } = useI18n();

// 面板类型选项
const typeOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.accordionType.single"), value: "single" },
    { label: t("console-widgets.options.accordionType.multiple"), value: "multiple" },
];

// 标签键名选项
const labelKeyOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.labels.label"), value: "label" },
    { label: t("console-widgets.labels.title"), value: "title" },
    { label: t("console-widgets.labels.name"), value: "name" },
];

/**
 * 添加新面板项目
 */
const addNewItem = () => {
    const newItem: AccordionItem = {
        value: `item-${Date.now()}`,
        label: `面板 ${model.value.items.length + 1}`,
        content: t("console-widgets.placeholders.panelContent"),
        disabled: false,
    };
    model.value.items.push(newItem);
};

/**
 * 删除面板项目
 */
const removeItem = (index: number) => {
    if (model.value.items.length > 1) {
        model.value.items.splice(index, 1);
    }
};

/**
 * 上移面板项目
 */
const moveItemUp = (index: number) => {
    if (index > 0) {
        const item = model.value.items.splice(index, 1)[0];
        if (item) {
            model.value.items.splice(index - 1, 0, item);
        }
    }
};

/**
 * 下移面板项目
 */
const moveItemDown = (index: number) => {
    if (index < model.value.items.length - 1) {
        const item = model.value.items.splice(index, 1)[0];
        if (item) {
            model.value.items.splice(index + 1, 0, item);
        }
    }
};
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    { label: t('console-widgets.sections.items'), value: 'items', slot: 'items' },
                    { label: t('console-widgets.sections.basic'), value: 'basic', slot: 'basic' },
                    {
                        label: t('console-widgets.sections.display'),
                        value: 'display',
                        slot: 'display',
                    },
                ]"
                :default-value="['items', 'basic', 'display']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #items>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 面板项目列表 -->
                        <div class="space-y-3">
                            <Draggable
                                class="draggable"
                                v-model="model.items"
                                animation="300"
                                handle=".drag-move"
                                itemKey="id"
                            >
                                <template v-slot:item="{ element: item, index }">
                                    <div class="bg-muted mb-3 space-y-3 rounded-lg p-3">
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center gap-2">
                                                <UButton
                                                    color="neutral"
                                                    variant="soft"
                                                    size="xs"
                                                    icon="i-lucide-hand"
                                                    class="drag-move"
                                                />
                                                <span
                                                    class="text-muted-foreground text-sm font-medium"
                                                >
                                                    {{ t("console-widgets.labels.label") }}
                                                    {{ index + 1 }}
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <UButton
                                                    variant="ghost"
                                                    size="xs"
                                                    icon="i-heroicons-arrow-up"
                                                    :disabled="index === 0"
                                                    @click="moveItemUp(index)"
                                                />
                                                <UButton
                                                    variant="ghost"
                                                    size="xs"
                                                    icon="i-heroicons-arrow-down"
                                                    :disabled="index === model.items.length - 1"
                                                    @click="moveItemDown(index)"
                                                />
                                                <UButton
                                                    variant="ghost"
                                                    size="xs"
                                                    icon="i-heroicons-trash"
                                                    color="error"
                                                    :disabled="model.items.length <= 1"
                                                    @click="removeItem(index)"
                                                />
                                            </div>
                                        </div>

                                        <!-- 标识值 -->
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.labels.value')"
                                            class="flex w-full justify-between"
                                            :ui="{
                                                wrapper: 'flex',
                                                label: 'text-muted',
                                                container: 'width160',
                                            }"
                                        >
                                            <UInput
                                                v-model="item.value"
                                                :placeholder="
                                                    t('console-widgets.placeholders.uniqueValue')
                                                "
                                                size="md"
                                            />
                                        </UFormField>

                                        <!-- 面板标题 -->
                                        <UFormField
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
                                                v-model="item.label"
                                                :placeholder="
                                                    t('console-widgets.placeholders.panelTitle')
                                                "
                                                size="md"
                                            />
                                        </UFormField>

                                        <!-- 面板内容 -->
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.labels.content')"
                                            class="flex w-full justify-between"
                                            :ui="{
                                                wrapper: 'flex',
                                                label: 'text-muted',
                                                container: 'width160',
                                            }"
                                        >
                                            <UTextarea
                                                v-model="item.content"
                                                :placeholder="
                                                    t('console-widgets.placeholders.panelContent')
                                                "
                                                :rows="3"
                                                size="md"
                                            />
                                        </UFormField>

                                        <!-- 左侧图标 -->
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.button.leadingIcon')"
                                            class="flex w-full justify-between"
                                            :ui="{
                                                wrapper: 'flex',
                                                label: 'text-muted',
                                                container: 'width160',
                                            }"
                                        >
                                            <IconPicker v-model="item.icon" size="md" />
                                        </UFormField>

                                        <!-- 禁用状态 -->
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.button.disabled')"
                                            class="flex w-full justify-between"
                                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                                        >
                                            <USwitch v-model="item.disabled" size="md" />
                                        </UFormField>
                                    </div>
                                </template>
                            </Draggable>
                        </div>

                        <!-- 添加面板按钮 -->
                        <UButton
                            variant="outline"
                            size="md"
                            icon="i-heroicons-plus"
                            block
                            @click="addNewItem"
                        >
                            {{ t("console-widgets.labels.addPanel") }}
                        </UButton>
                    </div>
                </template>

                <template #basic>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.type')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.type"
                                :items="typeOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.label')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.labelKey"
                                :items="labelKeyOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.button.trailingIcon')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <IconPicker v-model="model.trailingIcon" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #display>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.enable')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.collapsible" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.button.disabled')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.disabled" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.enable')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.unmountOnHide" size="md" />
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
                    {
                        label: t('console-widgets.sections.style'),
                        value: 'content',
                        slot: 'content',
                    },
                ]"
                :default-value="['background', 'padding', 'radius', 'content']"
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
                            :label="t('console-widgets.common.componentBgColor')"
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

                <template #content>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.contentBackground')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.contentBgColor"
                                size="md"
                                :placeholder="t('console-widgets.common.bgColor')"
                                alpha
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.labels.contentTextColor')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.contentTextColor"
                                size="md"
                                :placeholder="t('console-widgets.common.textColor')"
                                alpha
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
                            :label="t('console-widgets.common.paddingTop')"
                        >
                            <BdSlider
                                v-model="model.style.contentPaddingTop"
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
                                v-model="model.style.contentPaddingRight"
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
                                v-model="model.style.contentPaddingBottom"
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
                                v-model="model.style.contentPaddingLeft"
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
