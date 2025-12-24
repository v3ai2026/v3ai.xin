import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 图片魔方布局类型
 */
export type ImageCubeLayoutType =
    | "one-row-one" // 一行一个
    | "one-row-two" // 一行两个
    | "one-row-three" // 一行三个
    | "left-one-right-two" // 左一右二
    | "left-two-right-one" // 左二右一
    | "top-one-bottom-two" // 上一下二
    | "top-two-bottom-one"; // 上二下一

/**
 * 图片项接口
 */
export interface ImageItem {
    /** 图片地址 */
    image: string;
    /** 链接地址 */
    to: LinkItem;
}

/**
 * 图片魔方组件属性接口
 */
export interface Props {
    /** 布局类型 */
    layoutType: ImageCubeLayoutType;
    /** 图片列表 */
    images: ImageItem[];
    /** 样式配置 */
    style: {
        /** 底部背景色 */
        rootBgColor: string;
        /** 上内边距 */
        paddingTop: number;
        /** 右内边距 */
        paddingRight: number;
        /** 下内边距 */
        paddingBottom: number;
        /** 左内边距 */
        paddingLeft: number;
        /** 上圆角 */
        borderRadiusTop: number;
        /** 下圆角 */
        borderRadiusBottom: number;
        /** 图片圆角 */
        imageRadius: number;
        /** 图片间距 */
        imageGap: number;
    };
}

/**
 * 图片魔方组件配置
 */
export const imageCubeConfig: ComponentMenuItem<Props> = {
    id: "f8a3b5c7-d9e1-4f2a-8c6b-7d8e9f0a1b2c",
    type: "image-cube",
    title: "console-widgets.components.imageCube",
    icon: Icon,
    isHidden: false,
    category: {
        id: "extension",
        title: "console-widgets.categories.extension",
    },
    size: {
        width: 500,
        height: 300,
        widthMode: "percent",
        heightMode: "percent",
    },
    order: 5,
    props: {
        layoutType: "one-row-two",
        images: [
            {
                image: "https://freebuildai.yixiangonline.com/uploads/images/20250224/20250224150646e13cb4518.jpeg",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
            },
            {
                image: "https://freebuildai.yixiangonline.com/uploads/images/20250224/20250224150646e13cb4518.jpeg",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
            },
        ],
        style: {
            rootBgColor: "#FFFFFF",
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
            imageRadius: 0,
            imageGap: 0,
        },
    },
};
