import Icon from "./images/icon.png";

/**
 * 聊天消息类型
 */
export interface ChatMessage {
    /** 消息唯一ID */
    id: string;
    /** 消息内容 */
    content: string;
    /** 发送者角色 */
    role: "user" | "assistant";
    /** 发送者名称 */
    sender?: string;
    /** 发送者头像 */
    avatar?: string;
}

/**
 * 聊天气泡组件类型配置
 */
export interface Props {
    /** 聊天消息数组 */
    messages: ChatMessage[];
    /** 是否显示头像 */
    showAvatar: boolean;
    /** 是否显示发送者名称 */
    showSender: boolean;
    /** 消息对齐方式 */
    alignment: "separate" | "same-side";
    /** 当选择同一侧时的对齐位置 */
    sideAlignment: "left" | "right";
    /** 最大宽度百分比 */
    maxWidthPercent: number;
    /** 消息间距 */
    messageSpacing: number;
    /** 样式配置 */
    style: {
        rootBgColor: string;
        bgColor: string;
        paddingTop: number;
        paddingRight: number;
        paddingBottom: number;
        paddingLeft: number;
        borderRadiusTop: number;
        borderRadiusBottom: number;
        /** 内容边距 */
        contentPaddingTop: number;
        contentPaddingRight: number;
        contentPaddingBottom: number;
        contentPaddingLeft: number;
        /** 用户消息样式 */
        userBubbleBg: string;
        userTextColor: string;
        /** AI助手消息样式 */
        assistantBubbleBg: string;
        assistantTextColor: string;
        /** 头像尺寸 */
        avatarSize: number;
        /** 气泡圆角 */
        bubbleRadius: number;
        /** 发送者名称颜色 */
        senderNameColor: string;
    };
}

/**
 * 聊天气泡组件配置
 */
export const chatBubbleConfig: ComponentMenuItem<Props> = {
    id: "c8h4t1b5-2u7b-4b1e-9c8h-1a2t3b4u5b6l",
    type: "chat-bubbles",
    title: "console-widgets.components.chatBubbles",
    icon: Icon,
    isHidden: false,
    category: {
        id: "extension",
        title: "console-widgets.categories.extension",
    },
    size: {
        width: 500,
        height: 400,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 13,
    props: {
        messages: [
            {
                id: "1",
                content: "你好！我是AI助手，很高兴为您服务。有什么可以帮助您的吗？",
                role: "assistant",
                sender: "AI助手",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ai",
            },
            {
                id: "2",
                content: "请帮我写一个Vue组件的示例代码",
                role: "user",
                sender: "用户",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
            },
            {
                id: "3",
                content:
                    "当然可以！这里是一个简单的Vue组件示例：\n\n```vue\n<template>\n  <div class=\"hello-world\">\n    <h1>{{ message }}</h1>\n    <button @click=\"updateMessage\">点击更新</button>\n  </div>\n</template>\n\n<script setup>\nimport { ref } from 'vue'\n\nconst message = ref('Hello, World!')\n\nconst updateMessage = () => {\n  message.value = '消息已更新！'\n}\n</script>\n```",
                role: "assistant",
                sender: "AI助手",
                avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ai",
            },
        ],
        showAvatar: true,
        showSender: true,
        alignment: "separate",
        sideAlignment: "left",
        maxWidthPercent: 80,
        messageSpacing: 12,
        style: {
            rootBgColor: "",
            bgColor: "#ffffff",
            paddingTop: 16,
            paddingRight: 16,
            paddingBottom: 16,
            paddingLeft: 16,
            borderRadiusTop: 12,
            borderRadiusBottom: 12,
            /** 内容边距 */
            contentPaddingTop: 8,
            contentPaddingRight: 8,
            contentPaddingBottom: 8,
            contentPaddingLeft: 8,
            /** 用户消息样式 */
            userBubbleBg: "#3b82f6",
            userTextColor: "#ffffff",
            /** AI助手消息样式 */
            assistantBubbleBg: "#f1f5f9",
            assistantTextColor: "#334155",
            /** 头像尺寸 */
            avatarSize: 32,
            /** 气泡圆角 */
            bubbleRadius: 8,
            /** 发送者名称颜色 */
            senderNameColor: "#64748b",
        },
    },
};
