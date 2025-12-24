import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 页面区块组件类型配置
 * @description 响应式页面区块组件，支持标题、描述、功能列表、链接等内容展示
 */

/** 功能项配置 */
export interface FeatureItem {
    /** 功能ID */
    id: string;
    /** 功能标题 */
    title: string;
    /** 功能描述 */
    description: string;
    /** 功能图标 */
    icon: string;
    /** 功能链接 */
    to?: LinkItem;
}

/** 链接项配置 */
export interface LinkItems {
    /** 链接ID */
    id: string;
    /** 链接文本 */
    label: string;
    /** 链接地址 */
    to: LinkItem;
    /** 链接图标 */
    icon?: string;
    /** 尾随图标 */
    trailingIcon?: string;
    /** 链接颜色 */
    color: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
    /** 链接变体 */
    variant: "solid" | "outline" | "soft" | "ghost" | "link" | "subtle";
}

export interface Props {
    /** 标题 */
    title: string;
    /** 描述 */
    description: string;
    /** 副标题 */
    headline: string;
    /** 图标 */
    icon: string;
    /** 是否显示标题 */
    showTitle: boolean;
    /** 是否显示描述 */
    showDescription: boolean;
    /** 是否显示副标题 */
    showHeadline: boolean;
    /** 是否显示图标 */
    showIcon: boolean;
    /** 功能列表 */
    features: FeatureItem[];
    /** 是否显示功能列表 */
    showFeatures: boolean;
    /** 链接列表 */
    links: LinkItems[];
    /** 是否显示链接列表 */
    showLinks: boolean;
    /** 布局方向 */
    orientation: "vertical" | "horizontal";
    /** 是否反向布局 */
    reverse: boolean;
    /** 图片配置 */
    /** 是否显示图片 */
    showImage: boolean;
    /** 图片URL */
    imageUrl: string;
    /** 图片替代文本 */
    imageAlt: string;
    /** 图片宽度 */
    imageWidth: number;
    /** 图片高度 */
    imageHeight: number;
    /** 功能列表样式配置 */
    /** 是否显示功能项边框 */
    showFeatureBorder: boolean;
    /** 功能项阴影 */
    featureShadow: "none" | "sm" | "md" | "lg" | "xl";
    /** 功能项悬停阴影 */
    featureShadowHover: "none" | "sm" | "md" | "lg" | "xl";
    /** 间距配置 */
    /** 区块间距 */
    sectionGap: number;
    /** 功能列表间距 */
    featuresGap: number;
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
 * 页面区块组件配置
 */
export const pageSectionConfig: ComponentMenuItem<Props> = {
    id: "page-section-001",
    type: "page-section",
    title: "console-widgets.components.pageSection",
    icon: Icon,
    isHidden: false,
    category: {
        id: "extension",
        title: "console-widgets.categories.expand",
    },
    size: {
        width: 960,
        height: 600,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 22,
    props: {
        title: "Beautiful Vue UI components",
        description:
            "Nuxt UI provides a comprehensive suite of components and utilities to help you build beautiful and accessible web applications with Vue and Nuxt.",
        headline: "Features",
        icon: "i-lucide-rocket",
        showTitle: true,
        showDescription: true,
        showHeadline: true,
        showIcon: false,
        features: [
            {
                id: "icons",
                title: "Icons",
                description:
                    "Nuxt UI integrates with Nuxt Icon to access over 200,000+ icons from Iconify.",
                icon: "i-lucide-smile",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
            },
            {
                id: "fonts",
                title: "Fonts",
                description:
                    "Nuxt UI integrates with Nuxt Fonts to provide plug-and-play font optimization.",
                icon: "i-lucide-a-large-small",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
            },
            {
                id: "color-mode",
                title: "Color Mode",
                description:
                    "Nuxt UI integrates with Nuxt Color Mode to switch between light and dark.",
                icon: "i-lucide-sun-moon",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
            },
        ],
        showFeatures: true,
        links: [
            {
                id: "get-started",
                label: "Get started",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
                icon: "i-lucide-square-play",
                color: "neutral",
                variant: "solid",
            },
            {
                id: "explore",
                label: "Explore components",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
                color: "neutral",
                variant: "subtle",
                trailingIcon: "i-lucide-arrow-right",
            },
        ],
        showLinks: true,
        orientation: "vertical",
        reverse: false,
        // 图片配置
        showImage: false,
        imageUrl: "",
        imageAlt: "",
        imageWidth: 500,
        imageHeight: 300,
        // 功能列表样式配置
        showFeatureBorder: true,
        featureShadow: "none",
        featureShadowHover: "md",
        // 间距配置
        sectionGap: 16,
        featuresGap: 32,
        style: {
            rootBgColor: "",
            bgColor: "transparent",
            paddingTop: 64,
            paddingRight: 40,
            paddingBottom: 64,
            paddingLeft: 40,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
        },
    },
};
