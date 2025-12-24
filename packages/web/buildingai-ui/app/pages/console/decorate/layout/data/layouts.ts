import type { LayoutStyle, MenuItem } from "../types";

/**
 * 布局风格配置
 */
export const layoutStyles: LayoutStyle[] = [
    {
        id: "layout-1",
        name: "顶部导航1",
        component: "Layout1",
    },
    {
        id: "layout-2",
        name: "顶部导航2",
        component: "Layout2",
    },
    {
        id: "layout-3",
        name: "顶部导航3",
        component: "Layout3",
    },
    {
        id: "layout-4",
        name: "侧边导航1",
        component: "Layout4",
    },
    {
        id: "layout-5",
        name: "侧边导航2",
        component: "Layout5",
    },
];

/**
 * 默认菜单项配置
 */
export const defaultMenuItems: MenuItem[] = [
    {
        id: "1",
        title: "首页",
        link: {
            path: "/",
        },
        icon: "i-heroicons-home",
    },
    {
        id: "2",
        title: "产品",
        link: {
            path: "/products",
        },
        icon: "i-heroicons-squares-2x2",
        children: [
            {
                id: "2-1",
                title: "产品列表",
                link: {
                    path: "/products/list",
                },
                icon: "i-heroicons-list-bullet",
            },
            {
                id: "2-2",
                title: "产品详情",
                link: {
                    path: "/products/detail",
                },
                icon: "i-heroicons-eye",
            },
        ],
    },
    {
        id: "3",
        title: "服务",
        link: {
            path: "/services",
        },
        icon: "i-heroicons-cog-6-tooth",
    },
    {
        id: "4",
        title: "关于我们",
        link: {
            path: "/about",
        },
        icon: "i-heroicons-information-circle",
    },
    {
        id: "5",
        title: "联系我们",
        link: {
            path: "/contact",
        },
        icon: "i-heroicons-phone",
    },
];
