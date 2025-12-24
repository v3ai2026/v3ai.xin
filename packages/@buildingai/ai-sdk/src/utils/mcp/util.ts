import { ChatCompletionFunctionTool } from "openai/resources/index.js";

import { MCPTool } from "./type";

/**
 * Convert MCP tool to OpenAI ChatCompletionTool format (HTTP Streamable version)
 *
 * Note: Implementation is consistent with `sse.ts` to maintain identical input/output and type signatures.
 *
 * @param mcpTool MCP tool object
 * @returns Tool object in OpenAI ChatCompletionTool format
 */
export function convertMCPToolToOpenAI(mcpTool: MCPTool): ChatCompletionFunctionTool {
    return {
        type: "function",
        function: {
            name: mcpTool.name,
            description: mcpTool.description,
            parameters: mcpTool.inputSchema || {},
        },
    };
}

/**
 * Batch convert MCP tools array to OpenAI ChatCompletionTool format (HTTP Streamable version)
 *
 * @param mcpTools MCP tools array
 * @returns Tools array in OpenAI ChatCompletionTool format
 */
export function convertMCPToolsToOpenAI(mcpTools: MCPTool[]): ChatCompletionFunctionTool[] {
    return mcpTools.map(convertMCPToolToOpenAI);
}
