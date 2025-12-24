<script lang="ts" setup>
/**
 * 聊天气泡组件属性编辑器
 * @description 用于编辑聊天气泡组件的属性，包括消息管理、显示设置、样式配置等
 */
import { useVModel } from "@vueuse/core";
import Draggable from "vuedraggable";

import WidgetsBaseProperty from "../../base/widgets-base-property.vue";
import type { ChatMessage, Props } from "./config";

const props = defineProps<{
    modelValue: Props;
}>();

const emit = defineEmits<{
    (e: "update:modelValue", value: Props): void;
}>();

const model = useVModel(props, "modelValue", emit);

const { t } = useI18n();

// 消息角色选项
const roleOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.roleTypes.user"), value: "user" },
    { label: t("console-widgets.options.roleTypes.assistant"), value: "assistant" },
];

// 对齐方式选项
const alignmentOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.layout.separate"), value: "separate" },
    { label: t("console-widgets.options.layout.sameSide"), value: "same-side" },
];

// 同一侧对齐位置选项
const sideAlignmentOptions: { label: string; value: string }[] = [
    { label: t("console-widgets.options.bubblePosition.left"), value: "left" },
    { label: t("console-widgets.options.bubblePosition.right"), value: "right" },
];

/**
 * 添加新消息
 */
const addNewMessage = () => {
    const newMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        content: t("console-widgets.placeholders.newMessageContent"),
        role: "user",
        sender: t("console-widgets.options.roleTypes.user"),
    };
    model.value.messages.push(newMessage);
};

/**
 * 删除消息
 */
const removeMessage = (index: number) => {
    if (model.value.messages.length > 1) {
        model.value.messages.splice(index, 1);
    }
};

/**
 * 上移消息
 */
const moveMessageUp = (index: number) => {
    if (index > 0) {
        const message = model.value.messages.splice(index, 1)[0];
        if (message) {
            model.value.messages.splice(index - 1, 0, message);
        }
    }
};

/**
 * 下移消息
 */
const moveMessageDown = (index: number) => {
    if (index < model.value.messages.length - 1) {
        const message = model.value.messages.splice(index, 1)[0];
        if (message) {
            model.value.messages.splice(index + 1, 0, message);
        }
    }
};

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
</script>

