import { computed, shallowRef } from "vue";

import { useDesignStore } from "../stores/design";

/**
 * Design core Hook
 * Provides core state management and basic operations for design panel
 */
export function useDesignState() {
    const store = useDesignStore();

    // Core state
    const highlightArea = shallowRef<HighlightArea | null>(null);
    const guideLines = shallowRef<GuideLine[]>([]);
    const hasCollision = shallowRef(false);
    const isDragging = shallowRef(false);
    const isResizing = shallowRef(false);
    const resizeDirection = shallowRef<ResizeDirection | "">("");
    const resizeStartPosition = shallowRef<Position | null>(null);
    const resizeStartSize = shallowRef<Size | null>(null);
    const draggingComponentId = shallowRef<string | null>(null);
    const dragStartOffset = shallowRef<Position | null>(null);

    // Get component list and active component from store
    const components = computed(() => store.components);
    const activeComponentId = computed(() => store.activeComponent?.id);

    /**
     * Set highlight area
     */
    function setHighlightArea(area: HighlightArea | null) {
        // Ensure area is a valid object or null
        if (area !== null && typeof area === "object") {
            // Create a new object to avoid reference issues
            highlightArea.value = { ...area };
        } else {
            highlightArea.value = null;
        }
    }

    /**
     * Set guide lines
     */
    function setGuideLines(lines: GuideLine[]) {
        guideLines.value = lines;
    }

    /**
     * Set collision state
     */
    function setCollision(collision: boolean) {
        hasCollision.value = collision;
    }

    /**
     * Set dragging state
     */
    function setDragging(dragging: boolean, componentId: string | null = null) {
        isDragging.value = dragging;
        if (componentId !== null) {
            draggingComponentId.value = componentId;
        }
    }

    /**
     * Set resizing state
     */
    function setResizing(
        resizing: boolean,
        direction: ResizeDirection | "" = "",
        componentId: string | null = null,
    ) {
        isResizing.value = resizing;
        resizeDirection.value = direction;
        if (componentId !== null) {
            draggingComponentId.value = componentId;
        }
    }

    /**
     * Set resize start position and size
     */
    function setResizeStart(position: Position | null, size: Size | null) {
        resizeStartPosition.value = position;
        resizeStartSize.value = size;
    }

    /**
     * Set drag start offset
     */
    function setDragStartOffset(offset: Position | null) {
        dragStartOffset.value = offset ? { ...offset } : null;
    }

    /**
     * Clear all temporary state
     */
    function clearState() {
        highlightArea.value = null;
        guideLines.value = [];
        hasCollision.value = false;
        isDragging.value = false;
        isResizing.value = false;
        draggingComponentId.value = null;
        dragStartOffset.value = null;
        resizeStartPosition.value = null;
        resizeStartSize.value = null;
        resizeDirection.value = "";
    }

    /**
     * Add component
     */
    function addComponent(component: Omit<ComponentConfig, "id">) {
        return store.addComponent({
            ...component,
            isHidden: component.isHidden ?? false,
        });
    }

    /**
     * Update component position
     */
    function updatePosition(componentId: string, position: Position) {
        store.updatePosition(componentId, position);
    }

    /**
     * Update component size
     */
    function updateSize(componentId: string, size: Size) {
        store.updateSize(componentId, size);
    }

    /**
     * Set active component
     */
    function setActiveComponent(id: string) {
        store.setActiveComponent(id);
    }

    return {
        // State
        components,
        highlightArea,
        guideLines,
        hasCollision,
        isDragging,
        isResizing,
        resizeDirection,
        resizeStartPosition,
        resizeStartSize,
        draggingComponentId,
        dragStartOffset,
        activeComponentId,

        // State setter methods
        setHighlightArea,
        setGuideLines,
        setCollision,
        setDragging,
        setResizing,
        setResizeStart,
        setDragStartOffset,
        clearState,

        // Component operation methods
        addComponent,
        updatePosition,
        updateSize,
        setActiveComponent,
    };
}

// Export return type for other modules to reference
export type DesignCoreType = ReturnType<typeof useDesignState>;
