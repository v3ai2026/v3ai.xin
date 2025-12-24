import Icon from "./images/icon.png";

/**
 * 粒子背景组件类型配置
 */
export interface Props {
    /** 粒子颜色 */
    color: string;
    /** 粒子数量 */
    quantity: number;
    /** 粒子静态性 */
    staticity: number;
    /** 缓动效果 */
    ease: number;
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
 * 粒子背景组件配置
 */
export const particlesBackgroundConfig: ComponentMenuItem<Props> = {
    id: "particles-background-widget",
    type: "particles-background",
    title: "console-widgets.components.particlesBackground",
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
    order: 1,
    props: {
        color: "var(--background)",
        quantity: 100,
        staticity: 50,
        ease: 50,
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
