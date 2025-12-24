import { STORAGE_KEYS } from "@buildingai/constants/web";
import type { AiModel } from "@buildingai/service/webapi/ai-conversation";
import { createPinia, defineStore } from "pinia";
import { ref, shallowRef } from "vue";

const controlsStore = defineStore("controls", () => {
    /** STORAGE_KEYS */
    const LAYOUT_MODE = useCookie(STORAGE_KEYS.LAYOUT_MODE).value || "side";

    /** 设置模态框是否可见 */
    const settingsModalVisible = ref<boolean>(false);

    /** 全局搜索对话框是否可见 */
    const globalSearchVisible = ref<boolean>(false);

    /** 后台布局模式 */
    const consoleLayoutMode = ref<string>(LAYOUT_MODE);
    const consoleTempLayoutMode = ref<string>("");

    /** 前台布局风格 */
    const layoutStyle = ref<string>("style1");

    /** 聊天侧边栏显示状态 */
    const chatSidebarVisible = ref<boolean>(false);

    /** 当前选中的AI模型 */
    const selectedModel = shallowRef<AiModel | null>(null);

    const toggleSettingsModal = () => {
        settingsModalVisible.value = !settingsModalVisible.value;
    };

    const toggleGlobalSearch = () => {
        globalSearchVisible.value = !globalSearchVisible.value;
    };

    const toggleChatSidebar = () => {
        chatSidebarVisible.value = !chatSidebarVisible.value;
    };

    const setLayoutStyle = (style: string) => {
        layoutStyle.value = style;
    };

    /**
     * 设置选中的AI模型
     * @param model 要选中的模型对象
     */
    const setSelectedModel = (model: AiModel | null) => {
        selectedModel.value = model;
    };

    return {
        /** 设置模态框是否可见 */
        settingsModalVisible,
        /** 全局搜索对话框是否可见 */
        globalSearchVisible,
        /** 后台布局模式 */
        consoleLayoutMode,
        consoleTempLayoutMode,
        /** 聊天侧边栏显示状态 */
        chatSidebarVisible,
        /** 前台布局风格 */
        layoutStyle,
        /** 当前选中的AI模型 */
        selectedModel,

        /** 设置模态框是否可见 */
        toggleSettingsModal,
        /** 切换全局搜索对话框是否可见 */
        toggleGlobalSearch,
        /** 切换聊天侧边栏显示状态 */
        toggleChatSidebar,
        /** 设置前台布局风格 */
        setLayoutStyle,
        /** 设置选中的AI模型 */
        setSelectedModel,
    };
});

/**
 * Use controls store
 * @description Use controls store
 * @returns Controls store
 */
const Pinia = createPinia();
export const useControlsStore = () => controlsStore(Pinia);
