/**
 * @fileoverview Web API service functions for page decoration and layout management
 * @description This file contains API functions for layout configuration,
 * micro page management, and related type definitions for the web frontend.
 *
 * @author BuildingAI Teams
 */

import type { BaseEntity } from "../models/globals";

// ==================== Type Definitions ====================

/**
 * Layout data interface
 * @description Interface for layout configuration data
 */
export interface LayoutData extends BaseEntity {
    /** Layout name */
    name: string;
    /** Layout configuration data */
    data: Record<string, any>;
}

// ==================== Layout Configuration Related APIs ====================

/**
 * Get web layout configuration
 * @description Retrieves layout configuration information based on layout type
 * @param type Layout type (e.g., web)
 * @returns Promise with layout configuration information
 */
export function apiGetWebLayoutConfig(type: string): Promise<LayoutData> {
    return useWebGet(`/decorate-page/layout/${type}`);
}

// ==================== Micro Page Related APIs ====================

/**
 * Get micro page details
 * @description Retrieves detailed configuration information for a micro page by ID
 * @param id Micro page ID
 * @returns Promise with micro page detail data
 */
export function apiGetWebMicropageDetail(id: string): Promise<any> {
    return useWebGet(`/decorate-page/micropage/${id}`);
}
