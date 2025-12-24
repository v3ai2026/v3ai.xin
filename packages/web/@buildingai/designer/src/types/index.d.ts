/**
 * Design component type definitions
 */

/** Guide line type */
type GuideLineType = "vertical" | "horizontal";

/** Resize direction */
type ResizeDirection = "n" | "s" | "e" | "w" | "nw" | "ne" | "sw" | "se";

/** Position information */
interface Position {
    /** X coordinate (pixels) */
    x: number;
    /** Y coordinate (pixels) */
    y: number;
}

/** Size information */
interface Size {
    /** Width (pixels) */
    width: number;
    /** Height (pixels) */
    height: number;
    /** Width adaptation mode: percent (percentage) or fixed (fixed pixels) */
    widthMode?: "percent" | "fixed";
    /** Height adaptation mode: percent (percentage) or fixed (fixed pixels) */
    heightMode?: "percent" | "fixed";
}

/** Highlight area */
interface HighlightArea extends Position, Size {}

/** Guide line information */
interface GuideLine {
    /** Guide line type */
    type: GuideLineType;
    /** Position (pixels) */
    position: number;
    /** Length (pixels) */
    length?: number;
}

/** Component basic configuration */
interface ComponentConfig {
    /** Component unique identifier */
    id: string;
    /** Component type */
    type: string;
    /** Component name */
    title: string;
    /** Component position */
    position: Position;
    /** Component size */
    size: Size;
    /** Component properties */
    props: Record<string, unknown>;
    /** Whether the component is hidden */
    isHidden?: boolean;
    /** Layer level (z-index) */
    zIndex?: number;
}

/** Decoration terminal creation web / mobile */
type DecorateScene = "web" | "mobile";

/** Design canvas configuration */
interface DesignConfig {
    /** Canvas width (pixels) */
    width: number;
    /** Canvas height (pixels) */
    height: number;
    /** Device type */
    deviceType?: DecorateScene;
}

/** Page configuration */
interface PageMateConfig {
    /** Background color */
    backgroundColor: string;
    /** Dark mode background color */
    backgroundDarkColor: string;
    /** Background image */
    backgroundImage: string;
    /** Background type */
    backgroundType: "solid" | "image";
    /** Page height */
    pageHeight: number;
}

/**
 * Component category information
 */
interface ComponentCategory {
    id: string;
    title: string;
}

/** Component menu item */
interface ComponentMenuItem<T = Record<string, unknown>> {
    /** Component unique identifier */
    id: string;
    /** Component type */
    type: string;
    /** Component title */
    title: string;
    /** Component icon */
    icon: string;
    /** Whether the component is hidden */
    isHidden?: boolean;
    /** Component category */
    category: ComponentCategory;
    /** Default size */
    size: Size;
    /** Default properties */
    props: T;
    /** Sort weight, smaller numbers sort first */
    order?: number;
}

/** Drag data */
interface DragData {
    /** Component type */
    type: string;
    /** Other data */
    [key: string]: unknown;
}

// Component drag state
interface DragState {
    isDragging: boolean;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
}

// Resize state
interface ResizeState {
    isResizing: boolean;
    direction: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
}

// Collision detection result
interface CollisionResult {
    hasCollision: boolean;
    collidingIds: string[];
}
