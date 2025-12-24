import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class ZhipuaiAdapter extends OpenAIAdapter implements Adapter {
    name = "zhipuai";

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://open.bigmodel.cn/api/paas/v4";
        }
        super(options);
    }
}

export const zhipuai = (options: ClientOptions = {}) => {
    return new ZhipuaiAdapter(options);
};
