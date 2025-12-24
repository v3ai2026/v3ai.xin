import type { Ref } from "vue";

import { useDesignStore } from "../stores/design";
import type { DesignGuidesType } from "./use-design-guides";
import type { DesignCoreType } from "./use-design-state";

interface InteractionState {
    animationFrameId: number | null;
    dragAnimationFrameId: number | null;
}

/**
 * Design interaction Hook
 * Handles component drag and resize interaction logic
 */
export function useDesignInteraction(
    designRef: Ref<HTMLElement | null>,
    core: DesignCoreType,
    guides: DesignGuidesType,
) {
    const gridStore = useDesignStore();
    const state: InteractionState = {
        animationFrameId: null,
        dragAnimationFrameId: null,
    };

    /**
     * Get design container and zoom container
     */
    function getContainers() {
        const design = designRef.value;
        if (!design) return null;

        // First try to find zoom container by traversing up from design container
        let zoomContainer = design.closest(".zoom-content") as HTMLElement | null;
        // Fallback: if not found, try global query
        if (!zoomContainer) {
            zoomContainer = document.querySelector(".zoom-content") as HTMLElement | null;
        }
        // Final fallback: use parent as zoom container, treat as unzoomed
        if (!zoomContainer) {
            return { design, zoomContainer: design.parentElement as HTMLElement } as const;
        }

        return { design, zoomContainer } as const;
    }

    /**
     * Get mouse pixel position in design canvas
     */
    function getDesignPosition(event: DragEvent | MouseEvent): Position {
        const containers = getContainers();
        if (!containers) return { x: 0, y: 0 };

        const { design, zoomContainer } = containers;

        // Get zoom container transform information
        const style = window.getComputedStyle(zoomContainer);
        const transformStr = style.transform;
        // Handle case where transform is 'none'
        const matrix =
            transformStr && transformStr !== "none" ? new DOMMatrix(transformStr) : new DOMMatrix();
        const scale = matrix.a || 1; // transform.a is x-axis scale value

        // Calculate actual mouse position relative to design canvas
        const designRect = design.getBoundingClientRect();
        const rawX = (event.clientX - designRect.left) / scale;
        const rawY = (event.clientY - designRect.top) / scale;

        // Limit to design area bounds
        return {
            x: Math.max(0, Math.min(rawX, design.clientWidth)),
            y: Math.max(0, Math.min(rawY, design.clientHeight)),
        };
    }

    /**
     * Ensure value is integer
     */
    function ensureInteger(value: number): number {
        return Math.round(value);
    }

    /**
     * Ensure position is integer
     */
    function ensureIntegerPosition(position: Position): Position {
        return {
            x: ensureInteger(position.x),
            y: ensureInteger(position.y),
        };
    }

    /**
     * Ensure size is integer
     */
    function ensureIntegerSize(size: Size): Size {
        return {
            width: Math.min(size.width, designRef.value?.clientWidth ?? Infinity),
            height: Math.min(size.height, designRef.value?.clientHeight ?? Infinity),
        };
    }

    /**
     * Cancel pending animation frames
     */
    function cancelPendingFrames() {
        if (state.animationFrameId !== null) {
            cancelAnimationFrame(state.animationFrameId);
            state.animationFrameId = null;
        }
        if (state.dragAnimationFrameId !== null) {
            cancelAnimationFrame(state.dragAnimationFrameId);
            state.dragAnimationFrameId = null;
        }
    }

    /**
     * Handle drag over
     */
    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        cancelPendingFrames();

        state.animationFrameId = requestAnimationFrame(() => {
            const { draggedComponent } = gridStore;
            const design = designRef.value;
            if (!draggedComponent || !design) {
                core.clearState();
                return;
            }

            // Check if within design area
            const rect = design.getBoundingClientRect();
            if (
                event.clientX < rect.left ||
                event.clientX > rect.right ||
                event.clientY < rect.top ||
                event.clientY > rect.bottom
            ) {
                core.clearState();
                return;
            }

            // Calculate adjusted position
            const position = getDesignPosition(event);
            const { size } = draggedComponent;
            const adjustedPosition = {
                x: Math.max(
                    0,
                    Math.min(position.x - size.width / 2, design.clientWidth - size.width),
                ),
                y: Math.max(
                    0,
                    Math.min(position.y - size.height / 2, design.clientHeight - size.height),
                ),
            };

            // Collision detection
            const hasCollision = guides
                .checkCollision
                // adjustedPosition,
                // size,
                // gridStore.components,
                ();

            // Update state
            core.setHighlightArea({
                ...adjustedPosition,
                width: size.width,
                height: size.height,
            });
            core.setCollision(hasCollision);

            if (!hasCollision) {
                // Update guide lines
                const guideLines: GuideLine[] = [
                    { type: "vertical", position: adjustedPosition.x },
                    { type: "vertical", position: adjustedPosition.x + size.width },
                    { type: "horizontal", position: adjustedPosition.y },
                    { type: "horizontal", position: adjustedPosition.y + size.height },
                ];
                core.setGuideLines(guideLines);
            }
        });
    }

    /**
     * Handle drag leave
     */
    function handleDragLeave() {
        cancelPendingFrames();
        core.clearState();
    }

    /**
     * Handle drop
     */
    function handleDrop(event: DragEvent) {
        cancelPendingFrames();

        const { draggedComponent } = gridStore;
        if (!draggedComponent || core.hasCollision.value) {
            core.clearState();
            return;
        }

        const position = getDesignPosition(event);
        const { type, title, size, props, isHidden } = draggedComponent;
        const design = designRef.value;

        // Calculate initial position
        let dropPosition = {
            x: position.x - size.width / 2,
            y: position.y - size.height / 2,
        };

        // Position correction
        if (design) {
            dropPosition = guides.snapToGuideLines(dropPosition, size, core.guideLines.value);
            dropPosition = guides.ensureInBounds(
                dropPosition,
                size,
                design.clientWidth,
                design.clientHeight,
            );
        }

        // Add new component
        const newComponent = core.addComponent({
            type,
            title,
            position: dropPosition,
            isHidden,
            size,
            props,
        });

        // Set new component as active
        if (newComponent) {
            core.setActiveComponent(newComponent.id);
        }

        // Clear state
        core.clearState();
        gridStore.setDraggedComponent(null);
    }

    /**
     * Handle component mouse down
     */
    function handleComponentMouseDown(component: ComponentConfig, event: MouseEvent) {
        if (event.button === 2) return; // Ignore right click

        core.setActiveComponent(component.id);
        core.setDragging(true, component.id);

        // Calculate initial offset
        const position = getDesignPosition(event);
        core.setDragStartOffset({
            x: position.x - component.position.x,
            y: position.y - component.position.y,
        });

        // Use one-time event listeners
        const mouseUpHandler = () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
            handleMouseUp();
        };

        const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
    }

    /**
     * Calculate new position and size based on resize direction
     */
    function calculateNewPositionAndSize(
        direction: string,
        position: Position,
        size: Size,
        deltaX: number,
        deltaY: number,
    ) {
        // Convert delta values to integers
        deltaX = ensureInteger(deltaX);
        deltaY = ensureInteger(deltaY);

        const newPosition = { ...position };
        const newSize = { ...size };

        // Handle horizontal direction
        if (direction.includes("w")) {
            const newWidth = size.width - deltaX;
            if (newWidth >= 1) {
                newPosition.x = position.x + deltaX;
                newSize.width = newWidth;
            }
        } else if (direction.includes("e")) {
            const newWidth = size.width + deltaX;
            if (newWidth >= 1) {
                newSize.width = newWidth;
            }
        }

        // Handle vertical direction
        if (direction.includes("n")) {
            const newHeight = size.height - deltaY;
            if (newHeight >= 1) {
                newPosition.y = position.y + deltaY;
                newSize.height = newHeight;
            }
        } else if (direction.includes("s")) {
            const newHeight = size.height + deltaY;
            if (newHeight >= 1) {
                newSize.height = newHeight;
            }
        }

        // Ensure all values are integers
        return {
            position: ensureIntegerPosition(newPosition),
            size: ensureIntegerSize(newSize),
        };
    }

    /**
     * Handle component dragging
     */
    function handleDragging(component: ComponentConfig, position: Position) {
        if (!core.dragStartOffset.value) return;

        let newPosition = ensureIntegerPosition({
            x: ensureInteger(position.x - core.dragStartOffset.value.x),
            y: ensureInteger(position.y - core.dragStartOffset.value.y),
        });

        const design = designRef.value;
        if (design) {
            newPosition = ensureIntegerPosition(
                guides.ensureInBounds(
                    newPosition,
                    component.size,
                    design.clientWidth,
                    design.clientHeight,
                ),
            );
        }

        // Guide line handling
        const guideLines = guides.calculateGuideLines(
            newPosition,
            component.size,
            gridStore.components,
            component.id,
            design?.clientWidth || 800,
            design?.clientHeight || 600,
        );

        if (guideLines.length > 0) {
            newPosition = ensureIntegerPosition(
                guides.snapToGuideLines(newPosition, component.size, guideLines),
            );
        }

        // Collision detection
        const hasCollision = guides
            .checkCollision
            // newPosition,
            // component.size,
            // gridStore.components,
            // component.id,
            ();

        core.setHighlightArea({
            ...newPosition,
            width: component.size.width,
            height: component.size.height,
        });
        core.setCollision(hasCollision);

        if (!hasCollision) {
            core.setGuideLines(guideLines);
            gridStore.updatePosition(component.id, newPosition);
        }
    }

    /**
     * Handle resize start
     */
    function handleResizeStart(component: ComponentConfig, direction: string, event: MouseEvent) {
        event.stopPropagation();

        // Set current active component and resize state
        core.setActiveComponent(component.id);
        core.setResizing(true, direction as ResizeDirection, component.id);

        // Record initial position and size
        core.setResizeStart({ ...component.position }, { ...component.size });

        // Record initial mouse position
        const mousePosition = getDesignPosition(event);
        core.setDragStartOffset(mousePosition);

        // Use one-time event listeners
        const mouseUpHandler = () => {
            document.removeEventListener("mousemove", mouseMoveHandler);
            document.removeEventListener("mouseup", mouseUpHandler);
            handleMouseUp();
        };

        const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e);

        document.addEventListener("mousemove", mouseMoveHandler);
        document.addEventListener("mouseup", mouseUpHandler);
    }

    /**
     * Handle mouse move
     */
    function handleMouseMove(event: MouseEvent) {
        if (!core.isDragging.value && !core.isResizing.value) return;

        state.dragAnimationFrameId = requestAnimationFrame(() => {
            const component = gridStore.components.find(
                (c: ComponentConfig) => c.id === core.draggingComponentId.value,
            );
            if (!component) return;

            const position = getDesignPosition(event);

            if (core.isDragging.value) {
                handleDragging(component, position);
            } else if (core.isResizing.value) {
                handleResizing(component, position);
            }
        });
    }

    /**
     * Handle component resizing
     */
    function handleResizing(component: ComponentConfig, position: Position) {
        if (
            !core.resizeStartPosition.value ||
            !core.resizeStartSize.value ||
            !core.resizeDirection.value ||
            !core.dragStartOffset.value
        ) {
            return;
        }

        const deltaX = position.x - core.dragStartOffset.value.x;
        const deltaY = position.y - core.dragStartOffset.value.y;

        // Calculate new size and position
        const result = calculateNewPositionAndSize(
            core.resizeDirection.value,
            core.resizeStartPosition.value,
            core.resizeStartSize.value,
            deltaX,
            deltaY,
        );

        let newPosition = result.position;
        const newSize = result.size;

        // When resizing, limit size to not exceed design panel
        const design = designRef.value;
        if (design) {
            newPosition = ensureIntegerPosition(
                guides.ensureInBounds(
                    newPosition,
                    newSize,
                    design.clientWidth,
                    design.clientHeight,
                ),
            );
        }

        // Guide line handling
        const guideLines = guides.calculateGuideLines(
            newPosition,
            newSize,
            gridStore.components,
            component.id,
            design?.clientWidth || 800,
            design?.clientHeight || 600,
        );

        if (guideLines.length > 0) {
            newPosition = ensureIntegerPosition(
                guides.snapToGuideLines(newPosition, newSize, guideLines),
            );
        }

        // Collision detection
        const hasCollision = guides
            .checkCollision
            // newPosition,
            // newSize,
            // gridStore.components,
            // component.id,
            ();

        // Update highlight area
        core.setHighlightArea({
            ...newPosition,
            width: newSize.width,
            height: newSize.height,
        });

        core.setCollision(hasCollision);

        if (!hasCollision) {
            core.setGuideLines(guideLines);
            gridStore.updatePosition(component.id, newPosition);
            gridStore.updateSize(component.id, newSize);
        }
    }

    /**
     * Handle mouse up
     */
    function handleMouseUp() {
        cancelPendingFrames();
        core.clearState();
    }

    return {
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleComponentMouseDown,
        handleResizeStart,
    };
}
