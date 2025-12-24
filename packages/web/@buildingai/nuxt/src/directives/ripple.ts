import type { Directive, DirectiveBinding } from "vue";

interface RippleOptions {
    /**
     * 是否启用水波纹效果
     * @default true
     */
    enabled?: boolean;

    /**
     * 水波纹颜色，CSS颜色值
     * @example 'rgba(0, 0, 0, 0.1)' | '#000' | 'var(--ripple-color)'
     */
    color?: string;

    /**
     * 水波纹动画持续时间（毫秒）
     * @default 600
     */
    duration?: number;
}

/**
 * 水波纹指令
 * 为元素添加点击水波纹效果
 *
 * 基本使用：
 * ```vue
 * <div v-ripple>点击我</div>
 * ```
 *
 * 自定义颜色：
 * ```vue
 * <div v-ripple="{ color: 'rgba(255, 0, 0, 0.2)' }">红色水波纹</div>
 * ```
 *
 * 禁用水波纹：
 * ```vue
 * <div v-ripple="{ enabled: false }">无水波纹</div>
 * ```
 *
 * 注意：
 * 1. 指令会自动为元素设置 position: relative
 * 2. 默认水波纹颜色在亮色模式下为黑色（透明度0.1），暗色模式下为白色（透明度0.1）
 */
const Ripple: Directive<HTMLElement, RippleOptions | boolean> = {
    mounted(el, binding) {
        // 解析指令参数
        const options = parseOptions(binding);
        if (!options.enabled) return;

        // 总是设置 position: relative，不再检查当前样式
        el.style.position = "relative";

        // 创建水波纹容器
        const container = document.createElement("div");
        container.className = "ripple-container";
        el.appendChild(container);

        // 存储选项和容器引用
        el._rippleOptions = options;
        el._rippleContainer = container;

        // 添加点击事件监听器
        el.addEventListener("mousedown", handleRippleEffect);
    },

    updated(el, binding) {
        // 更新选项
        const newOptions = parseOptions(binding);
        const oldOptions = el._rippleOptions || { enabled: true };

        // 处理启用/禁用状态变化
        if (newOptions.enabled !== oldOptions.enabled) {
            if (newOptions.enabled) {
                // 重新启用
                el.addEventListener("mousedown", handleRippleEffect);
            } else {
                // 禁用
                el.removeEventListener("mousedown", handleRippleEffect);
            }
        }

        // 更新选项
        el._rippleOptions = newOptions;
    },

    unmounted(el) {
        // 移除事件监听器
        el.removeEventListener("mousedown", handleRippleEffect);

        // 移除水波纹容器
        if (el._rippleContainer) {
            el._rippleContainer.remove();
            delete el._rippleContainer;
        }

        // 清理存储的选项
        delete el._rippleOptions;
    },
};

/**
 * 处理水波纹效果
 */
function handleRippleEffect(event: MouseEvent) {
    const el = event.currentTarget as HTMLElement & {
        _rippleOptions?: RippleOptions;
        _rippleContainer?: HTMLElement;
    };

    if (!el._rippleOptions?.enabled || !el._rippleContainer) return;

    // 创建水波纹元素
    const ripple = document.createElement("div");
    ripple.className = "ripple";

    // 设置自定义颜色
    if (el._rippleOptions.color) {
        ripple.style.backgroundColor = el._rippleOptions.color;
    }

    // 设置自定义动画时间
    if (el._rippleOptions.duration) {
        ripple.style.animationDuration = `${el._rippleOptions.duration}ms`;
    }

    // 计算水波纹大小（取元素对角线长度的两倍，确保覆盖整个元素）
    const rect = el.getBoundingClientRect();
    const diagonal = Math.sqrt(rect.width * rect.width + rect.height * rect.height);
    const size = diagonal * 2;
    ripple.style.width = ripple.style.height = `${size}px`;

    // 计算点击位置相对于元素的坐标
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    // 添加到容器
    el._rippleContainer.appendChild(ripple);

    // 动画结束后移除水波纹元素
    ripple.addEventListener("animationend", () => {
        ripple.remove();
    });
}

/**
 * 解析指令参数
 */
function parseOptions(binding: DirectiveBinding<RippleOptions | boolean>): RippleOptions {
    const defaultOptions: RippleOptions = {
        enabled: true,
    };

    if (binding.value === false) {
        return { ...defaultOptions, enabled: false };
    }

    if (binding.value === true || binding.value === undefined) {
        return defaultOptions;
    }

    return { ...defaultOptions, ...binding.value };
}

// 扩展 HTMLElement 接口以支持我们的自定义属性
declare global {
    interface HTMLElement {
        _rippleOptions?: RippleOptions;
        _rippleContainer?: HTMLElement;
    }
}

export default Ripple;
