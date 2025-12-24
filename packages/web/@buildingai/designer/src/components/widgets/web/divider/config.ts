import Icon from "./images/icon.png";

/**
 * 辅助线组件类型配置
 * @description 定义辅助线组件的属性和样式选项
 */
export interface Props {
    /** 线条样式 */
    lineStyle: "solid" | "dashed" | "dotted";
    /** 线条颜色 */
    lineColor: string;
    /** 线条宽度  */
    lineWidth: number;
    /** 样式配置 */
    style: {
        /** 底部背景颜色 */
        rootBgColor: string;
        /** 上内边距 */
        paddingTop: number;
        /** 右内边距 */
        paddingRight: number;
        /** 下内边距 */
        paddingBottom: number;
        /** 左内边距 */
        paddingLeft: number;
    };
}

/**
 * 辅助线组件配置
 * @description 定义辅助线组件的默认配置和元数据
 */
export const dividerConfig: ComponentMenuItem<Props> = {
    id: "3f8a9b2c-6d7e-4f5a-9b8c-1d2e3f4a5b6c",
    type: "divider",
    title: "console-widgets.components.divider",
    icon: Icon,
    isHidden: false,
    category: {
        id: "basic",
        title: "console-widgets.categories.basic",
    },
    size: {
        width: 300,
        height: 3,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 2,
    props: {
        lineStyle: "solid",
        lineColor: "#dddddd",
        lineWidth: 1,
        style: {
            rootBgColor: "#ffffff",
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            paddingLeft: 0,
        },
    },
};
