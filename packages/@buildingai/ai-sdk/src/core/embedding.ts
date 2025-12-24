import type { CreateEmbeddingResponse, EmbeddingCreateParams } from "openai/resources/embeddings";

import { Adapter } from "./../interfaces/adapter";

export class EmbeddingGenerator {
    private adapter: Adapter;

    constructor(adapter: Adapter) {
        this.adapter = adapter;
        this.validate();
    }

    validate = () => {
        if (this.adapter.validator) {
            return this.adapter.validator();
        }
        if (!this.adapter.generateEmbedding) {
            throw new Error(`适配器 ${this.adapter.name} 不支持向量嵌入功能`);
        }
    };

    public embeddings = {
        create: async (params: EmbeddingCreateParams): Promise<CreateEmbeddingResponse> => {
            if (!this.adapter.generateEmbedding) {
                throw new Error(`适配器 ${this.adapter.name} 不支持向量嵌入功能`);
            }

            return await this.adapter.generateEmbedding(params);
        },
    };
}

export const embeddingGenerator = (adapter: Adapter) => {
    const generator = new EmbeddingGenerator(adapter);
    return generator;
};
