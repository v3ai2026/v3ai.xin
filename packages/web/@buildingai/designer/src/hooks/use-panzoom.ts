import panzoom from "panzoom";
import { nextTick, onMounted, onUnmounted, shallowRef, watch } from "vue";

export type InteractionMode = "mouse" | "touchpad";

interface UsePanzoomOptions {
    maxZoom?: number;
    minZoom?: number;
    zoomSpeed?: number;
    modelValue: InteractionMode;
    onUpdateMode?: (mode: InteractionMode) => void;
}

interface UsePanzoomReturn {
    contentRef: ReturnType<typeof shallowRef<HTMLElement | null>>;
    containerRef: ReturnType<typeof shallowRef<HTMLElement | null>>;
    currentScale: ReturnType<typeof shallowRef<number>>;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
    focusContent: () => void;
    updateInteractionMode: (mode: InteractionMode) => void;
}

/**
 * Hook that provides canvas zoom and pan functionality
 * @param options - Configuration options
 * @returns - Returns zoom and pan related state and methods
 */
export function usePanzoom(options: UsePanzoomOptions): UsePanzoomReturn {
    const { maxZoom = 2, minZoom = 0.2, modelValue = "mouse", onUpdateMode } = options;

    const contentRef = shallowRef<HTMLElement | null>(null);
    const containerRef = shallowRef<HTMLElement | null>(null);
    let panzoomInstance: ReturnType<typeof panzoom> | null = null;

    const currentScale = shallowRef(1);
    const isSpacePressed = shallowRef(false);
    const currentMode = shallowRef(modelValue);

    /**
     * Initialize zoom to fit container
     */
    function initializeZoom() {
        if (!containerRef.value || !contentRef.value || !panzoomInstance) return;

        const containerRect = containerRef.value.getBoundingClientRect();
        const contentRect = contentRef.value.getBoundingClientRect();

        // Calculate zoom ratio for horizontal and vertical directions
        // Reserve 40px margin for horizontal direction (20px on each side)
        // Reserve 40px margin for vertical direction (20px top and bottom)
        const scaleX = (containerRect.width - 40) / contentRect.width;
        const scaleY = (containerRect.height - 40) / contentRect.height;

        // Choose the smaller zoom ratio to ensure content is fully visible
        const scale = Math.min(scaleX, scaleY);

        // Ensure zoom ratio is within allowed range
        const finalScale =
            contentRect.width === 375 ? 1.2 : Math.min(Math.max(scale, minZoom), maxZoom);

        // Calculate center position
        const centerX = (containerRect.width - contentRect.width * finalScale) / 2;
        const centerY = (containerRect.height - contentRect.height * finalScale) / 2;

        panzoomInstance.zoomAbs(0, 0, finalScale);
        panzoomInstance.moveTo(centerX, centerY);
        currentScale.value = finalScale;
    }

    /**
     * Create panzoom instance
     */
    function createPanzoomInstance() {
        if (!contentRef.value) return null;

        const instance = panzoom(contentRef.value, {
            maxZoom,
            minZoom,
            // Whether to limit pan range. true enables boundary limits, false disables, Bounds type allows custom boundary values.
            bounds: true,
            smoothScroll: true,
            // In mouse mode, dragging is allowed directly
            beforeMouseDown: () => {
                // Return true to prevent dragging
                // Return false to allow dragging
                if (currentMode.value === "touchpad") {
                    return !isSpacePressed.value; // Prevent dragging when space is not pressed
                }
                return false; // Allow dragging in mouse mode
            },
            // In touchpad mode:
            // - Use wheel to pan when not holding Ctrl/Cmd
            // - Use wheel to zoom when holding Ctrl/Cmd
            // In mouse mode, use wheel to zoom directly
            beforeWheel: (e: WheelEvent) => {
                if (currentMode.value === "touchpad") {
                    e.preventDefault();
                    // Zoom when holding Ctrl/Cmd
                    if (e.metaKey || e.ctrlKey) {
                        return false;
                    }
                    // Otherwise pan
                    if (instance) {
                        // deltaMode === 0 means pixels, 1 means lines, 2 means pages
                        const multiplier = e.deltaMode === 1 ? 20 : e.deltaMode === 2 ? 100 : 1;
                        instance.moveBy(-e.deltaX * multiplier, -e.deltaY * multiplier, false);
                    }
                    return true;
                }
                // Zoom in mouse mode
                return false;
            },
        });

        // Bind zoom event
        instance.on("zoom", (e: { getTransform: () => { scale: number } }) => {
            currentScale.value = e.getTransform().scale;
        });

        return instance;
    }

    /**
     * Zoom in canvas
     */
    function zoomIn() {
        if (!panzoomInstance) return;

        const transform = panzoomInstance.getTransform();
        const newScale = transform.scale * 1.2;

        // Ensure not exceeding maximum zoom
        if (newScale > maxZoom) return;

        // Get current viewport center point
        const containerRect = containerRef.value?.getBoundingClientRect();
        if (!containerRect) return;

        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;

        panzoomInstance.smoothZoom(centerX, centerY, 1.2);
    }

    /**
     * Zoom out canvas
     */
    function zoomOut() {
        if (!panzoomInstance) return;

        const transform = panzoomInstance.getTransform();
        const newScale = transform.scale * 0.8;

        // Ensure not below minimum zoom
        if (newScale < minZoom) return;

        // Get current viewport center point
        const containerRect = containerRef.value?.getBoundingClientRect();
        if (!containerRect) return;

        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;

        panzoomInstance.smoothZoom(centerX, centerY, 0.8);
    }

    /**
     * Reset canvas zoom
     */
    function resetZoom() {
        if (!panzoomInstance) return;

        initializeZoom();
    }

    /**
     * Focus current page content - display complete canvas
     */
    function focusContent() {
        if (!panzoomInstance || !containerRef.value || !contentRef.value) return;

        // Get container dimensions
        const containerRect = containerRef.value.getBoundingClientRect();

        // Get original content dimensions (using scrollWidth/Height, not affected by current transform)
        const contentElement = contentRef.value;
        const contentWidth = Math.max(contentElement.scrollWidth, contentElement.offsetWidth, 375); // Minimum 375px
        const contentHeight = Math.max(
            contentElement.scrollHeight,
            contentElement.offsetHeight,
            600,
        ); // Minimum 600px

        // Calculate appropriate display zoom ratio, reserve 40px margin
        const scaleX = (containerRect.width - 40) / contentWidth;
        const scaleY = (containerRect.height - 40) / contentHeight;
        const targetScale = Math.min(scaleX, scaleY);

        // Ensure zoom ratio is within allowed range
        const finalScale = Math.min(Math.max(targetScale, minZoom), maxZoom);

        // Calculate center position
        const centerX = (containerRect.width - contentWidth * finalScale) / 2;
        const centerY = (containerRect.height - contentHeight * finalScale) / 2;

        // Use smooth zoom and move directly, no longer step by step
        const containerCenterX = containerRect.width / 2;
        const containerCenterY = containerRect.height / 2;

        // First smooth zoom to target ratio
        panzoomInstance.smoothZoomAbs(containerCenterX, containerCenterY, finalScale);

        // Smooth move to center position after delay
        setTimeout(() => {
            if (panzoomInstance) {
                panzoomInstance.smoothMoveTo(centerX, centerY);
            }
        }, 250);
    }

    /**
     * Update interaction mode and recreate panzoom instance
     */
    function updateInteractionMode(mode: InteractionMode) {
        // Update mode
        currentMode.value = mode;
        onUpdateMode?.(mode);

        // If instance doesn't exist, no need to recreate
        if (!contentRef.value) return;

        recreatePanzoomInstance();
    }

    /**
     * Recreate panzoom instance, maintaining current transform state
     */
    function recreatePanzoomInstance() {
        // Save current state
        const transform = panzoomInstance?.getTransform();

        // Destroy old instance
        panzoomInstance?.dispose();

        // Create new instance
        panzoomInstance = createPanzoomInstance();

        // If there was previous state, restore it
        if (transform && panzoomInstance) {
            panzoomInstance.moveTo(transform.x, transform.y);
            panzoomInstance.zoomAbs(transform.x, transform.y, transform.scale);
        }
    }

    // Watch interaction mode changes
    watch(
        () => modelValue,
        (newMode) => {
            if (newMode !== currentMode.value) {
                updateInteractionMode(newMode);
            }
        },
        { immediate: true },
    );

    // Keyboard event handling
    function handleKeyDown(e: KeyboardEvent) {
        if (e.code === "Space" && !isSpacePressed.value) {
            isSpacePressed.value = true;
            e.preventDefault();
        }
    }

    function handleKeyUp(e: KeyboardEvent) {
        if (e.code === "Space" && isSpacePressed.value) {
            isSpacePressed.value = false;
        }
    }

    onMounted(() => {
        if (!contentRef.value) return;

        // Create panzoom instance
        panzoomInstance = createPanzoomInstance();

        // Wait for content rendering to complete before initializing zoom
        const observer = new ResizeObserver(() => {
            if (contentRef.value && containerRef.value) {
                observer.disconnect();
                nextTick(() => {
                    initializeZoom();
                });
            }
        });

        observer.observe(contentRef.value);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
    });

    onUnmounted(() => {
        panzoomInstance?.dispose();
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
    });

    return {
        contentRef,
        containerRef,
        currentScale,
        zoomIn,
        zoomOut,
        resetZoom,
        focusContent,
        updateInteractionMode,
    };
}
