import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class VolcengineAdapter extends OpenAIAdapter implements Adapter {
    name = "volcengine";

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://ark.cn-beijing.volces.com/api/v3";
        }
        super(options);
    }
}

export const volcengine = (options: ClientOptions = {}) => {
    return new VolcengineAdapter(options);
};
