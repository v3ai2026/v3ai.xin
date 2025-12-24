/**
 * @fileoverview Console API service functions for permission management
 * @description This file contains API functions for permission CRUD operations,
 * permission scanning, synchronization, and related type definitions for the console.
 *
 * @author BuildingAI Teams
 */

import type { BaseEntity } from "../models/globals";

// ==================== Type Definitions ====================

/**
 * Permission entity interface
 * @description Interface for permission data with all permission properties
 */
export interface Permission extends BaseEntity {
    /** Permission code */
    code: string;
    /** Permission name */
    name: string;
    /** Permission description */
    description?: string;
    /** Permission group */
    group: string;
    /** Whether the permission is deprecated */
    isDeprecated?: boolean;
}

/**
 * API permission information interface
 * @description Interface for API permission information with route details
 */
export interface ApiPermissionInfo {
    /** Permission code */
    code: string;
    /** Permission name */
    name: string;
    /** Permission description */
    description?: string;
    /** Permission group */
    group: string;
    /** Route path */
    path: string;
    /** HTTP method */
    method: string;
}

/**
 * Permission synchronization result interface
 * @description Interface for permission synchronization operation results
 */
export interface PermissionSyncResult {
    /** Number of added permissions */
    added: number;
    /** Number of updated permissions */
    updated: number;
    /** Number of deprecated permissions */
    deprecated: number;
    /** Total number of permissions */
    total: number;
}

/**
 * Permission cleanup result interface
 * @description Interface for permission cleanup operation results
 */
export interface PermissionCleanupResult {
    /** Number of removed permissions */
    removed: number;
}

/**
 * Permission group interface
 * @description Interface for permission group with associated permissions
 */
export interface PermissionGroup {
    /** Group code */
    code: string;
    /** Group name */
    name: string;
    /** Permissions in this group */
    permissions: Permission[];
}

// ==================== Permission Query Related APIs ====================

/**
 * Get all API permissions with permission codes
 * @description Scan and get all API interface information with permission codes in the system
 * @param group Whether to group the results, defaults to true
 * @returns Promise with API permission information list or grouped API permission information
 */
export function apiGetAllApiPermissions(
    group: boolean = true,
): Promise<ApiPermissionInfo[] | Record<string, ApiPermissionInfo[]>> {
    return useConsoleGet(`/permission/scan-permissions?group=${group}`);
}

/**
 * Get all permission list
 * @description Get permission list based on query conditions with support for grouped display
 * @param params Query parameters
 * @param params.type Permission type
 * @param params.group Permission group
 * @param params.keyword Keyword search
 * @param params.isDeprecated Whether to include deprecated permissions
 * @param params.isGrouped Whether to display in groups
 * @returns Promise with permission list or grouped permission list
 */
export function apiGetPermissionList(params?: {
    type?: string;
    group?: string;
    keyword?: string;
    isDeprecated?: boolean;
    isGrouped?: boolean;
}): Promise<Permission[] | PermissionGroup[]> {
    return useConsoleGet("/permission/list", params);
}

/**
 * Get all API router information with permissions
 * @description Scan and get all API interface information with permissions in the system
 * @param group Whether to group the results, defaults to true
 * @returns Promise with API interface information list or grouped API interface information
 */
export function apiGetApiRouterList(
    group: boolean = true,
): Promise<ApiPermissionInfo[] | Record<string, ApiPermissionInfo[]>> {
    return useConsoleGet(`/permission/scan-api?group=${group}`);
}

/**
 * Get permission detail by code
 * @description Get detailed permission information by permission code
 * @param code Permission code
 * @returns Promise with permission detail information
 */
export function apiGetPermissionByCode(code: string): Promise<Permission> {
    return useConsoleGet(`/permission/${code}`);
}

// ==================== Permission Management Related APIs ====================

/**
 * Sync API permissions to database
 * @description Scan system API interfaces and sync permission information to database
 * @returns Promise with synchronization result
 */
export function apiSyncApiPermissions(): Promise<PermissionSyncResult> {
    return useConsolePost("/permission/sync");
}

/**
 * Clean up deprecated permissions
 * @description Clean up deprecated or unused permission data in the system
 * @returns Promise with cleanup result
 */
export function apiCleanupDeprecatedPermissions(): Promise<PermissionCleanupResult> {
    return useConsolePost("/permission/cleanup");
}
