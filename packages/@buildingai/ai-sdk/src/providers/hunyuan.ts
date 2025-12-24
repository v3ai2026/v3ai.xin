import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class HunyuanAdapter extends OpenAIAdapter implements Adapter {
    name = "hunyuan";

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://api.hunyuan.cloud.tencent.com/v1";
        }
        super(options);
    }
}

export const hunyuan = (options: ClientOptions = {}) => {
    return new HunyuanAdapter(options);
};
