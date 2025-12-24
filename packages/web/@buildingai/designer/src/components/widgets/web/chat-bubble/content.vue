<script lang="ts" setup>
/**
 * 单个聊天气泡组件
 * @description 显示单个聊天消息的气泡组件，支持头像、发送者名称和自定义样式
 */
import { computed, type CSSProperties } from "vue";

import WidgetsBaseContent from "../../base/widgets-base-content.vue";
import type { Props } from "./config";

const props = defineProps<Props>();

/**
 * 计算聊天容器样式
 */
const chatContainerStyle = computed<CSSProperties>(() => ({
    height: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: props.position === "right" ? "flex-end" : "flex-start",
    paddingTop: `${props.style.contentPaddingTop}px`,
    paddingRight: `${props.style.contentPaddingRight}px`,
    paddingBottom: `${props.style.contentPaddingBottom}px`,
    paddingLeft: `${props.style.contentPaddingLeft}px`,
}));

/**
 * 计算气泡样式
 */
const bubbleStyle = computed<CSSProperties>(() => ({
    backgroundColor: props.style.bubbleBg,
    color: props.style.bubbleTextColor,
    borderRadius: `${props.style.bubbleRadius}px`,
    paddingTop: `${props.style.bubblePaddingY}px`,
    paddingBottom: `${props.style.bubblePaddingY}px`,
    paddingLeft: `${props.style.bubblePaddingX}px`,
    paddingRight: `${props.style.bubblePaddingX}px`,
    maxWidth: `${props.maxWidthPercent}%`,
    fontSize: `${props.fontSize}px`,
    lineHeight: 1.5,
    wordBreak: "break-word",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
}));

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
    fontSize: `${props.fontSize - 2}px`,
}));

/**
 * 获取内容区域的布局方向
 */
const getContentFlexDirection = computed<"row" | "row-reverse">(() => {
    return props.position === "right" ? "row-reverse" : "row";
});

/**
 * 获取发送者名称的对齐方式
 */
const getSenderNameAlign = computed<string>(() => {
    return props.position === "right" ? "text-right" : "text-left";
});
</script>

<template>
    <WidgetsBaseContent
        :style="props.style"
        :override-bg-color="true"
        custom-class="single-chat-bubble-content"
    >
        <template #default="{ style }">
            <div :style="chatContainerStyle" class="relative">
                <!-- 聊天气泡容器 -->
                <div
                    class="flex max-w-full items-start gap-2"
                    :style="{ flexDirection: getContentFlexDirection }"
                >
                    <!-- 头像 -->
                    <div v-if="props.showAvatar && props.avatar" class="flex-none">
                        <NuxtImg
                            :src="props.avatar"
                            :alt="`${props.sender}的头像`"
                            :style="avatarStyle"
                            class="rounded-full border-2 border-white/90 object-cover shadow-sm"
                        />
                    </div>

                    <!-- 消息内容区域 -->
                    <div
                        class="flex min-w-0 flex-col"
                        :class="{
                            'items-end': props.position === 'right',
                            'items-start': props.position === 'left',
                        }"
                    >
                        <!-- 发送者名称 -->
                        <div
                            v-if="props.showSender && props.sender"
                            :style="senderNameStyle"
                            class="mb-1 px-1 text-xs font-medium"
                            :class="getSenderNameAlign"
                        >
                            {{ props.sender }}
                        </div>

                        <!-- 消息气泡 -->
                        <div
                            class="inline-block break-words transition-all duration-200 hover:shadow-md"
                            :style="bubbleStyle"
                        >
                            {{ props.content }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </WidgetsBaseContent>
</template>
