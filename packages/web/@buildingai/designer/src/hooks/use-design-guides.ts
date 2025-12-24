import { DESIGN_CONFIG } from "../config/design";

/**
 * Guide line interface
 */
interface GuideLine {
    type: "vertical" | "horizontal";
    position: number;
    alignType?: string;
    isAlignmentLine?: boolean;
    isDistanceLine?: boolean;
    startX?: number;
    endX?: number;
    startY?: number;
    endY?: number;
    distance?: number;
    spacingType?: string;
    isEqualSpacing?: boolean;
}

/**
 * Design guides Hook
 * Provides Photoshop-like guide line calculation and snap functionality
 */
export function useDesignGuides() {
    /**
     * Check if position has collision
     * Note: Collision detection is disabled, allowing component overlap
     */
    function checkCollision(): boolean {
        // position: Position,
        // size: Size,
        // components: ComponentConfig[],
        // excludeId?: string,
        // Return false to allow component overlap
        return false;

        // Original collision detection logic (disabled)
        // return components.some((component) => {
        //     if (component.id === excludeId) return false;
        //     return (
        //         position.x < component.position.x + component.size.width &&
        //         position.x + size.width > component.position.x &&
        //         position.y < component.position.y + component.size.height &&
        //         position.y + size.height > component.position.y
        //     );
        // });
    }

    /**
     * Ensure value is not less than 0
     */
    function ensureMinimumOne(value: number): number {
        return Math.max(0, Math.round(value));
    }

    /**
     * Calculate guide lines
     */
    function calculateGuideLines(
        position: Position,
        size: Size,
        components: ComponentConfig[],
        excludeId?: string,
        canvasWidth = 800,
        canvasHeight = 600,
    ): GuideLine[] {
        const lines: GuideLine[] = [];
        const { SNAP_THRESHOLD } = DESIGN_CONFIG.value;

        const currentLeft = Math.round(position.x);
        const currentRight = Math.round(position.x + size.width);
        const currentTop = Math.round(position.y);
        const currentBottom = Math.round(position.y + size.height);
        const currentCenterX = Math.round(position.x + size.width / 2);
        const currentCenterY = Math.round(position.y + size.height / 2);

        // Canvas center point
        const canvasCenterX = Math.round(canvasWidth / 2);
        const canvasCenterY = Math.round(canvasHeight / 2);

        // Filter out current component
        const otherComponents = components.filter((comp) => comp.id !== excludeId);

        // === 1. Page edge relationships ===
        // A.left == 0 → Align with canvas left edge
        if (Math.abs(currentLeft - 0) < SNAP_THRESHOLD) {
            lines.push({
                type: "vertical",
                position: 0,
                alignType: "canvasLeft",
                isAlignmentLine: true,
            });
        }

        // A.right == canvas.width → Align with canvas right edge
        if (Math.abs(currentRight - canvasWidth) < SNAP_THRESHOLD) {
            lines.push({
                type: "vertical",
                position: canvasWidth,
                alignType: "canvasRight",
                isAlignmentLine: true,
            });
        }

        // A.top == 0 → Align with canvas top edge
        if (Math.abs(currentTop - 0) < SNAP_THRESHOLD) {
            lines.push({
                type: "horizontal",
                position: 0,
                alignType: "canvasTop",
                isAlignmentLine: true,
            });
        }

        // A.bottom == canvas.height → Align with canvas bottom edge
        if (Math.abs(currentBottom - canvasHeight) < SNAP_THRESHOLD) {
            lines.push({
                type: "horizontal",
                position: canvasHeight,
                alignType: "canvasBottom",
                isAlignmentLine: true,
            });
        }

        // A.centerX == canvas.centerX → Page horizontal center
        if (Math.abs(currentCenterX - canvasCenterX) < SNAP_THRESHOLD) {
            lines.push({
                type: "vertical",
                position: canvasCenterX,
                alignType: "canvasCenterX",
                isAlignmentLine: true,
            });
        }

        // A.centerY == canvas.centerY → Page vertical center
        if (Math.abs(currentCenterY - canvasCenterY) < SNAP_THRESHOLD) {
            lines.push({
                type: "horizontal",
                position: canvasCenterY,
                alignType: "canvasCenterY",
                isAlignmentLine: true,
            });
        }

        // === 2. 画布边界距离检测（显示距离最近的边界）===
        // 计算到四个边界的距离
        const distanceToLeft = currentLeft;
        const distanceToRight = canvasWidth - currentRight;
        const distanceToTop = currentTop;
        const distanceToBottom = canvasHeight - currentBottom;

        // 找出最近的边界距离
        const minDistance = Math.min(
            distanceToLeft,
            distanceToRight,
            distanceToTop,
            distanceToBottom,
        );

        // 只显示到最近边界的距离线
        if (minDistance === distanceToLeft && distanceToLeft > 0) {
            // 距离左边界最近 - 从组件左边缘到画布左边缘的水平连接线
            lines.push({
                type: "horizontal",
                position: currentTop + (currentBottom - currentTop) / 2, // 组件中心高度
                startX: 0, // 画布左边缘
                endX: currentLeft, // 组件左边缘
                distance: distanceToLeft,
                isDistanceLine: true,
                spacingType: "canvas-left",
            });
        } else if (minDistance === distanceToRight && distanceToRight > 0) {
            // 距离右边界最近 - 从组件右边缘到画布右边缘的水平连接线
            lines.push({
                type: "horizontal",
                position: currentTop + (currentBottom - currentTop) / 2, // 组件中心高度
                startX: currentRight, // 组件右边缘
                endX: canvasWidth, // 画布右边缘
                distance: distanceToRight,
                isDistanceLine: true,
                spacingType: "canvas-right",
            });
        } else if (minDistance === distanceToTop && distanceToTop > 0) {
            // 距离上边界最近 - 从组件上边缘到画布上边缘的垂直连接线
            lines.push({
                type: "vertical",
                position: currentLeft + (currentRight - currentLeft) / 2, // 组件中心宽度
                startY: 0, // 画布上边缘
                endY: currentTop, // 组件上边缘
                distance: distanceToTop,
                isDistanceLine: true,
                spacingType: "canvas-top",
            });
        } else if (minDistance === distanceToBottom && distanceToBottom > 0) {
            // 距离下边界最近 - 从组件下边缘到画布下边缘的垂直连接线
            lines.push({
                type: "vertical",
                position: currentLeft + (currentRight - currentLeft) / 2, // 组件中心宽度
                startY: currentBottom, // 组件下边缘
                endY: canvasHeight, // 画布下边缘
                distance: distanceToBottom,
                isDistanceLine: true,
                spacingType: "canvas-bottom",
            });
        }

        // === 3. 边界对齐检测 ===
        otherComponents.forEach((component) => {
            const left = Math.round(component.position.x);
            const right = Math.round(component.position.x + component.size.width);
            const top = Math.round(component.position.y);
            const bottom = Math.round(component.position.y + component.size.height);
            const centerX = Math.round(component.position.x + component.size.width / 2);
            const centerY = Math.round(component.position.y + component.size.height / 2);

            // A.left == B.left → 左对齐
            if (Math.abs(currentLeft - left) < SNAP_THRESHOLD) {
                lines.push({
                    type: "vertical",
                    position: left,
                    alignType: "leftAlign",
                    isAlignmentLine: true,
                });
            }

            // A.right == B.right → 右对齐
            if (Math.abs(currentRight - right) < SNAP_THRESHOLD) {
                lines.push({
                    type: "vertical",
                    position: right,
                    alignType: "rightAlign",
                    isAlignmentLine: true,
                });
            }

            // A.centerX == B.centerX → 水平居中对齐
            if (Math.abs(currentCenterX - centerX) < SNAP_THRESHOLD) {
                lines.push({
                    type: "vertical",
                    position: centerX,
                    alignType: "centerXAlign",
                    isAlignmentLine: true,
                });
            }

            // A.top == B.top → 上对齐
            if (Math.abs(currentTop - top) < SNAP_THRESHOLD) {
                lines.push({
                    type: "horizontal",
                    position: top,
                    alignType: "topAlign",
                    isAlignmentLine: true,
                });
            }

            // A.bottom == B.bottom → 下对齐
            if (Math.abs(currentBottom - bottom) < SNAP_THRESHOLD) {
                lines.push({
                    type: "horizontal",
                    position: bottom,
                    alignType: "bottomAlign",
                    isAlignmentLine: true,
                });
            }

            // A.centerY == B.centerY → 垂直居中对齐
            if (Math.abs(currentCenterY - centerY) < SNAP_THRESHOLD) {
                lines.push({
                    type: "horizontal",
                    position: centerY,
                    alignType: "centerYAlign",
                    isAlignmentLine: true,
                });
            }
        });

        // === 4. 边缘距离一致检测（等间距） ===
        // 收集所有水平和垂直的间距
        const horizontalSpacings: number[] = [];
        const verticalSpacings: number[] = [];

        otherComponents.forEach((comp1) => {
            otherComponents.forEach((comp2) => {
                if (comp1.id >= comp2.id) return; // 避免重复计算

                const comp1Left = Math.round(comp1.position.x);
                const comp1Right = Math.round(comp1.position.x + comp1.size.width);
                const comp1Top = Math.round(comp1.position.y);
                const comp1Bottom = Math.round(comp1.position.y + comp1.size.height);

                const comp2Left = Math.round(comp2.position.x);
                const comp2Right = Math.round(comp2.position.x + comp2.size.width);
                const comp2Top = Math.round(comp2.position.y);
                const comp2Bottom = Math.round(comp2.position.y + comp2.size.height);

                // 水平间距
                if (comp1Right < comp2Left) {
                    horizontalSpacings.push(comp2Left - comp1Right);
                } else if (comp2Right < comp1Left) {
                    horizontalSpacings.push(comp1Left - comp2Right);
                }

                // 垂直间距
                if (comp1Bottom < comp2Top) {
                    verticalSpacings.push(comp2Top - comp1Bottom);
                } else if (comp2Bottom < comp1Top) {
                    verticalSpacings.push(comp1Top - comp2Bottom);
                }
            });
        });

        // 检测当前组件与其他组件的间距是否与已有间距一致
        otherComponents.forEach((component) => {
            const left = Math.round(component.position.x);
            const right = Math.round(component.position.x + component.size.width);
            const top = Math.round(component.position.y);
            const bottom = Math.round(component.position.y + component.size.height);

            // 水平等间距检测
            const verticalOverlap = !(currentBottom <= top || currentTop >= bottom);
            if (verticalOverlap) {
                let spacing = 0;
                let startX = 0;
                let endX = 0;
                let _isRightOfComponent = false;

                if (currentLeft > right) {
                    // 当前组件在目标组件右侧
                    spacing = currentLeft - right;
                    startX = right;
                    endX = currentLeft;
                    _isRightOfComponent = true;
                } else if (currentRight < left) {
                    // 当前组件在目标组件左侧
                    spacing = left - currentRight;
                    startX = currentRight;
                    endX = left;
                    _isRightOfComponent = false;
                }

                if (spacing > 0) {
                    // 检查是否与已有间距匹配
                    const matchingSpacing = horizontalSpacings.find(
                        (s) => Math.abs(s - spacing) < SNAP_THRESHOLD,
                    );

                    if (matchingSpacing) {
                        const overlapTop = Math.max(currentTop, top);
                        const overlapBottom = Math.min(currentBottom, bottom);
                        const connectY = overlapTop + (overlapBottom - overlapTop) / 2;

                        lines.push({
                            type: "horizontal",
                            position: connectY,
                            startX: startX,
                            endX: endX,
                            distance: spacing,
                            isDistanceLine: true,
                            spacingType: "horizontal",
                            isEqualSpacing: true,
                        });
                    }
                }
            }

            // 垂直等间距检测
            const horizontalOverlap = !(currentRight <= left || currentLeft >= right);
            if (horizontalOverlap) {
                let spacing = 0;
                let startY = 0;
                let endY = 0;
                let _isBelowComponent = false;

                if (currentTop > bottom) {
                    // 当前组件在目标组件下方
                    spacing = currentTop - bottom;
                    startY = bottom;
                    endY = currentTop;
                    _isBelowComponent = true;
                } else if (currentBottom < top) {
                    // 当前组件在目标组件上方
                    spacing = top - currentBottom;
                    startY = currentBottom;
                    endY = top;
                    _isBelowComponent = false;
                }

                if (spacing > 0) {
                    // 检查是否与已有间距匹配
                    const matchingSpacing = verticalSpacings.find(
                        (s) => Math.abs(s - spacing) < SNAP_THRESHOLD,
                    );

                    if (matchingSpacing) {
                        const overlapLeft = Math.max(currentLeft, left);
                        const overlapRight = Math.min(currentRight, right);
                        const connectX = overlapLeft + (overlapRight - overlapLeft) / 2;

                        lines.push({
                            type: "vertical",
                            position: connectX,
                            startY: startY,
                            endY: endY,
                            distance: spacing,
                            isDistanceLine: true,
                            spacingType: "vertical",
                            isEqualSpacing: true,
                        });
                    }
                }
            }
        });

        // === 5. 普通组件间距显示（非等间距情况） ===
        otherComponents.forEach((component) => {
            const left = Math.round(component.position.x);
            const right = Math.round(component.position.x + component.size.width);
            const top = Math.round(component.position.y);
            const bottom = Math.round(component.position.y + component.size.height);

            // 水平间距检测
            const verticalOverlap = !(currentBottom <= top || currentTop >= bottom);
            if (verticalOverlap) {
                if (currentLeft > right && currentLeft - right <= 100) {
                    const distance = currentLeft - right;
                    const overlapTop = Math.max(currentTop, top);
                    const overlapBottom = Math.min(currentBottom, bottom);
                    const connectY = overlapTop + (overlapBottom - overlapTop) / 2;

                    lines.push({
                        type: "horizontal",
                        position: connectY,
                        startX: right,
                        endX: currentLeft,
                        distance: distance,
                        isDistanceLine: true,
                        spacingType: "horizontal",
                    });
                }

                if (currentRight < left && left - currentRight <= 100) {
                    const distance = left - currentRight;
                    const overlapTop = Math.max(currentTop, top);
                    const overlapBottom = Math.min(currentBottom, bottom);
                    const connectY = overlapTop + (overlapBottom - overlapTop) / 2;

                    lines.push({
                        type: "horizontal",
                        position: connectY,
                        startX: currentRight,
                        endX: left,
                        distance: distance,
                        isDistanceLine: true,
                        spacingType: "horizontal",
                    });
                }
            }

            // 垂直间距检测
            const horizontalOverlap = !(currentRight <= left || currentLeft >= right);
            if (horizontalOverlap) {
                if (currentTop > bottom && currentTop - bottom <= 100) {
                    const distance = currentTop - bottom;
                    const overlapLeft = Math.max(currentLeft, left);
                    const overlapRight = Math.min(currentRight, right);
                    const connectX = overlapLeft + (overlapRight - overlapLeft) / 2;

                    lines.push({
                        type: "vertical",
                        position: connectX,
                        startY: bottom,
                        endY: currentTop,
                        distance: distance,
                        isDistanceLine: true,
                        spacingType: "vertical",
                    });
                }

                if (currentBottom < top && top - currentBottom <= 100) {
                    const distance = top - currentBottom;
                    const overlapLeft = Math.max(currentLeft, left);
                    const overlapRight = Math.min(currentRight, right);
                    const connectX = overlapLeft + (overlapRight - overlapLeft) / 2;

                    lines.push({
                        type: "vertical",
                        position: connectX,
                        startY: currentBottom,
                        endY: top,
                        distance: distance,
                        isDistanceLine: true,
                        spacingType: "vertical",
                    });
                }
            }
        });

        return lines;
    }

    /**
     * Snap to guide lines
     */
    function snapToGuideLines(position: Position, size: Size, guideLines: GuideLine[]): Position {
        const result = { ...position };
        const right = ensureMinimumOne(result.x + size.width);
        const bottom = ensureMinimumOne(result.y + size.height);
        const centerX = ensureMinimumOne(result.x + size.width / 2);
        const centerY = ensureMinimumOne(result.y + size.height / 2);

        let minVerticalDelta = DESIGN_CONFIG.value.SNAP_THRESHOLD;
        let snappedVerticalX = result.x;
        let minHorizontalDelta = DESIGN_CONFIG.value.SNAP_THRESHOLD;
        let snappedHorizontalY = result.y;

        guideLines.forEach((line) => {
            // 只有对齐线才参与吸附，间距线不参与吸附
            if (!line.isAlignmentLine) return;

            if (line.type === "vertical") {
                const deltas = [
                    { pos: ensureMinimumOne(line.position), current: result.x },
                    { pos: ensureMinimumOne(line.position - size.width), current: right },
                    { pos: ensureMinimumOne(line.position - size.width / 2), current: centerX },
                ];
                deltas.forEach(({ pos, current }) => {
                    const delta = Math.abs(current - line.position);
                    if (delta < minVerticalDelta) {
                        minVerticalDelta = delta;
                        snappedVerticalX = pos;
                    }
                });
            } else {
                const deltas = [
                    { pos: ensureMinimumOne(line.position), current: result.y },
                    { pos: ensureMinimumOne(line.position - size.height), current: bottom },
                    { pos: ensureMinimumOne(line.position - size.height / 2), current: centerY },
                ];
                deltas.forEach(({ pos, current }) => {
                    const delta = Math.abs(current - line.position);
                    if (delta < minHorizontalDelta) {
                        minHorizontalDelta = delta;
                        snappedHorizontalY = pos;
                    }
                });
            }
        });

        if (minVerticalDelta <= DESIGN_CONFIG.value.SNAP_THRESHOLD) {
            result.x = ensureMinimumOne(snappedVerticalX);
        }
        if (minHorizontalDelta <= DESIGN_CONFIG.value.SNAP_THRESHOLD) {
            result.y = ensureMinimumOne(snappedHorizontalY);
        }

        return result;
    }

    /**
     * Ensure component is within design area boundaries
     */
    function ensureInBounds(
        position: Position,
        size: Size,
        designWidth: number,
        designHeight: number,
    ): Position {
        const result = { ...position };

        result.x = Math.max(0, Math.min(result.x, designWidth - size.width));
        result.y = Math.max(0, Math.min(result.y, designHeight - size.height));

        return result;
    }

    return {
        checkCollision,
        calculateGuideLines,
        snapToGuideLines,
        ensureInBounds,
    };
}

export type DesignGuidesType = ReturnType<typeof useDesignGuides>;
