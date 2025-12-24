import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 价格计划列表组件类型配置
 * @description 用于展示多个价格方案的营销组件，支持动态添加和删除计划
 */

/** 单个价格计划配置 */
export interface PricingPlanItem {
    /** 计划ID */
    id: string;
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
    /** 热门标签颜色 */
    badgeColor: "primary" | "secondary" | "success" | "warning" | "error" | "neutral";
    /** 热门标签变体 */
    badgeVariant: "solid" | "outline" | "soft" | "ghost";
}

export interface Props {
    /** 价格计划列表 */
    plans: PricingPlanItem[];
    /** 列数 */
    columns: 1 | 2 | 3 | 4;
    /** 卡片间距 */
    gap: number;
    /** 整体标题 */
    title: string;
    /** 整体描述 */
    description: string;
    /** 是否显示标题 */
    showTitle: boolean;
    /** 是否显示描述 */
    showDescription: boolean;
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
 * 价格计划列表组件配置
 */
export const pricingPlansConfig: ComponentMenuItem<Props> = {
    id: "pricing-plans-001",
    type: "pricing-plans",
    title: "console-widgets.components.pricingPlans",
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
    order: 21,
    props: {
        plans: [
            {
                id: "basic",
                planName: "Basic",
                planDescription: "Perfect for individuals and small projects.",
                showPopularBadge: false,
                popularBadgeText: "",
                currentPrice: 99,
                originalPrice: 0,
                pricePeriod: "/month",
                currencySymbol: "$",
                features: ["1 developer", "Up to 5 projects", "Basic support", "Community access"],
                buttonText: "Get Started",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
                buttonColor: "neutral",
                buttonVariant: "outline",
                badgeColor: "primary",
                badgeVariant: "solid",
            },
            {
                id: "pro",
                planName: "Pro",
                planDescription: "For growing teams and businesses.",
                showPopularBadge: true,
                popularBadgeText: "Most popular",
                currentPrice: 199,
                originalPrice: 249,
                pricePeriod: "/month",
                currencySymbol: "$",
                features: [
                    "Up to 5 developers",
                    "Unlimited projects",
                    "Priority support",
                    "Advanced features",
                    "GitHub integration",
                ],
                buttonText: "Buy now",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
                buttonColor: "success",
                buttonVariant: "solid",
                badgeColor: "success",
                badgeVariant: "solid",
            },
            {
                id: "enterprise",
                planName: "Enterprise",
                planDescription: "For large organizations with custom needs.",
                showPopularBadge: false,
                popularBadgeText: "",
                currentPrice: 499,
                originalPrice: 0,
                pricePeriod: "/month",
                currencySymbol: "$",
                features: [
                    "Unlimited developers",
                    "Unlimited projects",
                    "24/7 premium support",
                    "Custom integrations",
                    "Dedicated account manager",
                    "SLA guarantee",
                ],
                buttonText: "Contact Sales",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
                buttonColor: "primary",
                buttonVariant: "solid",
                badgeColor: "primary",
                badgeVariant: "solid",
            },
        ],
        columns: 3,
        gap: 24,
        title: "Choose Your Plan",
        description: "Select the perfect plan for your needs. Upgrade or downgrade at any time.",
        showTitle: true,
        showDescription: true,
        shadow: "none",
        borderWidth: 0,
        borderColor: "#e5e7eb",
        borderRadius: 0,
        style: {
            rootBgColor: "",
            bgColor: "transparent",
            paddingTop: 40,
            paddingRight: 40,
            paddingBottom: 40,
            paddingLeft: 40,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
        },
    },
};
