import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 闪光按钮组件类型配置
 */
export interface Props {
    /** 按钮文字 */
    text: string;
    /** 链接地址 */
    to: LinkItem;
    /** 自定义类名 */
    class: string;
    /** 闪光颜色 */
    shimmerColor: string;
    /** 闪光大小 */
    shimmerSize: string;
    /** 边框圆角 */
    borderRadius: string;
    /** 闪光动画时长 */
    shimmerDuration: string;
    /** 按钮背景色 */
    background: string;
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
 * 闪光按钮组件配置
 */
export const shimmerButtonConfig: ComponentMenuItem<Props> = {
    id: "shimmer-button-widget",
    type: "shimmer-button",
    title: "console-widgets.components.shimmerButton",
    icon: Icon,
    isHidden: false,
    category: {
        id: "advanced",
        title: "console-widgets.categories.advanced",
    },
    size: {
        width: 200,
        height: 70,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 103,
    props: {
        text: "Shimmer Button",
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        class: "",
        shimmerColor: "var(--background)",
        shimmerSize: "4px",
        borderRadius: "100px",
        shimmerDuration: "3s",
        background: "var(--foreground)",
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
