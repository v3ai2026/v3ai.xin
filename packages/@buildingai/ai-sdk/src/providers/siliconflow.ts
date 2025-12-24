import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class SiliconFlowAdapter extends OpenAIAdapter implements Adapter {
    name = "siliconflow";

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://api.siliconflow.cn/v1";
        }
        super(options);
    }
}

export const siliconflow = (options: ClientOptions = {}) => {
    return new SiliconFlowAdapter(options);
};
