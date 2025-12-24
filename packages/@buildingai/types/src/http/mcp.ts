/**
 * @fileoverview MCP (Model Context Protocol) related type definitions
 * @description Defines types for MCP tool calls and related data structures
 * used across http, service, and other packages.
 *
 * @author BuildingAI Teams
 */

/**
 * MCP tool call record interface
 * @description Interface for recording MCP tool call information.
 * This type is centralized here to avoid circular dependencies between packages.
 */
export interface McpToolCall {
    /** Record ID */
    id?: string;
    /** MCP server information */
    mcpServer?: any; // McpServerInfo from service package
    /** Tool information */
    tool?: any; // Omit<McpServerTool, "id" | "createdAt" | "updatedAt" | "mcpServerId"> from service package
    /** Tool input parameters */
    input?: Record<string, any>;
    /** Tool output results */
    output?: Record<string, any>;
    /** Call timestamp */
    timestamp?: number;
    /** Execution status */
    status?: "success" | "error";
    /** Error message (if any) */
    error?: string;
    /** Execution duration (milliseconds) */
    duration?: number;
}

/**
 * MCP call type enumeration
 * @description Types of MCP calls during tool execution
 */
export type McpCallType =
    /** Detect MCP */
    | "detected"
    /** Start call */
    | "start"
    /** Call result */
    | "result"
    /** Error */
    | "error";

/**
 * MCP call chunk interface
 * @description Interface for MCP call chunks during streaming
 */
export interface McpCallChunk<T> {
    /** Chunk type */
    type: McpCallType;
    /** Current message state */
    data: T;
}
