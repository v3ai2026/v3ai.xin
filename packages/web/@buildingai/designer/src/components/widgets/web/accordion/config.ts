import Icon from "./images/icon.png";

/**
 * 折叠面板项目类型
 */
export interface AccordionItem {
    /** 唯一标识 */
    value?: string;
    /** 标签文本 */
    label?: string;
    /** 左侧图标 */
    icon?: string;
    /** 右侧图标 */
    trailingIcon?: string;
    /** 插槽名称 */
    slot?: string;
    /** 内容文本 */
    content?: string;
    /** 是否禁用 */
    disabled?: boolean;
    /** 自定义样式类 */
    class?: any;
    /** UI 配置 */
    ui?: Pick<
        {
            root?: any;
            item?: any;
            header?: any;
            trigger?: any;
            content?: any;
            body?: any;
            leadingIcon?: any;
            trailingIcon?: any;
            label?: any;
        },
        | "body"
        | "root"
        | "item"
        | "header"
        | "trigger"
        | "content"
        | "leadingIcon"
        | "trailingIcon"
        | "label"
    >;
}

/**
 * 折叠面板组件类型配置
 */
export interface Props {
    /** 折叠面板项目数组 */
    items: AccordionItem[];
    /** 右侧图标 */
    trailingIcon: string;
    /** 标签键名 */
    labelKey: string;
    /** 是否可折叠 */
    collapsible: boolean;
    /** 默认展开值 */
    defaultValue: string | string[];
    /** 控制展开值 */
    modelValue: string | string[];
    /** 面板类型 */
    type: "single" | "multiple";
    /** 是否禁用 */
    disabled: boolean;
    /** 隐藏时是否卸载 */
    unmountOnHide: boolean;
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
        /** 内容区域样式 */
        contentBgColor: string;
        contentTextColor: string;
        contentPaddingTop: number;
        contentPaddingRight: number;
        contentPaddingBottom: number;
        contentPaddingLeft: number;
    };
}

/**
 * 折叠面板组件配置
 */
export const accordionConfig: ComponentMenuItem<Props> = {
    id: "h4j8k2l5-9m1n-2o4p-8k2l-6i9j0k1l2m3n",
    type: "accordion",
    title: "console-widgets.components.accordion",
    icon: Icon,
    isHidden: false,
    category: {
        id: "extension",
        title: "console-widgets.categories.extension",
    },
    size: {
        width: 400,
        height: 300,
        widthMode: "fixed",
        heightMode: "fixed",
    },
    order: 12,
    props: {
        items: [
            {
                value: "1",
                label: "面板标题 1",
                content: "这是第一个折叠面板的内容，你可以在这里放置任何需要的内容。",
                disabled: false,
            },
            {
                value: "2",
                label: "面板标题 2",
                content: "这是第二个折叠面板的内容，支持富文本和多媒体内容。",
                disabled: false,
            },
            {
                value: "3",
                label: "面板标题 3",
                content: "这是第三个折叠面板的内容，可以自定义样式和布局。",
                disabled: false,
            },
        ],
        trailingIcon: "i-heroicons-chevron-down",
        labelKey: "label",
        collapsible: true,
        defaultValue: ["1"],
        modelValue: ["1"],
        type: "multiple",
        disabled: false,
        unmountOnHide: true,
        style: {
            rootBgColor: "",
            bgColor: "",
            paddingTop: 8,
            paddingRight: 8,
            paddingBottom: 8,
            paddingLeft: 8,
            borderRadiusTop: 8,
            borderRadiusBottom: 8,
            /** 内容区域样式 */
            contentBgColor: "",
            contentTextColor: "",
            contentPaddingTop: 0,
            contentPaddingRight: 0,
            contentPaddingBottom: 0,
            contentPaddingLeft: 0,
        },
    },
};
