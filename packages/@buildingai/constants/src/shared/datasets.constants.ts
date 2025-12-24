/**
 * RAG 检索模式常量
 */
export const RETRIEVAL_MODE = {
    /** 向量检索 */
    VECTOR: "vector",
    /** 全文检索 */
    FULL_TEXT: "fullText",
    /** 混合检索 */
    HYBRID: "hybrid",
} as const;

/**
 * 文档处理模式常量
 */
export const DOCUMENT_MODE = {
    /** 普通分段 */
    NORMAL: "normal",
    /** 父子分段 */
    HIERARCHICAL: "hierarchical",
} as const;

/**
 * 父块上下文模式常量
 */
export const PARENT_CONTEXT_MODE = {
    /** 全文 */
    FULL_TEXT: "fullText",
    /** 段落 */
    PARAGRAPH: "paragraph",
} as const;

/**
 * 处理状态常量
 */
export const PROCESSING_STATUS = {
    /** 等待处理 */
    PENDING: "pending",
    /** 处理中 */
    PROCESSING: "processing",
    /** 已完成 */
    COMPLETED: "completed",
    /** 失败 */
    FAILED: "failed",
    /** 有错误 */
    ERROR: "error",
} as const;

/**
 * RAG 相关类型定义
 */
export type RetrievalModeType = (typeof RETRIEVAL_MODE)[keyof typeof RETRIEVAL_MODE];
export type DocumentModeType = (typeof DOCUMENT_MODE)[keyof typeof DOCUMENT_MODE];
export type ParentContextModeType = (typeof PARENT_CONTEXT_MODE)[keyof typeof PARENT_CONTEXT_MODE];
export type statusType = (typeof PROCESSING_STATUS)[keyof typeof PROCESSING_STATUS];
