import Icon from "./images/icon.png";

/**
 * 批注组件类型配置
 */
export interface Props {
    /** 批注标题 */
    title: string;
    /** 批注内容 */
    content: string;
    /** 批注类型 */
    type: "info" | "success" | "warning" | "error" | "note";
    /** 是否显示图标 */
    showIcon: boolean;
    /** 自定义图标 */
    icon: string;
    /** 是否可关闭 */
    closable: boolean;
    /** 边框样式 */
    variant: "solid" | "outline" | "soft" | "subtle";
    /** 圆角大小 */
    borderRadius: number;
    /** 阴影大小 */
    shadow: "none" | "sm" | "md" | "lg";
    /** 样式配置 */
    style: {
        rootBgColor: string;
        bgColor: string;
        borderColor: string;
        textColor: string;
        paddingTop: number;
        paddingRight: number;
        paddingBottom: number;
        paddingLeft: number;
        borderRadiusTop: number;
        borderRadiusBottom: number;
    };
}

/**
 * 批注组件配置
 */
export const annotationConfig: ComponentMenuItem<Props> = {
    id: "bg3h6i8f-7h9e-8f0g-ch3h-5e6f7g8h9i0j",
    type: "annotation",
    title: "console-widgets.components.annotation",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 300,
        height: 120,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 7,
    props: {
        title: "重要提示",
        content:
            "这是一个批注组件，可以用于显示提示信息、注意事项或者重要说明。支持多种样式和类型配置。",
        type: "info",
        showIcon: true,
        icon: "",
        closable: false,
        variant: "outline",
        borderRadius: 8,
        shadow: "sm",
        style: {
            rootBgColor: "",
            bgColor: "",
            borderColor: "",
            textColor: "",
            paddingTop: 16,
            paddingRight: 16,
            paddingBottom: 16,
            paddingLeft: 16,
            borderRadiusTop: 0,
            borderRadiusBottom: 0,
        },
    },
};
