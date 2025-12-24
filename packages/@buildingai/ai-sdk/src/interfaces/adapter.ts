import type {
    ChatCompletion,
    ChatCompletionChunk,
    ChatCompletionCreateParams as OriginalChatCompletionCreateParams,
} from "openai/resources/chat/completions";
import type { CreateEmbeddingResponse, EmbeddingCreateParams } from "openai/resources/embeddings";

export interface ProviderChatCompletionStream extends AsyncIterable<ChatCompletionChunk> {
    cancel(): void;
}

type ChatCompletionCreateParams = OriginalChatCompletionCreateParams & {
    userId?: string;
};

// 重排序相关接口
export interface RerankParams {
    query: string;
    documents: string[];
    model?: string;
    top_n?: number;
}

export interface RerankResult {
    index: number;
    relevance_score: number;
}

export interface RerankResponse {
    results: RerankResult[];
    model: string;
}

/**
 * Adapter接口定义，适配不同的AI模型生成器
 */
export interface Adapter {
    /** 适配器的名称，通常用于区分不同的模型或供应商 */
    name: string;

    /**
     * 验证适配器配置，通常用于确保API密钥、URL等必要的配置项存在。
     * @param params 可选的聊天请求参数，部分适配器可能需要基于该参数进行校验。
     */
    validator?(params?: ChatCompletionCreateParams): void;

    /**
     * 生成文本的接口，通过适配器调用相应的API生成完整的文本
     * @param params 用于请求AI生成文本的参数
     * @returns 返回AI生成的完整文本
     */
    generateText(params: ChatCompletionCreateParams): Promise<ChatCompletion>;

    /**
     * 流式生成文本的接口，逐步返回生成的内容，适用于长文本或流式响应的场景
     * @param params 用于请求AI流式生成文本的参数
     * @returns 返回流式响应，可以通过 `asyncIterator` 遍历增量结果
     */
    streamText(params: ChatCompletionCreateParams): Promise<ProviderChatCompletionStream>;

    /**
     * 生成向量嵌入
     * @param params 向量嵌入参数
     * @returns 向量嵌入结果
     */
    generateEmbedding?(params: EmbeddingCreateParams): Promise<CreateEmbeddingResponse>;

    /**
     * 重排序
     * @param params 重排序参数
     * @returns 重排序结果
     */
    rerankDocuments?(params: RerankParams): Promise<RerankResponse>;

    /**
     * 对给定的文本进行分词，将文本转化为tokens（适用于基于token的模型，如GPT-3）
     * @param text 要分词的文本
     * @returns 返回文本的token数量
     */
    tokenize?(text: string): number;

    /**
     * 将tokens转化为原始文本（适用于基于token的模型，如GPT-3）
     * @param tokens 要转换的token数组
     * @returns 返回由tokens恢复的文本
     */
    detokenize?(tokens: number[]): string;
}
