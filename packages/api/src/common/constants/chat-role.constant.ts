/**
 * 聊天消息角色常量
 */
export const CHAT_ROLE = {
    SYSTEM: "system",
    USER: "user",
    ASSISTANT: "assistant",
    FUNCTION: "function",
    DEVELOPER: "developer",
    TOOL: "tool",
} as const;

/**
 * 聊天消息角色类型
 */
export type ChatRoleType = (typeof CHAT_ROLE)[keyof typeof CHAT_ROLE];
