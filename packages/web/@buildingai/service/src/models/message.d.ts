import type { Attachment, MessageContent, MessageContentPart } from "@buildingai/types";

// Re-export types from @buildingai/types for backward compatibility
export type { Attachment, MessageContent, MessageContentPart };

export interface FileListItem {
    type: "file_url" | "image_url" | "input_audio" | "video_url";
    name?: string;
    url?: string;
    image_url?: {
        url: string;
    };
    input_audio?: {
        data: string;
        format: string;
    };
    video_url?: { url: string };
}

export type FilesList = FileListItem[];

/**
 * AI消息接口
 */
export interface AiMessage {
    /** 主键ID (UUID) */
    id?: string;
    /** 对话ID */
    conversationId?: string;
    /** 使用的AI模型ID */
    modelId?: string;
    /** 消息角色 */
    role: MessageRole;
    /** 消息内容 */
    content: MessageContent;
    /** 消息类型 */
    messageType?: MessageType;
    /** 模型 */
    model?: AiModel;
    /** 附件信息 */
    attachments?: Attachment[];
    /** Token使用情况 */
    tokens?: TokenUsage;
    /** 处理时长（毫秒） */
    processingTime?: number;
    /** 时间戳 */
    timestamp?: string;
    /** 消息状态 */
    status?: "active" | "loading" | "failed" | "completed";
    /** 错误信息 */
    errorMessage?: string;
    /** 用户消耗积分 */
    userConsumedPower?: number;
    /** 模型响应的原始数据 */
    rawResponse?: Record<string, any>;
    /** 扩展数据 */
    metadata?: Record<string, any>;
    /** 创建时间 */
    createdAt?: string | Date;
    /** 更新时间 */
    updatedAt?: string | Date;
    /** mcp调用 */
    mcpToolCalls?: McpToolCall[];
    /** 消息头像 */
    avatar?: string;
    /** 扩展数据 */
    [key: string]: any;
}
