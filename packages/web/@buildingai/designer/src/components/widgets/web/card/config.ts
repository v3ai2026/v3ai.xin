import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 卡片组件类型配置
 */
export interface Props {
    /** 卡片标题 */
    title: string;
    /** 卡片副标题 */
    subtitle: string;
    /** 卡片内容 */
    content: string;
    /** 头部图片 */
    image: string;
    /** 图片高度 */
    imageHeight: number;
    /** 是否显示图片 */
    showImage: boolean;
    /** 按钮文本 */
    buttonText: string;
    /** 是否显示按钮 */
    showButton: boolean;
    /** 按钮颜色 */
    buttonColor: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
    /** 按钮变体 */
    buttonVariant: "solid" | "outline" | "soft" | "ghost" | "link";
    /** 卡片链接 */
    to: LinkItem;
    /** 阴影大小 */
    shadow: "none" | "sm" | "md" | "lg" | "xl";
    /** 边框宽度 */
    borderWidth: number;
    /** 边框颜色 */
    borderColor: string;
    /** 圆角大小 */
    borderRadius: number;
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
    };
}

/**
 * 卡片组件配置
 */
export const cardConfig: ComponentMenuItem<Props> = {
    id: "af2g5h7e-6g8d-7e9f-bg2g-4d5e6f7g8h9i",
    type: "card",
    title: "console-widgets.components.card",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 300,
        height: 400,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 6,
    props: {
        title: "卡片标题",
        subtitle: "卡片副标题",
        content:
            "这是一个卡片组件的描述内容，可以包含任意文本信息。支持多行文本显示和自定义样式配置。",
        image: "",
        imageHeight: 140,
        showImage: true,
        buttonText: "了解更多",
        showButton: true,
        buttonColor: "primary",
        buttonVariant: "solid",
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        shadow: "md",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        style: {
            rootBgColor: "",
            bgColor: "#ffffff",
            paddingTop: 20,
            paddingRight: 20,
            paddingBottom: 20,
            paddingLeft: 20,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
        },
    },
};
