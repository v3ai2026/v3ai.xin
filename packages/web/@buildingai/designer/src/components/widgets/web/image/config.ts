import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 图片组件类型配置
 */
export interface Props {
    /** 图片地址 */
    src: string;
    /** 替代文本 */
    alt: string;
    /** 图片适应方式 */
    objectFit: "cover" | "contain" | "fill" | "scale-down" | "none";
    /** 圆角大小 */
    borderRadius: number;
    /** 透明度 */
    opacity: number;
    /** 是否启用懒加载 */
    lazy: boolean;
    /** 链接地址 */
    to: LinkItem;
    /** 图片标题 */
    title: string;
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
 * 图片组件配置
 */
export const imageConfig: ComponentMenuItem<Props> = {
    id: "8d0e3f5c-4e6b-5c7d-9f0e-2b3c4d5e6f7g",
    type: "image",
    title: "console-widgets.components.image",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 200,
        height: 150,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 4,
    props: {
        src: "",
        alt: "示例图片",
        objectFit: "cover",
        borderRadius: 8,
        opacity: 1,
        lazy: true,
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        title: "",
        style: {
            rootBgColor: "",
            bgColor: "",
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
        },
    },
};
