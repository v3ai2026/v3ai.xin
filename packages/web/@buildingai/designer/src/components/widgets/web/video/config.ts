import type { LinkItem } from "~/components/console/page-link-picker/layout";

import Icon from "./images/icon.png";

/**
 * 视频组件类型配置
 */
export interface Props {
    /** 视频地址 */
    src: string;
    /** 海报图片 */
    poster: string;
    /** 是否显示控制条 */
    controls: boolean;
    /** 是否自动播放 */
    autoplay: boolean;
    /** 是否循环播放 */
    loop: boolean;
    /** 是否静音 */
    muted: boolean;
    /** 预加载方式 */
    preload: "auto" | "metadata" | "none";
    /** 视频适应方式 */
    objectFit: "cover" | "contain" | "fill" | "scale-down" | "none";
    /** 圆角大小 */
    borderRadius: number;
    /** 透明度 */
    opacity: number;
    /** 链接地址 */
    to: LinkItem;
    /** 视频标题 */
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
 * 视频组件配置
 */
export const videoConfig: ComponentMenuItem<Props> = {
    id: "9e1f4g6d-5f7c-6d8e-af1f-3c4d5e6f7g8h",
    type: "video",
    title: "console-widgets.components.video",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 320,
        height: 180,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 5,
    props: {
        src: "",
        poster: "",
        controls: true,
        autoplay: false,
        loop: false,
        muted: false,
        preload: "metadata",
        objectFit: "contain",
        borderRadius: 8,
        opacity: 1,
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
