import Icon from "./images/icon.png";

/**
 * 视频文字组件类型配置
 */
export interface Props {
    /** 视频源地址 */
    src: string;
    /** 显示文字内容 */
    content: string;
    /** 自动播放 */
    autoPlay: boolean;
    /** 静音播放 */
    muted: boolean;
    /** 循环播放 */
    loop: boolean;
    /** 预加载方式 */
    preload: "auto" | "metadata" | "none";
    /** 字体大小 */
    fontSize: number;
    /** 字体粗细 */
    fontWeight: number;
    /** 文字锚点 */
    textAnchor: string;
    /** 基线对齐 */
    dominantBaseline: string;
    /** 字体族 */
    fontFamily: string;
    /** 自定义样式类名 */
    className?: string;
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
 * 视频文字组件配置
 */
export const videoTextConfig: ComponentMenuItem<Props> = {
    id: "video-text-widget",
    type: "video-text",
    title: "console-widgets.components.videoText",
    icon: Icon,
    isHidden: false,
    category: {
        id: "advanced",
        title: "console-widgets.categories.advanced",
    },
    size: {
        width: 400,
        height: 300,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 6,
    props: {
        src: "",
        content: "Video Text",
        autoPlay: true,
        muted: true,
        loop: true,
        preload: "auto",
        fontSize: 20,
        fontWeight: 700,
        textAnchor: "middle",
        dominantBaseline: "middle",
        fontFamily: "sans-serif",
        className: "",
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
