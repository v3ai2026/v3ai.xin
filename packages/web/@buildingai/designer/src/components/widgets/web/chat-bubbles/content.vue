<script lang="ts" setup>
/**
 * 聊天气泡组件
 * @description 现代化的聊天界面组件，支持多种消息类型和样式自定义
 */
import { computed, type CSSProperties, nextTick, onMounted, ref, watch } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { ChatMessage, Props } from "./config";

const props = defineProps<Props>();

const chatContainerRef = ref<HTMLElement>();

/**
 * 计算聊天容器样式
 */
const chatContainerStyle = computed<CSSProperties>(() => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: `${props.messageSpacing}px`,
    overflowY: "auto",
    scrollBehavior: "smooth",
    paddingTop: `${props.style.contentPaddingTop}px`,
    paddingRight: `${props.style.contentPaddingRight}px`,
    paddingBottom: `${props.style.contentPaddingBottom}px`,
    paddingLeft: `${props.style.contentPaddingLeft}px`,
}));

/**
 * 计算消息气泡样式
 */
const getBubbleStyle = (message: ChatMessage): CSSProperties => {
    const baseStyle: CSSProperties = {
        borderRadius: `${props.style.bubbleRadius}px`,
        maxWidth: `${props.maxWidthPercent}%`,
    };

    // 根据角色设置不同样式
    switch (message.role) {
        case "user":
            return {
                ...baseStyle,
                backgroundColor: props.style.userBubbleBg,
                color: props.style.userTextColor,
            };
        case "assistant":
            return {
                ...baseStyle,
                backgroundColor: props.style.assistantBubbleBg,
                color: props.style.assistantTextColor,
            };
        default:
            return baseStyle;
    }
};

/**
 * 计算头像样式
 */
const avatarStyle = computed<CSSProperties>(() => ({
    width: `${props.style.avatarSize}px`,
    height: `${props.style.avatarSize}px`,
}));

/**
 * 计算发送者名称样式
 */
const senderNameStyle = computed<CSSProperties>(() => ({
    color: props.style.senderNameColor,
}));

/**
 * 获取消息容器类 - 决定整个消息在左侧还是右侧
 */
const getMessageContainerClass = (message: ChatMessage): string => {
    if (props.alignment === "separate") {
        return message.role === "user" ? "justify-end" : "justify-start";
    } else {
        return props.sideAlignment === "right" ? "justify-end" : "justify-start";
    }
};

/**
 * 获取消息内容区域的布局方向 - 决定头像和气泡的相对位置
 */
const getContentFlexDirection = (message: ChatMessage): "row" | "row-reverse" => {
    if (props.alignment === "separate") {
        // 两端对齐：用户消息头像在右侧，助手消息头像在左侧
        return message.role === "user" ? "row-reverse" : "row";
    } else {
        // 同一侧：根据选择的对齐方式
        return props.sideAlignment === "right" ? "row-reverse" : "row";
    }
};

/**
 * 获取发送者名称的对齐方式
 */
const getSenderNameAlign = (message: ChatMessage): string => {
    if (props.alignment === "separate") {
        return message.role === "user" ? "text-right" : "text-left";
    } else {
        return props.sideAlignment === "right" ? "text-right" : "text-left";
    }
};
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="chat-bubble-content"
    >
        <template #default="{ style }">
            <div ref="chatContainerRef" :style="chatContainerStyle" class="relative">
                <!-- 消息列表 -->
                <div
                    v-for="message in props.messages"
                    :key="message.id"
                    class="flex w-full"
                    :class="getMessageContainerClass(message)"
                >
                    <div
                        class="flex max-w-full"
                        :class="{
                            'gap-1': props.alignment === 'separate' && message.role === 'user',
                            'gap-2': !(props.alignment === 'separate' && message.role === 'user'),
                        }"
                        :style="{ flexDirection: getContentFlexDirection(message) }"
                    >
                        <!-- 头像 -->
                        <div v-if="props.showAvatar && message.avatar" class="flex-none">
                            <NuxtImg
                                :src="message.avatar"
                                :alt="`${message.sender || message.role}的头像`"
                                :style="avatarStyle"
                                class="rounded-full border-2 border-white/90 object-cover shadow-sm"
                            />
                        </div>

                        <!-- 消息内容区域 -->
                        <div
                            class="flex min-w-0 flex-1 flex-col"
                            :class="{
                                'items-end':
                                    props.alignment === 'separate' && message.role === 'user',
                            }"
                        >
                            <!-- 发送者名称 -->
                            <div
                                v-if="props.showSender && message.sender"
                                :style="senderNameStyle"
                                class="mb-1 text-xs font-medium"
                                :class="getSenderNameAlign(message)"
                            >
                                {{ message.sender }}
                            </div>

                            <!-- 消息气泡 -->
                            <div
                                class="inline-block px-4 py-3 text-sm leading-relaxed break-words shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                                :style="getBubbleStyle(message)"
                            >
                                {{ message.content }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>
