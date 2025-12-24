import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 价格计划组件类型配置
 * @description 用于展示价格方案的营销组件，包含标题、描述、价格、功能列表和行动按钮
 */
export interface Props {
    /** 计划名称 */
    planName: string;
    /** 计划描述 */
    planDescription: string;
    /** 是否显示热门标签 */
    showPopularBadge: boolean;
    /** 热门标签文本 */
    popularBadgeText: string;
    /** 当前价格 */
    currentPrice: number;
    /** 原价（如果有折扣） */
    originalPrice: number;
    /** 价格周期 */
    pricePeriod: string;
    /** 货币符号 */
    currencySymbol: string;
    /** 功能列表 */
    features: string[];
    /** 按钮文本 */
    buttonText: string;
    /** 按钮链接 */
    to: LinkItem;
    /** 按钮颜色 */
    buttonColor: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
    /** 按钮变体 */
    buttonVariant: "solid" | "outline" | "soft" | "ghost" | "link";
    /** 链接打开方式 */
    target: "_self" | "_blank" | "_parent" | "_top";
    /** 热门标签颜色 */
    badgeColor: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
    /** 热门标签变体 */
    badgeVariant: "solid" | "outline" | "soft" | "ghost";
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
 * 价格计划组件配置
 */
export const pricingPlanConfig: ComponentMenuItem<Props> = {
    id: "pricing-plan-001",
    type: "pricing-plan",
    title: "console-widgets.components.pricingPlan",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 320,
        height: 480,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 20,
    props: {
        planName: "Solo",
        planDescription: "For bootstrappers and indie hackers.",
        showPopularBadge: true,
        popularBadgeText: "Most popular",
        currentPrice: 199,
        originalPrice: 249,
        pricePeriod: "/month",
        currencySymbol: "$",
        features: [
            "One developer",
            "Unlimited projects",
            "Access to GitHub repository",
            "Unlimited patch & minor updates",
            "Lifetime access",
        ],
        buttonText: "Buy now",
        to: {
            type: "custom",
            name: "自定义链接",
            path: "",
            query: {},
        },
        target: "_self",
        buttonColor: "success",
        buttonVariant: "solid",
        badgeColor: "success",
        badgeVariant: "solid",
        shadow: "lg",
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 12,
        style: {
            rootBgColor: "",
            bgColor: "#ffffff",
            paddingTop: 24,
            paddingRight: 24,
            paddingBottom: 24,
            paddingLeft: 24,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
        },
    },
};
