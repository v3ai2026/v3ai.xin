<script lang="ts" setup>
/**
 * 单个聊天气泡组件属性编辑器
 * @description 用于编辑单个聊天气泡组件的属性，包括内容、角色、样式等配置
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

// 角色选项
const roleOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.roleTypes.user"), value: "user" },
    { label: t("console-widgets.options.roleTypes.assistant"), value: "assistant" },
];

// 位置选项
const positionOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.bubblePosition.left"), value: "left" },
    { label: t("console-widgets.options.bubblePosition.right"), value: "right" },
];

/**
 * 生成默认头像
 */
const generateAvatar = (role: string, sender?: string): string => {
    const seed = sender || role;
    if (role === "assistant") {
        return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
    } else {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
    }
};

/**
 * 根据角色设置默认样式
 */
const setRoleDefaults = () => {
    if (model.value.role === "user") {
        model.value.style.bubbleBg = "#3b82f6";
        model.value.style.bubbleTextColor = "#ffffff";
        model.value.sender = t("console-widgets.options.roleTypes.user");
        model.value.position = "right";
    } else {
        model.value.style.bubbleBg = "#f1f5f9";
        model.value.style.bubbleTextColor = "#334155";
        model.value.sender = t("console-widgets.options.roleTypes.assistant");
        model.value.position = "left";
    }
    model.value.avatar = generateAvatar(model.value.role, model.value.sender);
};
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    { label: t('console-widgets.sections.basic'), value: 'basic', slot: 'basic' },
                    {
                        label: t('console-widgets.sections.display'),
                        value: 'display',
                        slot: 'display',
                    },
                    {
                        label: t('console-widgets.sections.layout'),
                        value: 'layout',
                        slot: 'layout',
                    },
                ]"
                :default-value="['basic', 'display', 'layout']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #basic>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 消息内容 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.messageContent')"
                            required
                        >
                            <UTextarea
                                v-model="model.content"
                                :placeholder="t('console-widgets.chatBubble.messageContent')"
                                :rows="3"
                                size="md"
                                :ui="{ root: 'w-full' }"
                            />
                        </UFormField>

                        <!-- 角色类型 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.roleType')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <USelectMenu
                                v-model="model.role"
                                :items="roleOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                                @update:model-value="setRoleDefaults"
                            />
                        </UFormField>

                        <!-- 发送者名称 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.senderName')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <UInput
                                v-model="model.sender"
                                :placeholder="t('console-widgets.chatBubble.senderName')"
                                size="md"
                            />
                        </UFormField>

                        <!-- 头像地址 -->
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.avatarUrl')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <div class="flex items-end justify-end gap-2">
                                <BdUploader
                                    v-model="model.avatar"
                                    class="size-16"
                                    icon="i-lucide-upload"
                                    accept=".jpg,.png,.jpeg,.webp"
                                    text=" "
                                    :maxCount="1"
                                    :single="true"
                                />
                                <UButton
                                    size="md"
                                    variant="outline"
                                    @click="model.avatar = generateAvatar(model.role, model.sender)"
                                >
                                    {{ t("console-widgets.actions.add") }}
                                </UButton>
                            </div>
                        </UFormField>
                    </div>
                </template>

                <template #display>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.showAvatar')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showAvatar" size="md" />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.showSender')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted' }"
                        >
                            <USwitch v-model="model.showSender" size="md" />
                        </UFormField>
                    </div>
                </template>

                <template #layout>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.bubblePosition')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.position"
                                :items="positionOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.width')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdSlider
                                v-model="model.maxWidthPercent"
                                :min="40"
                                :max="100"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.fontSize')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdSlider v-model="model.fontSize" :min="12" :max="20" size="md" />
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
                        label: t('console-widgets.sections.padding'),
                        value: 'content-padding',
                        slot: 'content-padding',
                    },
                    {
                        label: t('console-widgets.sections.radius'),
                        value: 'radius',
                        slot: 'radius',
                    },
                    {
                        label: t('console-widgets.sections.bubble'),
                        value: 'bubble',
                        slot: 'bubble',
                    },
                    {
                        label: t('console-widgets.sections.display'),
                        value: 'elements',
                        slot: 'elements',
                    },
                ]"
                :default-value="['background', 'bubble', 'elements']"
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

                <template #content-padding>
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
                                v-model="model.style.bubbleRadius"
                                :min="0"
                                :max="30"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #bubble>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.bgColor')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdColorPicker
                                v-model="model.style.bubbleBg"
                                size="md"
                                :placeholder="t('console-widgets.common.bgColor')"
                                alpha
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.textColor')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdColorPicker
                                v-model="model.style.bubbleTextColor"
                                size="md"
                                :placeholder="t('console-widgets.common.textColor')"
                                alpha
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.horizontalPadding')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdSlider
                                v-model="model.style.bubblePaddingX"
                                :min="8"
                                :max="32"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.verticalPadding')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdSlider
                                v-model="model.style.bubblePaddingY"
                                :min="6"
                                :max="24"
                                size="md"
                            />
                        </UFormField>
                    </div>
                </template>

                <template #elements>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <UFormField
                            size="xs"
                            :label="t('console-widgets.common.size')"
                            class="flex w-full justify-between"
                            :ui="{
                                wrapper: 'flex',
                                label: 'text-muted',
                                container: 'width160',
                            }"
                        >
                            <BdSlider
                                v-model="model.style.avatarSize"
                                :min="24"
                                :max="64"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            size="xs"
                            :label="t('console-widgets.chatBubble.senderName')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <BdColorPicker
                                v-model="model.style.senderNameColor"
                                size="md"
                                :placeholder="t('console-widgets.chatBubble.senderName')"
                                alpha
                            />
                        </UFormField>
                    </div>
                </template>
            </UAccordion>
        </template>
    </WidgetsBaseProperty>
</template>
