import Icon from "./images/icon.png";

/**
 * 雪花背景组件类型配置
 */
export interface Props {
    /** 雪花颜色 */
    color: string;
    /** 雪花数量 */
    quantity: number;
    /** 下降速度 */
    speed: number;
    /** 最大半径 */
    maxRadius: number;
    /** 最小半径 */
    minRadius: number;
    /** 自定义样式类名 */
    class?: string;
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
 * 雪花背景组件配置
 */
export const snowfallBgConfig: ComponentMenuItem<Props> = {
    id: "snowfall-bg-widget",
    type: "snowfall-bg",
    title: "console-widgets.components.snowfallBg",
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
    order: 2,
    props: {
        color: "var(--foreground)",
        quantity: 100,
        speed: 1,
        maxRadius: 3,
        minRadius: 1,
        class: "",
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
