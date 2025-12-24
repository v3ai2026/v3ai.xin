/**
 * @fileoverview Console API service functions for Secret management
 * @description This file contains API functions for Secret CRUD operations,
 * secret configuration management, and related type definitions for the console.
 *
 * @author BuildingAI Teams
 */

// ==================== Type Definitions ====================

/**
 * Secret request interface
 * @description Interface for Secret configuration requests
 */
export interface SecretConfigRequest {
    name: string;
    templateId?: string;
    fieldValues: FieldValues[];
    remark: string;
    status: number;
    sortOrder: number;
    [key: string]: any; // Allow dynamic fields
}

/**
 * Field values interface
 * @description Interface for field value pairs in Secret configuration
 */
export interface FieldValues {
    name: string;
    value: string;
    [key: string]: any; // Allow dynamic fields
}

/**
 * Secret list interface
 * @description Interface for paginated Secret list response
 */
export interface SecretList {
    items: SecretConfigRequest[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

// ==================== Secret Management Related APIs ====================

/**
 * Get secret list
 * @description Retrieves paginated list of secrets
 * @param params Pagination parameters
 * @returns Promise with secret list
 */
export const getSecretList = (params: { page: number; pageSize: number }): Promise<SecretList> => {
    return useConsoleGet("/secret", params);
};

/**
 * Get secret configs by template
 * @description Retrieves secret configs by template ID
 * @param templateId Template ID
 * @param onlyActive Whether to get only active configs
 * @returns Promise with secret configs list
 */
export const getSecretConfigsByTemplate = (templateId: string, onlyActive?: boolean) => {
    return useConsoleGet(`/secret/by-template/${templateId}`, { onlyActive });
};

/**
 * Get secret stats
 * @description Retrieves secret configuration statistics
 * @param templateId Optional template ID filter
 * @returns Promise with stats data
 */
export const getSecretStats = (templateId?: string) => {
    return useConsoleGet("/secret/stats", { templateId });
};

/**
 * Get secret details
 * @description Retrieves detailed information for a specific secret
 * @param id Secret ID
 * @returns Promise with secret details
 */
export const getSecretDetail = (id: string): Promise<SecretConfigRequest> => {
    return useConsoleGet(`/secret/${id}`);
};

/**
 * Get secret details with sensitive info
 * @description Retrieves detailed information for a specific secret including sensitive data
 * @param id Secret ID
 * @returns Promise with full secret details
 */
export const getSecretDetailFull = (id: string): Promise<SecretConfigRequest> => {
    return useConsoleGet(`/secret/${id}/full`);
};

/**
 * Create secret
 * @description Creates a new secret configuration
 * @param data Secret configuration data
 * @returns Promise with creation result
 */
export const createSecret = (data: SecretConfigRequest) => {
    return useConsolePost("/secret", data);
};

/**
 * Update secret
 * @description Updates an existing secret configuration
 * @param id Secret ID
 * @param data Updated secret configuration data
 * @returns Promise with update result
 */
export const updateSecret = (id: string, data: SecretConfigRequest) => {
    return useConsolePatch(`/secret/${id}`, data);
};

/**
 * Delete secret
 * @description Deletes a specific secret
 * @param id Secret ID
 * @returns Promise with deletion result
 */
export const deleteSecret = (id: string) => {
    return useConsoleDelete(`/secret/${id}`);
};

/**
 * Batch delete secrets
 * @description Deletes multiple secrets at once
 * @param ids Array of secret IDs to delete
 * @returns Promise with batch deletion result
 */
export const deleteSecrets = (ids: string[]) => {
    return useConsoleDelete(`/secret`, { ids });
};

/**
 * Update secret status
 * @description Updates the status of a specific secret
 * @param id Secret ID
 * @param data Status update data
 * @returns Promise with status update result
 */
export const updateSecretStatus = (id: string, data: { status: number }) => {
    return useConsolePatch(`/secret/${id}/status`, data);
};
