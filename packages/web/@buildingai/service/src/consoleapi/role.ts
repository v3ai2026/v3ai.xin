/**
 * @fileoverview Console API service functions for role management
 * @description This file contains API functions for role CRUD operations,
 * permission assignment, and related type definitions for the console.
 *
 * @author BuildingAI Teams
 */

import type { BaseEntity, BaseQueryParams, PaginationResult } from "../models/globals";
import type { Permission } from "./permission";

// ==================== Type Definitions ====================

/**
 * Role query request parameters interface
 * @description Interface for role query request parameters with pagination
 */
export interface RoleQueryRequest extends BaseQueryParams {
    /** Role name (exact match) */
    name?: string;
    /** Role description (fuzzy match) */
    description?: string;
}

/**
 * Role form data interface
 * @description Interface for role form data with all role properties
 */
export interface RoleFormData extends BaseEntity {
    /** Role name */
    name: string;
    /** Role description */
    description: string;
    /** Associated permissions list */
    permissions: Permission[];
}

/**
 * Role creation request type
 * @description Excludes auto-generated fields and permissions from RoleFormData
 */
export type RoleCreateRequest = Omit<
    RoleFormData,
    "id" | "createdAt" | "updatedAt" | "permissions"
>;

/**
 * Role update request interface
 * @description Inherits from creation request and makes all fields optional
 */
export interface RoleUpdateRequest extends Partial<RoleCreateRequest> {
    /** Role ID (required for updates) */
    id: string;
}

// ==================== Role Query Related APIs ====================

/**
 * Get role list
 * @description Get paginated role list based on query conditions
 * @param params Query parameters
 * @returns Promise with paginated role list result
 */
export function apiGetRoleList(params: RoleQueryRequest): Promise<PaginationResult<RoleFormData>> {
    return useConsoleGet("/role", params);
}

/**
 * Get all role list
 * @description Get all roles in the system without pagination
 * @returns Promise with all role list
 */
export function apiGetAllRoleList(): Promise<RoleFormData[]> {
    return useConsoleGet("/role/all");
}

/**
 * Get role detail
 * @description Get detailed role information by role ID
 * @param id Role ID
 * @returns Promise with role detail information
 */
export function apiGetRoleDetail(id: string): Promise<RoleFormData> {
    return useConsoleGet(`/role/${id}`);
}

// ==================== Role Management Related APIs ====================

/**
 * Create role
 * @description Create a new role
 * @param data Role creation data
 * @returns Promise with created role information
 */
export function apiCreateRole(data: RoleCreateRequest): Promise<RoleFormData> {
    return useConsolePost("/role", data);
}

/**
 * Update role
 * @description Update role information
 * @param data Role update data
 * @returns Promise with updated role information
 */
export function apiUpdateRole(data: RoleUpdateRequest): Promise<RoleFormData> {
    return useConsolePut(`/role`, data);
}

/**
 * Delete role
 * @description Delete specified role by role ID
 * @param id Role ID
 * @returns Promise with deletion result
 */
export function apiDeleteRole(id: string): Promise<void> {
    return useConsoleDelete(`/role/${id}`);
}

/**
 * Batch delete roles
 * @description Batch delete multiple roles by role ID array
 * @param params Delete parameters
 * @param params.ids Array of role IDs
 * @returns Promise with deletion result
 */
export function apiBatchDeleteRole(params: { ids: string[] }): Promise<void> {
    return useConsolePost(`/role/batch-delete`, params);
}

// ==================== Permission Management Related APIs ====================

/**
 * Assign permissions to role
 * @description Assign permissions to specified role
 * @param data Permission assignment data
 * @param data.id Role ID
 * @param data.permissionIds Array of permission IDs
 * @returns Promise with updated role information
 */
export function apiAssignPermissions(data: {
    id: string;
    permissionIds: string[];
}): Promise<RoleFormData> {
    return useConsolePut(`/role/permissions`, data);
}
