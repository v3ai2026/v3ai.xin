import type { CSSProperties } from "vue";
import { computed, getCurrentInstance, type Ref, shallowRef, watch } from "vue";

import { DESIGN_CONFIG } from "../config/design";
import { useDesignStore } from "../stores/design";

// Current canvas dimensions
const designWidth = shallowRef<number>(DESIGN_CONFIG.value.DEFAULT_WIDTH);
const designHeight = shallowRef<number>(DESIGN_CONFIG.value.DEFAULT_HEIGHT);

// Watch DESIGN_CONFIG changes
watch(
    () => DESIGN_CONFIG.value,
    (newConfig) => {
        designWidth.value = newConfig.DEFAULT_WIDTH;
        designHeight.value = newConfig.DEFAULT_HEIGHT;
    },
    { immediate: true },
);

/**
 * Manage design canvas dimension calculations and dynamic adjustments
 *
 * @remarks
 * Implemented features:
 * - Responsive container dimension tracking
 * - Provide dynamic panel dimensions
 * - Support correct drag following during panzoom scaling
 * @param currentScale - Current zoom ratio of panzoom
 */
export function useCanvasMetrics(currentScale?: Ref<number>) {
    // Drag resize related state
    const isDraggingSize = shallowRef<boolean>(false);
    const startPosition = shallowRef<Position>({ x: 0, y: 0 });
    const startSize = shallowRef<Size>({ width: designWidth.value, height: designHeight.value });

    /**
     * Handle start of drag resize
     * @param e Mouse event
     */
    function handleSizeDragStart(e: MouseEvent): void {
        isDraggingSize.value = true;
        startPosition.value = { x: e.clientX, y: e.clientY };
        startSize.value = { width: designWidth.value, height: designHeight.value };

        document.addEventListener("mousemove", handleSizeDragMove);
        document.addEventListener("mouseup", handleSizeDragEnd);
    }

    /**
     * Handle drag move resize
     * @param e Mouse event
     */
    function handleSizeDragMove(e: MouseEvent): void {
        if (!isDraggingSize.value) return;

        // Get current zoom ratio, default to 1 if not provided
        const scale = currentScale?.value || 1;

        // Calculate mouse movement distance and adjust based on zoom ratio
        const deltaY = (e.clientY - startPosition.value.y) / scale;

        // Get maximum Y coordinate of all components (component bottom position)
        const designStore = useDesignStore();
        const maxComponentBottom = designStore.components.reduce(
            (max: number, component: ComponentConfig) => {
                const componentBottom = component.position.y + component.size.height;
                return Math.max(max, componentBottom);
            },
            0,
        );

        // Calculate minimum allowed height: take the larger value of default minimum height and component maximum bottom position
        const minAllowedHeight = Math.max(DESIGN_CONFIG.value.DEFAULT_HEIGHT, maxComponentBottom);

        const newHeight = Math.max(
            minAllowedHeight,
            Math.min(DESIGN_CONFIG.value.MAX_HEIGHT, startSize.value.height + deltaY),
        );

        // Round height to ensure integer value
        setDesignSize(startSize.value.width, Math.round(newHeight));
    }

    /**
     * Handle end of drag resize
     */
    function handleSizeDragEnd(): void {
        const designStore = useDesignStore();
        isDraggingSize.value = false;
        designStore.configs.pageHeight = designHeight.value;
        document.removeEventListener("mousemove", handleSizeDragMove);
        document.removeEventListener("mouseup", handleSizeDragEnd);
    }

    /**
     * Set design canvas dimensions
     * @param width Width (pixels)
     * @param height Height (pixels)
     */
    function setDesignSize(width: number, height: number): void {
        designWidth.value = width;
        designHeight.value = height;

        console.log(width, height);
    }

    /**
     * Change canvas dimensions
     */
    function changeDesignSize(): void {
        if (designHeight.value < DESIGN_CONFIG.value.DEFAULT_HEIGHT) {
            designHeight.value = DESIGN_CONFIG.value.DEFAULT_HEIGHT;
            const designStore = useDesignStore();
            designStore.configs.pageHeight = designHeight.value;
            return;
        }
    }

    /**
     * Reset design canvas dimensions to default values
     */
    function resetDesignSize(): void {
        const designStore = useDesignStore();
        setDesignSize(DESIGN_CONFIG.value.DEFAULT_WIDTH, designStore.configs.pageHeight);
    }

    /**
     * Design canvas style object
     */
    const designStyle = computed<CSSProperties>(() => ({
        width: `${designWidth.value}px`,
        height: `${designHeight.value}px`,
    }));

    // Only register onUnmounted when there is an active component instance
    const instance = getCurrentInstance();
    if (instance) {
        // onUnmounted(resetDesignSize);
    }

    return {
        // State
        designWidth,
        designHeight,
        isDraggingSize,

        // Computed properties
        designStyle,

        // Methods
        setDesignSize,
        resetDesignSize,
        changeDesignSize,
        handleSizeDragStart,
    };
}
