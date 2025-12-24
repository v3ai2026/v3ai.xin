import type { MessageContent } from "@buildingai/types/ai/message-content.interface";

/**
 * Extract text content from MessageContent
 * Used for scenarios that require plain text, such as knowledge base retrieval
 *
 * @param content - Message content, can be a string or array format
 * @returns Extracted text content
 */
export function extractTextFromMessageContent(content: MessageContent | undefined | null): string {
    if (!content) {
        return "";
    }

    // If it's a string, return directly
    if (typeof content === "string") {
        return content;
    }

    // If it's an array, extract all text parts
    if (Array.isArray(content)) {
        const textParts: string[] = [];

        for (const part of content) {
            // Extract text field
            if (part.text) {
                textParts.push(part.text);
            }
            // If type is "text", also extract text
            if (part.type === "text" && part.text) {
                textParts.push(part.text);
            }
        }

        return textParts.join(" ").trim();
    }

    return "";
}
