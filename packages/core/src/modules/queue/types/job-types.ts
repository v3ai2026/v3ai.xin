/**
 * 队列任务类型定义
 * 统一管理所有队列任务的类型标识符
 */
export enum JobType {
    // 默认队列任务类型
    GENERIC = "generic",
    IMPORT = "import",

    // 邮件队列任务类型
    EMAIL_SEND = "email_send",

    // 向量化队列任务类型
    VECTORIZE_DATASET = "vectorize_dataset",
    VECTORIZE_DOCUMENT = "vectorize_document",
    VECTORIZE_SEGMENT = "vectorize_segment",
}

/**
 * 任务数据接口定义
 */
export interface GenericJobData {
    duration?: number;
}

export interface ImportJobData {
    items: any[];
    options?: any;
}

export interface EmailJobData {
    to: string;
    subject: string;
    content: string;
    attachments?: any[];
}

export interface VectorizationJobData {
    datasetId: string;
    documentId?: string;
    taskId?: string;
}
