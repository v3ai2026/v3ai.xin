import { Adapter, RerankParams, RerankResponse } from "./../interfaces/adapter";

export class RerankGenerator {
    private adapter: Adapter;

    constructor(adapter: Adapter) {
        this.adapter = adapter;
        this.validate();
    }

    validate = () => {
        if (this.adapter.validator) {
            return this.adapter.validator();
        }
        if (!this.adapter.rerankDocuments) {
            throw new Error(`适配器 ${this.adapter.name} 不支持重排序功能！`);
        }
    };

    public rerank = {
        create: async (params: RerankParams): Promise<RerankResponse> => {
            if (!this.adapter.rerankDocuments) {
                throw new Error(`适配器 ${this.adapter.name} 不支持重排序功能！`);
            }
            return await this.adapter.rerankDocuments(params);
        },
    };
}

export const rerankGenerator = (adapter: Adapter) => {
    const generator = new RerankGenerator(adapter);
    return generator;
};
