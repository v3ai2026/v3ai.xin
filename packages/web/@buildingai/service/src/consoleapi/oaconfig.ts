/**
 * @fileoverview Console API service functions for WeChat Official Account configuration
 * @description This file contains API functions for WeChat Official Account configuration,
 * authentication settings, and related type definitions for the console.
 *
 * @author BuildingAI Teams
 */

// ==================== Type Definitions ====================

/**
 * WeChat Official Account configuration interface
 * @description Interface for WeChat Official Account configuration settings
 */
export interface WxOaConfig {
    /** WeChat App ID */
    appId: string;
    /** WeChat App Secret */
    appSecret: string;
    /** WeChat API URL */
    url: string;
    /** WeChat Token */
    token: string;
    /** Encoding AES Key */
    encodingAESKey: string;
    /** Message encryption type */
    messageEncryptType: string;
    /** Domain configuration */
    domain: string;
    /** JS API domain */
    jsApiDomain: string;
    /** Web authorization domain */
    webAuthDomain: string;
}

/**
 * Update WeChat Official Account configuration DTO interface
 * @description Parameters for updating WeChat Official Account configuration
 */
export type UpdateWxOaConfigDto = Pick<
    WxOaConfig,
    "appId" | "appSecret" | "token" | "encodingAESKey" | "messageEncryptType"
>;

// ==================== WeChat Official Account Configuration Related APIs ====================

/**
 * Get WeChat Official Account configuration
 * @description Get current WeChat Official Account configuration settings
 * @returns Promise with WeChat Official Account configuration
 */
export function apiGetWxOaConfig(): Promise<WxOaConfig> {
    return useConsoleGet("/wxoaconfig");
}

/**
 * Update WeChat Official Account configuration
 * @description Update WeChat Official Account configuration settings
 * @param data Configuration update data
 * @returns Promise with updated WeChat Official Account configuration
 */
export function apiUpdateWxOaConfig(data: UpdateWxOaConfigDto): Promise<WxOaConfig> {
    return useConsolePatch("/wxoaconfig", data);
}
