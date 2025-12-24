import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class XAdapter extends OpenAIAdapter implements Adapter {
    name = "x";

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://api.x.ai/v1";
        }
        super(options);
    }
}

export const x = (options: ClientOptions = {}) => {
    return new XAdapter(options);
};
