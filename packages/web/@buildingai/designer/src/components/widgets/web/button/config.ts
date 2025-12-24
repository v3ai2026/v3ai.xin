import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 按钮组件类型配置
 */
export interface Props {
    /** 按钮文本 */
    label: string;
    /** 按钮颜色 */
    color: "primary" | "secondary" | "success" | "info" | "warning" | "error" | "neutral";
    /** 按钮变体 */
    variant: "solid" | "outline" | "soft" | "subtle" | "ghost" | "link";
    /** 按钮尺寸 */
    buttonSize: "xs" | "sm" | "md" | "lg" | "xl";
    /** 是否禁用 */
    disabled: boolean;
    /** 是否为块级按钮 */
    block: boolean;
    /** 是否为正方形按钮 */
    square: boolean;
    /** 左侧图标 */
    leadingIcon: string;
    /** 右侧图标 */
    trailingIcon: string;
    /** 链接地址 */
    to: LinkItem;
    /** 字体大小 */
    fontSize: number;
    /** 字体粗细 */
    fontWeight: number;
    /** 文本颜色 */
    textColor: string;
    /** 边框宽度 */
    borderWidth: number;
    /** 边框颜色 */
    borderColor: string;
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
 * 按钮组件配置
 */
export const buttonConfig: ComponentMenuItem<Props> = {
    id: "5f8d1e3a-2b4c-4d6e-8f9a-1c2d3e4f5a6b",
    type: "button",
    title: "console-widgets.components.button",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 120,
        height: 40,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 2,
    props: {
        label: "点击按钮",
        color: "primary",
        variant: "solid",
        buttonSize: "md",
        disabled: false,
        block: false,
        square: false,
        leadingIcon: "",
        trailingIcon: "",
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        fontSize: 14,
        fontWeight: 400,
        textColor: "",
        borderWidth: 0,
        borderColor: "",
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
