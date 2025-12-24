import type { Component } from "vue";
import { h, render } from "vue";

/**
 * 动态挂载组件到 DOM 的通用 Hook
 * @param Component 要挂载的组件
 * @param props 组件的属性
 * @returns 返回控制对象，包含销毁方法和容器引用
 */
function useMountComponent<T = Record<string, unknown>>(Component: Component, props: T) {
    // 创建容器
    const container = document.createElement("div");

    // 创建虚拟节点
    const vnode = h(Component, props || {});

    // 渲染到容器
    render(vnode, container);

    // 添加到 body
    document.body.appendChild(container);

    // 返回控制对象
    return {
        // 销毁组件方法
        destroy: () => {
            render(null, container);
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        },
        // 容器引用，方便外部操作
        container,
    };
}

export { useMountComponent };
