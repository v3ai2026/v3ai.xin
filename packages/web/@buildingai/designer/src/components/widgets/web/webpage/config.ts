import Icon from "./images/icon.png";

/**
 * 网页组件类型配置
 */
export interface Props {
    /** 网页链接 */
    url: string;
    /** 设备类型 */
    deviceType: "mobile" | "web";
    /** 设备外壳颜色 */
    deviceColor: string;
    /** 是否显示设备外壳 */
    showFrame: boolean;
    /** iframe缩放比例 */
    scale: number;
    /** 是否允许交互 */
    interactive: boolean;
    /** 加载状态提示 */
    loadingText: string;
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
 * 网页组件配置
 */
export const webpageConfig: ComponentMenuItem<Props> = {
    id: "ej6k9l1i-0k2h-1i3j-fk6k-8h9i0j1k2l3m",
    type: "webpage",
    title: "console-widgets.components.webpage",
    icon: Icon,
    isHidden: false,
    category: {
        id: "extension",
        title: "console-widgets.categories.extension",
    },
    size: {
        width: 400,
        height: 600,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 10,
    props: {
        url: "https://www.apple.com.cn",
        deviceType: "mobile",
        deviceColor: "",
        showFrame: true,
        scale: 1,
        interactive: false,
        loadingText: "正在加载...",
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
