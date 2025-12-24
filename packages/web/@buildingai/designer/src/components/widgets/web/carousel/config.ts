import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 轮播图项目类型
 */
export interface CarouselItem {
    /** 图片地址 */
    src: string;
    /** 图片描述 */
    alt?: string;
    /** 点击链接 */
    to?: LinkItem;
    /** 图片标题 */
    title?: string;
    /** 自定义样式类 */
    class?: string;
}

/**
 * 轮播图组件类型配置
 */
export interface Props {
    /** 轮播图片数组 */
    items: CarouselItem[];
    /** 是否显示箭头按钮 */
    arrows: boolean;
    /** 是否显示圆点指示器 */
    dots: boolean;
    /** 轮播方向 */
    orientation: "horizontal" | "vertical";
    /** 是否自动播放 */
    autoplay: boolean;
    /** 自动播放间隔（毫秒） */
    autoplayDelay: number;
    /** 是否循环播放 */
    loop: boolean;
    /** 是否允许拖拽 */
    dragFree: boolean;
    /** 每次滚动的幻灯片数量 */
    slidesToScroll: number;
    /** 对齐方式 */
    align: "start" | "center" | "end";
    /** 图片填充模式 */
    objectFit: "cover" | "contain" | "fill" | "scale-down" | "none";
    /** 图片圆角 */
    imageRadius: number;
    /** 轮播图高度 */
    carouselHeight: number;
    /** 是否显示标题 */
    showTitle: boolean;
    /** 标题位置 */
    titlePosition: "bottom" | "overlay";
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
 * 轮播图组件配置
 */
export const carouselConfig: ComponentMenuItem<Props> = {
    id: "fk7l0m2j-1l3i-2j4k-gl7l-9i0j1k2l3m4n",
    type: "carousel",
    title: "console-widgets.components.carousel",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 400,
        height: 300,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 11,
    props: {
        items: [
            {
                src: "https://picsum.photos/800/400?random=1",
                alt: "轮播图1",
                title: "精美图片1",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
            },
            {
                src: "https://picsum.photos/800/400?random=2",
                alt: "轮播图2",
                title: "精美图片2",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
            },
            {
                src: "https://picsum.photos/800/400?random=3",
                alt: "轮播图3",
                title: "精美图片3",
                to: {
                    type: "custom",
                    name: "自定义链接",
                    path: "",
                    query: {},
                },
            },
        ],
        arrows: true,
        dots: true,
        orientation: "horizontal",
        autoplay: false,
        autoplayDelay: 3000,
        loop: true,
        dragFree: false,
        slidesToScroll: 1,
        align: "center",
        objectFit: "cover",
        imageRadius: 8,
        carouselHeight: 300,
        showTitle: false,
        titlePosition: "bottom",
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
