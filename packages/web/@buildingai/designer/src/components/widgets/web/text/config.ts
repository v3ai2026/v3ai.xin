import Icon from "./images/icon.png";

/**
 * 文本组件类型配置
 */
export interface Props {
    content: string;
    fontSize: number;
    fontWeight: number;
    color: string;
    lineHeight: number;
    textAlign: "left" | "right" | "center" | "justify" | "initial" | "inherit";
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
 * 文本组件配置
 */
export const textConfig: ComponentMenuItem<Props> = {
    id: "377d7e25-5470-470d-a11f-638c3f97e66d",
    type: "text",
    title: "console-widgets.components.text",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 200,
        height: 40,
        widthMode: "percent",
        heightMode: "fixed",
    },
    order: 1,
    props: {
        content: "这是一段文本",
        fontSize: 12,
        fontWeight: 400,
        color: "#333333",
        lineHeight: 20,
        textAlign: "left",
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
