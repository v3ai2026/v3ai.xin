import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import { OpenAIAdapter } from "./openai";

export class OllamaAdapter extends OpenAIAdapter implements Adapter {
    name = "ollama";
    constructor(options: ClientOptions) {
        if (!options.baseURL) {
            options.baseURL = "http://localhost:11434/v1";
        }
        if (!options.apiKey) {
            options.apiKey = "ollama";
        }
        super(options);
    }
}

export const ollama = (options: ClientOptions = {}) => {
    return new OllamaAdapter(options);
};
