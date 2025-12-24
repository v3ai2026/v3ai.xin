import type { FilesList } from "@buildingai/service/models/message";
import { defineStore } from "pinia";
import { shallowRef } from "vue";

/**
 * Pending conversation metadata
 */
export interface PendingConversation {
    id: string;
    modelId: string;
    title: string;
    files?: FilesList;
}

export const useChatStore = defineStore("chat", () => {
    const pendingConversation = shallowRef<PendingConversation | null>(null);

    /**
     * Set pending conversation data
     * @param data Conversation metadata including id, modelId, title, and files
     */
    const setPendingConversation = (data: PendingConversation | null) => {
        pendingConversation.value = data;
    };

    /**
     * Clear pending conversation data
     */
    const clearPendingConversation = () => {
        pendingConversation.value = null;
    };

    /**
     * Get pending conversation data
     * @returns Pending conversation data or null
     */
    const getPendingConversation = (): PendingConversation | null => {
        return pendingConversation.value;
    };

    return {
        pendingConversation,
        setPendingConversation,
        clearPendingConversation,
        getPendingConversation,
    };
});
