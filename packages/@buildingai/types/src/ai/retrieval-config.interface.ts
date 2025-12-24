import { RetrievalModeType } from "@buildingai/constants/shared/datasets.constants";

/**
 * Rerank配置接口
 */
export interface RerankConfig {
    /** 是否启用Rerank */
    enabled?: boolean;
    /** Rerank模型ID */
    modelId?: string;
}

/**
 * 权重配置接口 - 统一的检索参数配置
 */
export interface WeightConfig {
    /** 语义检索权重（向量检索权重，仅混合模式使用） */
    semanticWeight?: number;
    /** 关键词检索权重（全文检索权重，仅混合模式使用） */
    keywordWeight?: number;
}

/**
 * 统一的检索配置接口
 */
export interface RetrievalConfig {
    /** 检索模式 */
    retrievalMode: RetrievalModeType;
    /** 混合检索策略 - 仅在混合模式下使用 */
    strategy?: "weighted_score" | "rerank";
    /** 返回结果数量 */
    topK?: number;
    /** 相似度阈值 */
    scoreThreshold?: number;
    /** 是否启用阈值过滤 */
    scoreThresholdEnabled?: boolean;
    /** 权重配置 - 仅混合模式下使用 */
    weightConfig?: WeightConfig;
    /** Rerank配置 */
    rerankConfig?: RerankConfig;
}

/**
 * 检索结果块接口
 */
export interface RetrievalChunk {
    id: string;
    /** 段落内容 */
    content: string;
    /** 段落内容 */
    score: number;
    /** 元数据 */
    metadata?: Record<string, unknown>;
    /** 来源 */
    sources?: string[];
    /** 块在文档中的索引位置 */
    chunkIndex?: number;
    /** 文本内容长度 */
    contentLength?: number;
    /** 文档名称 */
    fileName?: string;
    /** 高亮内容（全文检索时返回，已高亮命中关键词） */
    highlight?: string;
}

/**
 * 检索查询结果接口
 */
export interface RetrievalResult {
    chunks: RetrievalChunk[];
    totalTime: number;
}

/**
 * 检索查询参数接口
 */
export interface QueryOptions {
    topK?: number;
    scoreThreshold?: number;
}

/**
 * 向量检索结果接口
 */
export interface VectorSearchResult {
    chunks: RetrievalChunk[];
    info: {
        topK: number;
        scoreThreshold?: number;
        rerankUsed: boolean;
    };
}

/**
 * 全文检索结果接口
 */
export interface FullTextSearchResult {
    chunks: RetrievalChunk[];
    info: {
        topK: number;
        scoreThreshold?: number;
        rerankUsed: boolean;
    };
}

/**
 * 混合检索结果接口
 */
export interface HybridSearchResult {
    chunks: RetrievalChunk[];
    info: {
        strategy: string;
        topK: number;
        scoreThreshold?: number;
        rerankUsed?: boolean;
        semanticWeight?: number;
        keywordWeight?: number;
    };
}

/**
 * 数据库查询结果接口
 */
export interface DbQueryResult {
    id?: string;
    /** 段落ID */
    document_id?: string;
    /** 文本内容 */
    content?: string;
    /** 段落内容 */
    segment_content?: string;
    /** 段落ID */
    segment_id?: string;
    /** 元数据 */
    metadata?: Record<string, unknown>;
    /** 段落元数据 */
    segment_metadata?: Record<string, unknown>;
    /** 段落索引 */
    score: number;
    /** 块在文档中的索引位置 */
    chunk_index?: number;
    /** 文本内容长度 */
    content_length?: number;
    /** 文档名称 */
    document_name?: string;
    /** 高亮内容（全文检索时返回，已高亮命中关键词） */
    highlight?: string;
}
