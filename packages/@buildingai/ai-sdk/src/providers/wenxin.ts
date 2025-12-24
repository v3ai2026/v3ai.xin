import { ClientOptions } from "openai";
import { CreateEmbeddingResponse, EmbeddingCreateParams } from "openai/resources/index";

import { AISdkError } from "../errors/basic";
import { Adapter, RerankParams, RerankResponse } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class WenXinAdapter extends OpenAIAdapter implements Adapter {
    name = "wenxin";

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://qianfan.baidubce.com/v2";
        }
        super(options);
    }

    async generateEmbedding(params: EmbeddingCreateParams): Promise<CreateEmbeddingResponse> {
        try {
            // Validate input parameters
            if (!params.input || (Array.isArray(params.input) && params.input.length === 0)) {
                throw new AISdkError("Input text cannot be empty");
            }

            // Check whether it is a single-text model (by model name)
            const singleTextModels = ["tao-8k"]; // Can be extended with more single-text models
            const isSingleTextModel = singleTextModels.includes(params.model);
            const inputTexts = Array.isArray(params.input) ? params.input : [params.input];

            if (isSingleTextModel && inputTexts.length > 1) {
                throw new AISdkError(
                    `${params.model} only supports a single text input; batch is not supported`,
                );
            }

            // Validate text length limits (single-text model constraint)
            if (isSingleTextModel) {
                const text = inputTexts[0];
                if (typeof text === "string" && text.length > 28000) {
                    throw new AISdkError(
                        `${params.model} input text length must not exceed 28,000 characters`,
                    );
                }
            }

            // Build request body to fit Baidu Qianfan embedding API
            const requestBody = {
                model: params.model,
                input: isSingleTextModel ? inputTexts[0] : inputTexts, // Use single text for single-text models; array for others
            };

            // Use Qianfan embedding endpoint
            const response = await fetch(`${this.client.baseURL}/embeddings`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.client.apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Wenxin embedding request failed details:", {
                    status: response.status,
                    statusText: response.statusText,
                    errorText,
                    requestBody,
                });
                throw new AISdkError(
                    `Wenxin embedding request failed: ${response.status} ${response.statusText}`,
                );
            }

            const data = await response.json();

            // Check error info in response
            if (data.error_code) {
                throw new AISdkError(
                    `Wenxin embedding service error: ${data.error_msg || data.error_code}`,
                );
            }

            return data;
        } catch (error: unknown) {
            console.log("error", this.client.baseURL, `Bearer ${this.client.apiKey}`);
            console.error("Wenxin embedding service invocation failed:", error);
            const message = error instanceof Error ? error.message : String(error);
            throw new AISdkError(
                `Wenxin embedding service invocation failed: ${message}`,
                error instanceof Error ? error : undefined,
            );
        }
    }

    /**
     * Wenxin rerank implementation - overrides base class method
     * Powered by Baidu Qianfan Rerank service
     */
    async rerankDocuments(params: RerankParams): Promise<RerankResponse> {
        try {
            // Build request body to fit Baidu Qianfan rerank API
            const requestBody = {
                model: params.model || "bce-reranker-base_v1", // Wenxin rerank model
                query: params.query,
                documents: params.documents,
                top_n: params.top_n || params.documents.length,
            };

            // Use Qianfan rerank endpoint
            const response = await fetch(`${this.client.baseURL}/rerank`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.client.apiKey}`,
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new AISdkError(
                    `Wenxin rerank request failed: ${response.status} ${response.statusText}`,
                );
            }

            const data = await response.json();

            // Check response status
            if (data.error_code) {
                throw new AISdkError(
                    `Wenxin rerank service error: ${data.error_msg || data.error_code}`,
                );
            }

            // Normalize to standard format
            const results = data.results || data.data || [];
            return {
                results: results.map((item: any, index: number) => ({
                    index: item.index !== undefined ? item.index : index,
                    relevance_score: item.relevance_score || item.score || 0,
                })),
                model: data.model || requestBody.model,
            };
        } catch (error: unknown) {
            console.error("Wenxin rerank service invocation failed:", error);
            const message = error instanceof Error ? error.message : String(error);
            throw new AISdkError(
                `Wenxin rerank service invocation failed: ${message}`,
                error instanceof Error ? error : undefined,
            );
        }
    }
}

export const wenxin = (options: ClientOptions = {}) => {
    return new WenXinAdapter(options);
};
