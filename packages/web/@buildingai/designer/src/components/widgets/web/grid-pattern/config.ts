import Icon from "./images/icon.png";

/**
 * 网格图案组件类型配置
 */
export interface Props {
    /** 方格宽度 */
    width: number;
    /** 方格高度 */
    height: number;
    /** 网格方格数量 [水平, 垂直] */
    squares: [number, number];
    /** 显示文字 */
    text: string;
    /** 文字大小 */
    textSize: number;
    /** 文字颜色 */
    textColor: string;
    /** 文字字体粗细 */
    fontWeight: number;
    /** 显示文字 */
    showText: boolean;
    /** 网格遮罩效果 */
    maskEffect: boolean;
    /** 网格倾斜效果 */
    skewEffect: boolean;
    /** 自定义样式类名 */
    className?: string;
    /** 方格自定义样式类名 */
    squaresClassName?: string;
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
 * 网格图案组件配置
 */
export const gridPatternConfig: ComponentMenuItem<Props> = {
    id: "grid-pattern-widget",
    type: "grid-pattern",
    title: "console-widgets.components.gridPattern",
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
    order: 4,
    props: {
        width: 40,
        height: 40,
        squares: [24, 24],
        text: "Interactive Grid Pattern",
        textSize: 16,
        textColor: "var(--foreground)",
        fontWeight: 500,
        showText: true,
        maskEffect: true,
        skewEffect: true,
        className: "",
        squaresClassName: "",
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
