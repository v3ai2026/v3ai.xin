import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class DeepSeekAdapter extends OpenAIAdapter implements Adapter {
    name = "deepseek";

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://api.deepseek.com";
        }
        super(options);
    }
}

export const deepseek = (options: ClientOptions = {}) => {
    return new DeepSeekAdapter(options);
};
