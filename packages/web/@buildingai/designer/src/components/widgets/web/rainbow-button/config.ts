import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 彩虹按钮组件类型配置
 */
export interface Props {
    /** 按钮文字 */
    text: string;
    /** 链接地址 */
    to: LinkItem;
    /** 自定义类名 */
    class: string;
    /** HTML标签类型 */
    is: string;
    /** 动画速度（秒） */
    speed: number;
    /** 文字颜色 */
    textColor: string;
    /** 按钮背景色 */
    buttonBgColor: string;
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
 * 彩虹按钮组件配置
 */
export const rainbowButtonConfig: ComponentMenuItem<Props> = {
    id: "rainbow-button-widget",
    type: "rainbow-button",
    title: "console-widgets.components.rainbowButton",
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
    order: 102,
    props: {
        text: "Button",
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        class: "",
        is: "button",
        speed: 2,
        textColor: "var(--background)",
        buttonBgColor: "var(--foreground)",
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
