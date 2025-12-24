import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 渐变按钮组件类型配置
 */
export interface Props {
    /** 边框宽度 */
    borderWidth: number;
    /** 渐变颜色数组 */
    colors: string[];
    /** 链接地址 */
    to: LinkItem;
    /** 动画持续时间（毫秒） */
    duration: number;
    /** 边框圆角半径 */
    borderRadius: number;
    /** 模糊强度 */
    blur: number;
    /** 自定义类名 */
    class: string;
    /** 按钮背景色 */
    bgColor: string;
    /** 按钮文本 */
    label: string;
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
 * 渐变按钮组件配置
 */
export const gradientButtonConfig: ComponentMenuItem<Props> = {
    id: "gradient-button-widget",
    type: "gradient-button",
    title: "console-widgets.components.gradientButton",
    icon: Icon,
    isHidden: false,
    category: {
        id: "advanced",
        title: "console-widgets.categories.advanced",
    },
    size: {
        width: 140,
        height: 60,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 100,
    props: {
        borderWidth: 2,
        colors: [
            "#FF0000",
            "#FFA500",
            "#FFFF00",
            "#008000",
            "#0000FF",
            "#4B0082",
            "#EE82EE",
            "#FF0000",
        ],
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        duration: 2500,
        borderRadius: 8,
        blur: 4,
        class: "",
        bgColor: "var(--background)",
        label: "渐变按钮",
        style: {
            rootBgColor: "",
            bgColor: "",
            paddingTop: 8,
            paddingRight: 16,
            paddingBottom: 8,
            paddingLeft: 16,
            borderRadiusTop: 6,
            borderRadiusBottom: 6,
        },
    },
};
