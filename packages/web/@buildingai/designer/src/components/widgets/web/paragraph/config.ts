import Icon from "./images/icon.png";

/**
 * 段落组件类型配置
 */
export interface Props {
    /** 富文本内容 */
    content: string;
    /** 文本对齐方式 */
    textAlign: "left" | "right" | "center" | "justify" | "initial" | "inherit";
    /** 行间距 */
    lineHeight: number;
    /** 段落间距 */
    marginBottom: number;
    /** 缩进 */
    textIndent: number;
    /** 最大行数（0为无限制） */
    maxLines: number;
    /** 超出隐藏方式 */
    overflow: "visible" | "hidden" | "ellipsis";
    /** 是否启用富文本编辑 */
    enableRichText: boolean;
    /** 默认字体大小 */
    fontSize: number;
    /** 默认字体颜色 */
    color: string;
    /** 默认字体粗细 */
    fontWeight: number;
    /** 默认字体样式 */
    fontStyle: "normal" | "italic";
    /** 默认文本装饰 */
    textDecoration: "none" | "underline" | "line-through" | "overline";
    /** 字体族 */
    fontFamily: string;
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
 * 段落组件配置
 */
export const paragraphConfig: ComponentMenuItem<Props> = {
    id: "7c9f2e4b-3d5a-4b6c-8e9f-1a2b3c4d5e6f",
    type: "paragraph",
    title: "console-widgets.components.paragraph",
    icon: Icon,
    isHidden: false,
    category: {
        id: "extension",
        title: "console-widgets.categories.extension",
    },
    size: {
        width: 300,
        height: 120,
        widthMode: "percent",
        heightMode: "fixed",
    },
    order: 3,
    props: {
        content:
            "<p>这是一个富文本段落组件，支持<strong>粗体</strong>、<em>斜体</em>、<u>下划线</u>等样式混排。</p><p>你可以自由编辑文本内容，调整字体大小、颜色等样式。</p>",
        textAlign: "left",
        lineHeight: 1.6,
        marginBottom: 16,
        textIndent: 0,
        maxLines: 0,
        overflow: "visible",
        enableRichText: true,
        fontSize: 14,
        color: "#333333",
        fontWeight: 400,
        fontStyle: "normal",
        textDecoration: "none",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
        style: {
            rootBgColor: "",
            bgColor: "",
            paddingTop: 16,
            paddingRight: 16,
            paddingBottom: 16,
            paddingLeft: 16,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
        },
    },
};
