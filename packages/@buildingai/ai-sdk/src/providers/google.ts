import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class GoogleAdapter extends OpenAIAdapter implements Adapter {
    name = "google";

    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "https://generativelanguage.googleapis.com/v1beta/openai";
        }
        super(options);
    }
}

export const google = (options: ClientOptions = {}) => {
    return new GoogleAdapter(options);
};
