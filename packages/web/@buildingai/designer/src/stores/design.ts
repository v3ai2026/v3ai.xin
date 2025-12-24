import { apiGetMicropageDetail, apiUpdateMicropage } from "@buildingai/service/consoleapi/decorate";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

import { useCanvasMetrics } from "../hooks/use-canvas-metrics";

/**
 * 管理设计画布的尺寸计算和动态调整
 *
 * @remarks
 * 实现特性：
 * - 响应式容器尺寸跟踪
 * - 提供动态面板尺寸
 */
const canvasMetrics = useCanvasMetrics();

/**
 * 页面设计装修管理
 */
export const useDesignStore = defineStore("design", () => {
    // 状态---------------------------------------------------
    /** 组件列表 */
    const components = ref<ComponentConfig[]>([]);
    /** 当前租金 id */
    const activeComponentId = ref<string | null>(null);
    /** 当前拖拽的组件 */
    const draggedComponent = ref<ComponentMenuItem | null>(null);
    /** 显示安全区域的线 */
    const showSafeArea = ref<boolean>(false);
    /** 画布是否被选中 */
    const isCanvasSelected = ref<boolean>(false);
    /** 页面信息数据 */
    const configs = ref<PageMateConfig>({
        backgroundColor: "#f6f7f8",
        backgroundDarkColor: "#1a1b1e",
        backgroundImage: "",
        backgroundType: "solid",
        pageHeight: canvasMetrics.designHeight.value as unknown as number,
    });
    /** 当前页面设计 id */
    const currentId = ref<string>("");
    /** 当前页面设计名称 */
    const projectName = ref<string>("");
    /** 当前页面终端 */
    const currentTerminal = ref<DecorateScene>("web");
    /** 初始数据快照，用于检测是否有更改 */
    const initialSnapshot = ref<string>("");

    /** 创建当前数据快照 */
    function createSnapshot() {
        return JSON.stringify({
            components: components.value,
            configs: configs.value,
            projectName: projectName.value,
        });
    }

    /** 计算当前是否有未保存的更改 */
    const isDirty = computed(() => {
        if (!initialSnapshot.value) return false;
        return createSnapshot() !== initialSnapshot.value;
    });

    /** 重置所有状态, 在离开页面时调用，清空所有状态数据 */
    function resetState() {
        // 重置组件列表
        components.value = [];
        // 重置当前选中组件ID
        activeComponentId.value = null;
        // 重置拖拽组件
        draggedComponent.value = null;
        // 重置画布选中状态
        isCanvasSelected.value = false;
        // 重置页面信息数据
        configs.value = {
            backgroundType: "solid",
            backgroundImage: "",
            backgroundColor: "#ffffff",
            backgroundDarkColor: "#1a1b1e",
            pageHeight: 1080,
        };
        // 重置当前页面ID
        currentId.value = "";
        // 重置项目名称
        projectName.value = "";
        // 重置初始快照
        initialSnapshot.value = "";
    }
    // 状态---------------------------------------------------

    // 页面组件操作部分-----------------------------------------
    /** 获取当前选择的组件 */
    const activeComponent = computed(() =>
        components.value.find((c: ComponentConfig) => c.id === activeComponentId.value),
    );

    /** 添加组件 */
    function addComponent(config: {
        type: string;
        title: string;
        position: Position;
        isHidden: boolean;
        size: Size;
        props: Record<string, any>;
    }) {
        const component: ComponentConfig = {
            id: uuidv4(),
            type: config.type,
            title: config.title,
            position: { ...config.position },
            isHidden: config.isHidden,
            size: { ...config.size },
            props: JSON.parse(JSON.stringify(config.props)),
        };

        components.value.push(component);
        setActiveComponent(component.id);
        return component;
    }

    /** 更新组件位置 */
    function updatePosition(id: string, position: Position) {
        const component = components.value.find((c: ComponentConfig) => c.id === id);
        if (component) {
            component.position = position;
        }
    }

    /** 更新组件大小 */
    function updateSize(id: string, size: Size) {
        const component = components.value.find((c: ComponentConfig) => c.id === id);
        if (component) {
            component.size.width = size.width;
            component.size.height = size.height;
        }
    }

    /** 更新组件属性 */
    function updateProperties(id: string, props: Record<string, any>) {
        const component = components.value.find((c: ComponentConfig) => c.id === id);
        if (component) {
            component.props = { ...component.props, ...props };
        } else {
            console.warn("更新组件属性失败, component -->", component);
        }
    }

    /** 更新组件显示 */
    function updateVisible(id: string, value: boolean) {
        const component = components.value.find((c: ComponentConfig) => c.id === id);
        if (component) {
            component.isHidden = value;
        }
    }

    /** 设置当前激活的组件 */
    function setActiveComponent(id: string | null) {
        activeComponentId.value = id;
    }

    /** 删除组件 */
    function removeComponent(id: string) {
        components.value = components.value.filter((c: ComponentConfig) => c.id !== id);
        activeComponentId.value = null;
    }

    /** 设置正在拖拽的组件 */
    function setDraggedComponent(component: ComponentMenuItem | null) {
        draggedComponent.value = component;
    }
    // 页面组件操作部分-----------------------------------------

    // 接口对接操作部分-----------------------------------------
    /**
     * 获取页面数据
     * @param id 页面ID或场景类型
     * @param terminal 终端类型：1-移动端，2-PC端
     */
    async function getPages(id: string) {
        // 保存场景类型和终端类型
        currentId.value = id;
        const data = await apiGetMicropageDetail(id);
        components.value = data.content;
        configs.value = data.configs as PageMateConfig;
        canvasMetrics.setDesignSize(1920, data.configs.pageHeight);
        projectName.value = data.name;
        currentTerminal.value = data.terminal;
        // 保存初始数据快照
        initialSnapshot.value = createSnapshot();
        return data;
    }

    /**
     * 保存页面数据
     * 根据当前场景类型自动选择正确的API
     */
    async function savePages() {
        configs.value.pageHeight = canvasMetrics.designHeight as unknown as number;
        const result = await apiUpdateMicropage(currentId.value, {
            name: projectName.value,
            configs: configs.value,
            content: components.value,
            terminal: currentTerminal.value,
        });
        // 保存成功后更新快照
        initialSnapshot.value = createSnapshot();
        return result;
    }
    // 接口对接操作部分-----------------------------------------

    return {
        // 状态------------
        components,
        activeComponent,
        draggedComponent,
        configs,
        projectName,
        showSafeArea,
        isCanvasSelected,
        isDirty,

        // 方法------------
        addComponent,
        updatePosition,
        updateSize,
        updateProperties,
        updateVisible,
        setActiveComponent,
        removeComponent,
        setDraggedComponent,
        resetState,

        // 请求------------
        getPages,
        savePages,
    };
});
