import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 交互按钮组件类型配置
 */
export interface Props {
    /** 按钮文字 */
    text: string;
    /** 链接地址 */
    to: LinkItem;
    /** 自定义类名 */
    class: string;
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
 * 交互按钮组件配置
 */
export const interactiveButtonConfig: ComponentMenuItem<Props> = {
    id: "interactive-button-widget",
    type: "interactive-button",
    title: "console-widgets.components.interactiveButton",
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
    order: 101,
    props: {
        text: "Button",
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        class: "",
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
