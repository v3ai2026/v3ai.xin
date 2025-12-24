import type { Ref } from "vue";

import { useDesignGuides } from "./use-design-guides";
import { useDesignInteraction } from "./use-design-interaction";
import { useDesignState } from "./use-design-state";

/**
 * Design system main Hook
 * Integrates core, interaction and guide line functionality, provides unified interface
 *
 * Note:
 * 1. All returned state objects are reactive (ref), can be used directly for two-way binding in templates
 * 2. guides module is only used internally within interaction, not directly exposed to external
 */
export function useDesignSystem(designRef: Ref<HTMLElement | null>) {
    const core = useDesignState();
    const guides = useDesignGuides();
    const interaction = useDesignInteraction(designRef, core, guides);

    return {
        // Core state - these are all reactive objects, can be used for two-way binding
        components: core.components,
        highlightArea: core.highlightArea,
        guideLines: core.guideLines,
        hasCollision: core.hasCollision,
        isDragging: core.isDragging,
        draggingComponentId: core.draggingComponentId,
        activeComponentId: core.activeComponentId,

        // Interaction methods
        handleDragOver: interaction.handleDragOver,
        handleDragLeave: interaction.handleDragLeave,
        handleDrop: interaction.handleDrop,
        handleComponentMouseDown: interaction.handleComponentMouseDown,
        handleResizeStart: interaction.handleResizeStart,
    };
}
