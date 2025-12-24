import { CHAT_ROLE } from "@common/constants";
import { MessageRole, MessageType } from "@modules/ai/chat/dto/ai-chat-record.dto";
import { AiChatRecordService } from "@modules/ai/chat/services/ai-chat-record.service";
import { Injectable } from "@nestjs/common";
import type { ChatCompletionMessageParam } from "openai/resources/index";

/**
 * Conversation Command Handler
 *
 * Handles conversation creation, message saving, and title generation.
 */
@Injectable()
export class ConversationCommandHandler {
    constructor(private readonly aiChatRecordService: AiChatRecordService) {}

    /**
     * Create a new conversation if conversationId is not provided
     *
     * @param userId - User ID
     * @param conversationId - Existing conversation ID (optional)
     * @param title - Conversation title (optional)
     * @returns Conversation ID
     */
    async ensureConversation(
        userId: string,
        conversationId?: string,
        title?: string | null,
    ): Promise<string> {
        if (conversationId) {
            return conversationId;
        }

        const conversation = await this.aiChatRecordService.createConversation(userId, {
            title: title || null,
        });

        return conversation.id;
    }

    /**
     * Save user message to conversation
     *
     * @param conversationId - Conversation ID
     * @param modelId - Model ID
     * @param message - User message
     */
    async saveUserMessage(
        conversationId: string,
        modelId: string,
        message: ChatCompletionMessageParam,
    ): Promise<void> {
        await this.aiChatRecordService.createMessage({
            conversationId,
            modelId,
            role: this.mapChatRoleToMessageRole(message.role),
            content: message.content,
            messageType: MessageType.TEXT,
            userConsumedPower: 0,
        });
    }

    /**
     * Save assistant message to conversation
     *
     * @param params - Message parameters
     */
    async saveAssistantMessage(params: {
        conversationId: string;
        modelId: string;
        content: string;
        userConsumedPower: number;
        tokens: {
            prompt_tokens?: number;
            completion_tokens?: number;
            total_tokens?: number;
        };
        rawResponse?: any;
        mcpToolCalls?: any[];
        metadata?: Record<string, any>;
        errorMessage?: string;
    }): Promise<void> {
        await this.aiChatRecordService.createMessage({
            conversationId: params.conversationId,
            modelId: params.modelId,
            role: MessageRole.ASSISTANT,
            content: params.content,
            messageType: MessageType.TEXT,
            userConsumedPower: params.userConsumedPower,
            tokens: params.tokens,
            rawResponse: params.rawResponse,
            mcpToolCalls:
                params.mcpToolCalls && params.mcpToolCalls.length > 0 ? params.mcpToolCalls : null,
            metadata:
                params.metadata && Object.keys(params.metadata).length > 0 ? params.metadata : null,
            errorMessage: params.errorMessage,
        });
    }

    /**
     * Update conversation title
     *
     * @param conversationId - Conversation ID
     * @param userId - User ID
     * @param title - New title
     */
    async updateTitle(conversationId: string, userId: string, title: string): Promise<void> {
        const conversation = await this.aiChatRecordService.findOneById(conversationId);

        if (!conversation.title) {
            await this.aiChatRecordService.updateConversation(conversationId, userId, {
                title,
            });
        }
    }

    /**
     * Map ChatRole to MessageRole
     *
     * @param chatRole - Chat role string
     * @returns MessageRole enum
     */
    private mapChatRoleToMessageRole(chatRole: string): MessageRole {
        switch (chatRole) {
            case CHAT_ROLE.USER:
                return MessageRole.USER;
            case CHAT_ROLE.ASSISTANT:
                return MessageRole.ASSISTANT;
            case CHAT_ROLE.SYSTEM:
                return MessageRole.SYSTEM;
            default:
                return MessageRole.USER;
        }
    }
}