<template>
    <WidgetsBaseProperty>
        <template #content>
            <UAccordion
                :items="[
                    {
                        label: t('console-widgets.sections.management'),
                        value: 'messages',
                        slot: 'messages',
                    },
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
                :default-value="['messages', 'display', 'layout']"
                :unmountOnHide="false"
                type="multiple"
            >
                <template #messages>
                    <div class="w-full space-y-3 pb-4">
                        <!-- 消息列表 -->
                        <div class="space-y-3">
                            <Draggable
                                class="draggable"
                                v-model="model.messages"
                                animation="300"
                                handle=".drag-move"
                                itemKey="id"
                            >
                                <template v-slot:item="{ element: message, index }">
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
                                                    {{
                                                        t("console-widgets.chatBubbles.messageItem")
                                                    }}
                                                    {{ index + 1 }}
                                                </span>
                                            </div>
                                            <div class="flex items-center gap-1">
                                                <UButton
                                                    variant="ghost"
                                                    size="xs"
                                                    icon="i-heroicons-arrow-up"
                                                    :disabled="index === 0"
                                                    @click="moveMessageUp(index)"
                                                />
                                                <UButton
                                                    variant="ghost"
                                                    size="xs"
                                                    icon="i-heroicons-arrow-down"
                                                    :disabled="index === model.messages.length - 1"
                                                    @click="moveMessageDown(index)"
                                                />
                                                <UButton
                                                    variant="ghost"
                                                    size="xs"
                                                    icon="i-heroicons-trash"
                                                    color="error"
                                                    :disabled="model.messages.length <= 1"
                                                    @click="removeMessage(index)"
                                                />
                                            </div>
                                        </div>

                                        <!-- 消息内容 -->
                                        <UFormField
                                            size="xs"
                                            :label="t('console-widgets.chatBubble.messageContent')"
                                            class="flex w-full justify-between"
                                            :ui="{
                                                wrapper: 'flex',
                                                label: 'text-muted',
                                                container: 'width160',
                                            }"
                                        >
                                            <UTextarea
                                                v-model="message.content"
                                                :placeholder="
                                                    t('console-widgets.chatBubble.messageContent')
                                                "
                                                :rows="3"
                                                size="md"
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
                                                v-model="message.role"
                                                :items="roleOptions"
                                                value-key="value"
                                                label-key="label"
                                                :ui="{ base: 'w-full' }"
                                                size="md"
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
                                                v-model="message.sender"
                                                :placeholder="
                                                    t('console-widgets.chatBubble.senderName')
                                                "
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
                                                    v-model="message.avatar"
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
                                                    @click="
                                                        message.avatar = generateAvatar(
                                                            message.role,
                                                            message.sender,
                                                        )
                                                    "
                                                >
                                                    {{ t("console-widgets.labels.generate") }}
                                                </UButton>
                                            </div>
                                        </UFormField>
                                    </div>
                                </template>
                            </Draggable>
                        </div>

                        <!-- 添加消息按钮 -->
                        <UButton
                            variant="outline"
                            size="md"
                            icon="i-heroicons-plus"
                            block
                            @click="addNewMessage"
                        >
                            {{ t("console-widgets.labels.addMessage") }}
                        </UButton>
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
                            :label="t('console-widgets.common.textAlign')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.alignment"
                                :items="alignmentOptions"
                                value-key="value"
                                label-key="label"
                                :ui="{ base: 'w-full' }"
                                size="md"
                            />
                        </UFormField>

                        <UFormField
                            v-if="model.alignment === 'same-side'"
                            size="xs"
                            :label="t('console-widgets.labels.sameSidePosition')"
                            class="flex w-full justify-between"
                            :ui="{ wrapper: 'flex', label: 'text-muted', container: 'width160' }"
                        >
                            <USelectMenu
                                v-model="model.sideAlignment"
                                :items="sideAlignmentOptions"
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
                                :min="50"
                                :max="100"
                                size="md"
                            />
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
                            <BdSlider v-model="model.messageSpacing" :min="4" :max="24" size="md" />
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
                        label: t('console-widgets.sections.style'),
                        value: 'message',
                        slot: 'message',
                    },
                    {
                        label: t('console-widgets.sections.display'),
                        value: 'elements',
                        slot: 'elements',
                    },
                ]"
                :default-value="[
                    'background',
                    'padding',
                    'content-padding',
                    'radius',
                    'message',
                    'elements',
                ]"
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

                <template #message>
                    <div class="w-full space-y-3 px-1 pt-2 pb-4">
                        <!-- 用户消息样式 -->
                        <div class="space-y-3 border-b pb-3">
                            <h4 class="text-muted-foreground text-sm font-medium">
                                {{ t("console-widgets.labels.userMessage") }}
                            </h4>
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
                                    v-model="model.style.userBubbleBg"
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
                                    v-model="model.style.userTextColor"
                                    size="md"
                                    :placeholder="t('console-widgets.common.textColor')"
                                    alpha
                                />
                            </UFormField>
                        </div>

                        <!-- AI助手消息样式 -->
                        <div class="space-y-3">
                            <h4 class="text-muted-foreground text-sm font-medium">
                                {{ t("console-widgets.labels.aiMessage") }}
                            </h4>
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
                                    v-model="model.style.assistantBubbleBg"
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
                                    v-model="model.style.assistantTextColor"
                                    size="md"
                                    :placeholder="t('console-widgets.common.textColor')"
                                    alpha
                                />
                            </UFormField>
                        </div>
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
