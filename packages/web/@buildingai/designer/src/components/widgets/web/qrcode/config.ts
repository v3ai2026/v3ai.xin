import Icon from "./images/icon.png";

/**
 * 二维码组件类型配置
 */
export interface Props {
    /** 二维码内容 */
    content: string;
    /** 二维码大小 */
    qrcodeSize: number;
    /** 错误校正级别 */
    level: "L" | "M" | "Q" | "H";
    /** 前景色 */
    foregroundColor: string;
    /** 背景色 */
    backgroundColor: string;
    /** 边距大小 */
    margin: number;
    /** 是否显示logo */
    showLogo: boolean;
    /** logo图片地址 */
    logoSrc: string;
    /** logo大小 */
    logoSize: number;
    /** 是否显示标题 */
    showTitle: boolean;
    /** 标题文本 */
    title: string;
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
 * 二维码组件配置
 */
export const qrcodeConfig: ComponentMenuItem<Props> = {
    id: "di5j8k0h-9j1g-0h2i-ej5j-7g8h9i0j1k2l",
    type: "qrcode",
    title: "console-widgets.components.qrcode",
    icon: Icon,
    isHidden: false,
    category: {
        id: "extension",
        title: "console-widgets.categories.extension",
    },
    size: {
        width: 250,
        height: 250,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 9,
    props: {
        content: "https://www.example.com",
        qrcodeSize: 200,
        level: "M",
        foregroundColor: "#000000",
        backgroundColor: "#ffffff",
        margin: 0,
        showLogo: true,
        logoSrc: "",
        logoSize: 40,
        showTitle: false,
        title: "扫描二维码",
        borderRadius: 12,
        style: {
            rootBgColor: "",
            bgColor: "#ffffff",
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
        },
    },
};
