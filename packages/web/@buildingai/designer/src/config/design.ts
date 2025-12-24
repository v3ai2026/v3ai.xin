import { ref } from "vue";

import { importComponentConfigs } from "../utils/components-dynamic";

/**
 * Design canvas configuration interface
 */
export interface DesignConfigInterface {
    /** Default canvas width (pixels) */
    DEFAULT_WIDTH: number;
    /** Default canvas height (pixels) */
    DEFAULT_HEIGHT: number;
    /** Maximum canvas height (pixels) */
    MAX_HEIGHT: number;
    /** Canvas padding (pixels) */
    PADDING: number;
    /** Guide line snap threshold (pixels) */
    SNAP_THRESHOLD: number;
    /** Safe area width (pixels) */
    SAFE_AREA_WIDTH: number;
}

/**
 * PC design canvas configuration constants
 */
export const PC_DESIGN_CONFIG: DesignConfigInterface = {
    /** Default canvas width (pixels) */
    DEFAULT_WIDTH: 1920,
    /** Default canvas height (pixels) */
    DEFAULT_HEIGHT: 1080,
    /** Maximum canvas height (pixels) */
    MAX_HEIGHT: 30000,
    /** Canvas padding (pixels) */
    PADDING: 40,
    /** Guide line snap threshold (pixels) */
    SNAP_THRESHOLD: 5,
    /** Safe area width (pixels) */
    SAFE_AREA_WIDTH: 1200,
} as const;

/**
 * Mobile design canvas configuration constants
 */
export const MOBILE_DESIGN_CONFIG: DesignConfigInterface = {
    /** Default canvas width (pixels) */
    DEFAULT_WIDTH: 375,
    /** Default canvas height (pixels) */
    DEFAULT_HEIGHT: 667,
    /** Maximum canvas height (pixels) */
    MAX_HEIGHT: 10000,
    /** Canvas padding (pixels) */
    PADDING: 16,
    /** Guide line snap threshold (pixels) */
    SNAP_THRESHOLD: 3,
    /** Safe area width (pixels) */
    SAFE_AREA_WIDTH: 343,
} as const;

/** Design canvas configuration */
export const DESIGN_CONFIG = ref<DesignConfigInterface>(PC_DESIGN_CONFIG);
/** Currently selected device type */
export const DEFAULT_DEVICE_TYPE = ref<DecorateScene>("web");

/**
 * Get design configuration
 * @param deviceType Device type
 * @param scene Scene type, used for loading specific components
 */
export function setDesignConfig(deviceType: DecorateScene) {
    importComponentConfigs(deviceType as DecorateScene);
    DEFAULT_DEVICE_TYPE.value = deviceType;
    DESIGN_CONFIG.value = deviceType === "web" ? PC_DESIGN_CONFIG : MOBILE_DESIGN_CONFIG;
}
