import Icon from "./images/icon.png";

/**
 * 音频组件类型配置
 */
export interface Props {
    /** 音频文件地址 */
    src: string;
    /** 音频标题 */
    title: string;
    /** 艺术家/作者 */
    artist: string;
    /** 是否显示控制条 */
    controls: boolean;
    /** 是否自动播放 */
    autoplay: boolean;
    /** 是否循环播放 */
    loop: boolean;
    /** 是否静音 */
    muted: boolean;
    /** 预加载方式 */
    preload: "none" | "metadata" | "auto";
    /** 音量大小 */
    volume: number;
    /** 是否显示音频信息 */
    showInfo: boolean;
    /** 播放器主题色 */
    themeColor: string;
    /** 播放器大小 */
    playerSize: "small" | "medium" | "large";
    /** 圆角大小 */
    borderRadius: number;
    /** 样式配置 */
    style: {
        rootBgColor: string;
        bgColor: string;
        borderColor: string;
        paddingTop: number;
        paddingRight: number;
        paddingBottom: number;
        paddingLeft: number;
        borderRadiusTop: number;
        borderRadiusBottom: number;
    };
}

/**
 * 音频组件配置
 */
export const audioConfig: ComponentMenuItem<Props> = {
    id: "ch4i7j9g-8i0f-9g1h-di4i-6f7g8h9i0j1k",
    type: "audio",
    title: "console-widgets.components.audio",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 320,
        height: 80,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 8,
    props: {
        src: "",
        title: "音频标题",
        artist: "艺术家",
        controls: true,
        autoplay: false,
        loop: false,
        muted: false,
        preload: "metadata",
        volume: 1.0,
        showInfo: true,
        themeColor: "#3b82f6",
        playerSize: "medium",
        borderRadius: 8,
        style: {
            rootBgColor: "",
            bgColor: "#ffffff",
            borderColor: "#e5e7eb",
            paddingTop: 16,
            paddingRight: 16,
            paddingBottom: 16,
            paddingLeft: 16,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
        },
    },
};
