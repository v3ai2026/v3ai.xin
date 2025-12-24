/**
 * @fileoverview Web API service functions for AI agent management
 * @description This file contains API functions for public AI agent queries,
 * agent discovery, and related type definitions for the web interface.
 *
 * @author BuildingAI Teams
 */

import type { Agent, AgentDecorateConfig } from "../consoleapi/ai-agent";
import type { BaseQueryParams, PaginationResult } from "../models/globals";

// ==================== Type Definitions ====================

/**
 * Query public agent parameters interface
 * @description Parameters for querying public agent list
 */
export interface QueryPublicAgentParams extends BaseQueryParams {
    /** Sort method: latest-newest, popular-most popular */
    sortBy?: "latest" | "popular";
    /** Whether to show only published agents */
    publishedOnly?: boolean;
    /** Tag IDs filter (array or comma-separated string) */
    tagIds?: string[];
}

// ==================== AI Agent Related APIs ====================

/**
 * Get public agent list
 * @description Get paginated list of public agents with search and sorting support
 * @param params Query parameters
 * @returns Promise with paginated agent list
 */
export function apiGetPublicAgents(
    params: QueryPublicAgentParams,
): Promise<PaginationResult<Agent>> {
    return useWebGet("/ai-agents", params);
}

/**
 * Get agent decorate config
 * @description Get agent decorate config
 * @returns Promise with agent decorate config
 */
export function apiGetAgentDecorate(): Promise<AgentDecorateConfig> {
    return useWebGet("/agent-decorate");
}
