import Icon from "./images/icon.png";

/**
 * 闪烁网格组件类型配置
 */
export interface Props {
    /** 方格大小 */
    squareSize: number;
    /** 网格间隙 */
    gridGap: number;
    /** 闪烁概率 */
    flickerChance: number;
    /** 方格颜色 */
    color: string;
    /** 最大透明度 */
    maxOpacity: number;
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
 * 闪烁网格组件配置
 */
export const flickeringGridConfig: ComponentMenuItem<Props> = {
    id: "flickering-grid-widget",
    type: "flickering-grid",
    title: "console-widgets.components.flickeringGrid",
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
    order: 3,
    props: {
        squareSize: 4,
        gridGap: 6,
        flickerChance: 0.3,
        color: "rgb(0, 0, 0)",
        maxOpacity: 0.2,
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
