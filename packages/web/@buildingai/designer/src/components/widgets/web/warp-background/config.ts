import Icon from "./images/icon.png";

/**
 * 扭曲背景组件类型配置
 */
export interface Props {
    /** 标题文字 */
    title: string;
    /** 描述文字 */
    description: string;
    /** 透视值 */
    perspective: number;
    /** 每侧光束数量 */
    beamsPerSide: number;
    /** 光束大小 */
    beamSize: number;
    /** 光束最大延迟 */
    beamDelayMax: number;
    /** 光束最小延迟 */
    beamDelayMin: number;
    /** 光束持续时间 */
    beamDuration: number;
    /** 网格颜色 */
    gridColor: string;
    /** 标题文字大小 */
    titleSize: number;
    /** 标题文字颜色 */
    titleColor: string;
    /** 标题字体粗细 */
    titleWeight: number;
    /** 描述文字大小 */
    descSize: number;
    /** 描述文字颜色 */
    descColor: string;
    /** 描述字体粗细 */
    descWeight: number;
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
 * 扭曲背景组件配置
 */
export const warpBackgroundConfig: ComponentMenuItem<Props> = {
    id: "warp-background-widget",
    type: "warp-background",
    title: "console-widgets.components.warpBackground",
    icon: Icon,
    isHidden: false,
    category: {
        id: "advanced",
        title: "console-widgets.categories.advanced",
    },
    size: {
        width: 600,
        height: 400,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 5,
    props: {
        title: "扭曲背景效果",
        description: "一个具有动态光束效果的3D扭曲背景组件",
        perspective: 100,
        beamsPerSide: 3,
        beamSize: 5,
        beamDelayMax: 3,
        beamDelayMin: 0,
        beamDuration: 3,
        gridColor: "var(--accent)",
        titleSize: 32,
        titleColor: "var(--foreground)",
        titleWeight: 700,
        descSize: 16,
        descColor: "#a1a1aa",
        descWeight: 400,
        className: "",
        style: {
            rootBgColor: "",
            bgColor: "",
            paddingTop: 40,
            paddingRight: 40,
            paddingBottom: 40,
            paddingLeft: 40,
            borderRadiusTop: 8,
            borderRadiusBottom: 8,
        },
    },
};
