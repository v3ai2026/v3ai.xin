import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class MoonShotAdapter extends OpenAIAdapter implements Adapter {
    name = "moonshot";

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://api.moonshot.cn/v1";
        }
        super(options);
    }
}

export const moonshot = (options: ClientOptions = {}) => {
    return new MoonShotAdapter(options);
};
