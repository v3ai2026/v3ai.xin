/**
 * Message content part type
 */
export interface MessageContentPart {
    /** Content type */
    type: string;
    /** Text content */
    text?: string;
    /** Image URL */
    image_url?: {
        /** Image URL */
        url: string;
        /** Image detail level (optional) */
        detail?: "auto" | "low" | "high";
    };
    /** Audio input */
    input_audio?: { data: string; format: string };
    /** Video URL */
    video_url?: { url: string };
    /** File URL (for file_url type) */
    url?: string;
    /** File name (for file_url type) */
    name?: string;
}

/**
 * Message content type
 * Can be a plain text string or an array containing multiple media types
 */
export type MessageContent = string | MessageContentPart[];

/**
 * Attachment information type
 */
export interface Attachment {
    /** Attachment type */
    type: string;
    /** Attachment URL */
    url: string;
    /** Attachment name */
    name?: string;
    /** Attachment size in bytes */
    size?: number;
}
