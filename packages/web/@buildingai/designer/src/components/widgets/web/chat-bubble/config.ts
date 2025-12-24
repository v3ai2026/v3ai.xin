import Icon from "./images/icon.png";

/**
 * 单个聊天气泡组件类型配置
 */
export interface Props {
    /** 消息内容 */
    content: string;
    /** 发送者角色 */
    role: "user" | "assistant";
    /** 发送者名称 */
    sender: string;
    /** 发送者头像 */
    avatar: string;
    /** 是否显示头像 */
    showAvatar: boolean;
    /** 是否显示发送者名称 */
    showSender: boolean;
    /** 气泡位置 */
    position: "left" | "right";
    /** 最大宽度百分比 */
    maxWidthPercent: number;
    /** 字体大小 */
    fontSize: number;
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
        /** 气泡样式 */
        bubbleBg: string;
        bubbleTextColor: string;
        bubbleRadius: number;
        bubblePaddingX: number;
        bubblePaddingY: number;
        /** 头像尺寸 */
        avatarSize: number;
        /** 发送者名称颜色 */
        senderNameColor: string;
    };
}

/**
 * 单个聊天气泡组件配置
 */
export const singleChatBubbleConfig: ComponentMenuItem<Props> = {
    id: "s1n61e-ch4t-bu88-1e9a-2c3d4e5f6a7b",
    type: "chat-bubble",
    title: "console-widgets.components.chatBubble",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 350,
        height: 80,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 14,
    props: {
        content: "这是一条聊天消息，可以包含多行文本内容。",
        role: "user",
        sender: "用户",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        showAvatar: true,
        showSender: true,
        position: "right",
        maxWidthPercent: 80,
        fontSize: 14,
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
            /** 气泡样式 */
            bubbleBg: "#3b82f6",
            bubbleTextColor: "#ffffff",
            bubbleRadius: 12,
            bubblePaddingX: 16,
            bubblePaddingY: 12,
            /** 头像尺寸 */
            avatarSize: 36,
            /** 发送者名称颜色 */
            senderNameColor: "#64748b",
        },
    },
};
