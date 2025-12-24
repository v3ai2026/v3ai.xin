import OpenAI, { ClientOptions } from "openai";
import { CreateEmbeddingResponse, EmbeddingCreateParams } from "openai/resources/embeddings";
import { ChatCompletion, ChatCompletionCreateParams } from "openai/resources/index";

import {
    Adapter,
    ProviderChatCompletionStream,
    RerankParams,
    RerankResponse,
} from "../interfaces/adapter";

export class OpenAIAdapter implements Adapter {
    public name = "openai";
    protected client: OpenAI;

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://api.openai.com/v1";
        }
        this.client = new OpenAI(options);
    }

    validator(): void {
        if (!this.client.apiKey) {
            throw new Error("API key is required.");
        }

        if (!this.client.baseURL) {
            throw new Error("base URL is required.");
        }
    }

    async generateText(params: ChatCompletionCreateParams): Promise<ChatCompletion> {
        const response = await this.client.chat.completions.create({
            ...params,
            stream: false,
        });

        return response;
    }

    async streamText(params: ChatCompletionCreateParams): Promise<ProviderChatCompletionStream> {
        const stream = await this.client.chat.completions.create({
            ...params,
            stream: true,
            stream_options: {
                include_usage: true,
            },
        });

        return {
            [Symbol.asyncIterator]() {
                return stream[Symbol.asyncIterator]();
            },
            cancel: () => {
                stream.controller.abort();
            },
        };
    }

    async generateEmbedding(params: EmbeddingCreateParams): Promise<CreateEmbeddingResponse> {
        return await this.client.embeddings.create({
            ...params,
            model: params.model || "text-embedding-3-small",
        });
    }

    /**
     * 通用重排功能实现
     * 基于 OpenAI 兼容的重排接口，子类可以根据需要重写此方法
     */
    async rerankDocuments(params: RerankParams): Promise<RerankResponse> {
        try {
            // 构建请求体，使用通用的重排接口格式
            const requestBody = {
                model: params.model || "rerank-1", // 默认重排模型
                query: params.query,
                documents: params.documents,
                top_n: params.top_n || params.documents.length,
            };

            // 发送重排请求，使用基础 URL + /rerank 路径
            const response = await fetch(`${this.client.baseURL}/rerank`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.client.apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error(`重排请求失败: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            return {
                results: data.results || data.rankings || [],
                model: data.model || requestBody.model,
            };
        } catch (error) {
            console.error(`${this.name} 重排服务调用失败:`, error);
            throw new Error(`${this.name} 重排服务调用失败: ${(error as Error).message}`);
        }
    }

    async models() {
        try {
            const response = await this.client.models.list();
            return response.data;
        } catch (error) {
            throw new Error((error as Error).message);
        }
    }
}

export const openai = (options: ClientOptions = {}) => {
    return new OpenAIAdapter(options);
};
