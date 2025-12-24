import crypto from "crypto";
import { FunctionToolCall } from "openai/resources/beta/threads/runs/steps.js";
import type { ChatCompletion, ChatCompletionChunk } from "openai/resources/chat/completions";
import type { CreateEmbeddingResponse, EmbeddingCreateParams } from "openai/resources/embeddings";
import type { CompletionUsage } from "openai/resources/index";
import { ChatCompletionCreateParams, ChatCompletionMessageParam } from "openai/resources/index";
import { encoding_for_model } from "tiktoken";

import { Adapter, ProviderChatCompletionStream } from "./../../interfaces/adapter";
import { DocumentParser } from "./../../utils/document-parser";

// 扩展流式响应接口，包含聚合功能
export interface ChatCompletionStream extends ProviderChatCompletionStream {
    /** 获取最终聚合的完整响应 */
    finalChatCompletion(): Promise<ChatCompletion>;
}

// 扩展 ChatCompletionChunk 接口，添加 DeepSeek 特有的字段
export interface ExtendedChatCompletionChunk extends ChatCompletionChunk {
    choices: Array<{
        delta: {
            content?: string | null;
            role?: "developer" | "system" | "user" | "assistant" | "tool";
            tool_calls?: any[];
            reasoning_content?: string; // DeepSeek 特有的深度思考内容字段
        };
        index: number;
        finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | "function_call" | null;
        logprobs?: any | null;
    }>;
}

export class TextGenerator {
    private adapter: Adapter;

    constructor(adapter: Adapter) {
        this.adapter = adapter;
        this.validate();
    }

    validate = () => {
        if (this.adapter.validator) {
            return this.adapter.validator();
        }
    };

    public chat = {
        create: async (params: ChatCompletionCreateParams) => {
            if (!this.adapter.generateText) {
                throw new Error("Current adapter does not support text generation");
            }
            const processedParams = await this.transformFileUrlsToText(params);

            return this.adapter.generateText(processedParams);
        },
        stream: async (params: ChatCompletionCreateParams) => {
            if (!this.adapter.streamText) {
                throw new Error("Current adapter does not support streaming text generation");
            }
            const processedParams = await this.transformFileUrlsToText(params);
            return this.streamHandle(processedParams);
        },
    };

    /**
     * 向量嵌入功能
     * 用于将文本转换为向量表示
     */
    public embedding = {
        /**
         * 生成文本的向量嵌入
         * @param params 向量嵌入参数
         * @returns 向量嵌入结果
         */
        create: async (params: EmbeddingCreateParams): Promise<CreateEmbeddingResponse> => {
            if (!this.adapter.generateEmbedding) {
                throw new Error("Current adapter does not support embedding");
            }
            return this.adapter.generateEmbedding(params);
        },
    };

    /**
     * 转换消息中的 file_url 为文本内容，input_audio URL 为 base64
     */
    private async transformFileUrlsToText(
        params: ChatCompletionCreateParams,
    ): Promise<ChatCompletionCreateParams> {
        const messages = await Promise.all(
            params.messages.map((msg) =>
                msg.role === "user" && Array.isArray(msg.content)
                    ? this.transformMessageContent(msg)
                    : msg,
            ),
        );

        return { ...params, messages: messages as ChatCompletionMessageParam[] };
    }

    /**
     * 转换单条消息的内容
     */
    private async transformMessageContent(message: ChatCompletionMessageParam) {
        const content = await Promise.all(
            (message.content as any[]).map((part) => {
                if (part.type === "file_url") {
                    return this.fileUrlToText(part);
                }
                if (part.type === "input_audio") {
                    return this.audioUrlToBase64(part);
                }
                return part;
            }),
        );
        return { ...message, content };
    }

    /**
     * 将 file_url 转换为文本格式
     */
    private async fileUrlToText(file: { url: string; name: string }): Promise<{
        type: "text";
        text: string;
    }> {
        try {
            const text = await DocumentParser.parseFromUrl(file.url, file.name);
            return {
                type: "text",
                text: DocumentParser.formatDocumentPrompt(file.name, text),
            };
        } catch (error) {
            console.error(`文档解析失败 [${file.name}]:`, error);
            return {
                type: "text",
                text: `[文档解析失败: ${file.name}]`,
            };
        }
    }

    /**
     * 将 input_audio URL 转换为 base64 格式
     * 如果 data 已经是 base64，则直接返回
     * 如果是 URL，则下载并转换为 base64
     */
    private async audioUrlToBase64(audio: {
        type: "input_audio";
        input_audio: { data: string; format: string };
    }): Promise<{
        type: "input_audio";
        input_audio: { data: string; format: string };
    }> {
        const { data, format } = audio.input_audio;

        // 如果已经是 base64（不以 http 开头），直接返回
        if (!data.startsWith("http://") && !data.startsWith("https://")) {
            return audio;
        }

        try {
            // 从 URL 下载音频文件并转换为 base64
            const response = await fetch(data);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Data = buffer.toString("base64");

            return {
                type: "input_audio",
                input_audio: {
                    data: base64Data,
                    format,
                },
            };
        } catch (error) {
            console.error(`音频 URL 转换 base64 失败 [${data}]:`, error);
            // 转换失败时返回原始 URL，由 AI 模型处理
            return audio;
        }
    }

    private streamHandle = async (params: ChatCompletionCreateParams) => {
        const providerStream = await this.adapter.streamText(params);
        const asyncIterator = providerStream[Symbol.asyncIterator]();
        let finalResult: ChatCompletion | null = null;

        /**
         * 聚合流式响应的迭代器
         */
        async function* streamingAggregatingIterator() {
            const choices: any[] = [];
            let finalUsage: CompletionUsage | undefined;

            while (true) {
                const { value, done } = await asyncIterator.next();
                if (done) break;

                // 确保 value 是 ExtendedChatCompletionChunk 类型
                const completionChunk = value as ExtendedChatCompletionChunk;

                // 如果有 usage
                if ("usage" in completionChunk && completionChunk.usage) {
                    finalUsage = completionChunk.usage as CompletionUsage;
                }

                if (!completionChunk.choices?.length) continue;

                const choice = completionChunk.choices[0];
                if (!choice?.delta) continue;

                const { index = 0 } = choice;
                const { content, role, tool_calls, reasoning_content } = choice.delta;

                if (!choices[index]) {
                    choices.splice(index, 0, {
                        message: {
                            role: role || "",
                            content: "",
                            tool_calls: [],
                            reasoning_content: "", // 添加 reasoning_content 字段
                        },
                    });
                }

                if (content) choices[index].message.content += content;
                if (role) choices[index].message.role = role;
                // 处理 思考过程 reasoning_content 字段
                if (reasoning_content) {
                    if (!choices[index].message.reasoning_content) {
                        choices[index].message.reasoning_content = "";
                    }
                    choices[index].message.reasoning_content += reasoning_content;
                }

                // 处理工具调用
                if (tool_calls && Array.isArray(tool_calls)) {
                    for (const toolCall of tool_calls) {
                        const toolCallIndex = toolCall.index || 0;

                        // 确保 tool_calls 数组有足够的空间
                        while (choices[index].message.tool_calls.length <= toolCallIndex) {
                            choices[index].message.tool_calls.push({
                                id: "",
                                type: "function",
                                function: {
                                    name: "",
                                    arguments: "",
                                },
                            });
                        }

                        const existingToolCall = choices[index].message.tool_calls[toolCallIndex];

                        // 更新工具调用信息
                        if (toolCall.id) {
                            existingToolCall.id = toolCall.id;
                        }
                        if (toolCall.type) {
                            existingToolCall.type = toolCall.type;
                        }
                        if (toolCall.function) {
                            if (toolCall.function.name) {
                                existingToolCall.function.name = toolCall.function.name;
                            }
                            if (toolCall.function.arguments) {
                                existingToolCall.function.arguments += toolCall.function.arguments;
                            }
                        }
                    }
                }

                yield completionChunk;
            }

            if (!finalUsage) {
                const encoding = encoding_for_model("gpt-3.5-turbo");

                // 计算 prompt_tokens
                let prompt_tokens = 0;
                if (params.messages && Array.isArray(params.messages)) {
                    for (const msg of params.messages) {
                        prompt_tokens += encoding.encode(msg.role + ": " + msg.content).length;
                    }
                }

                // 计算 completion_tokens
                let completion_tokens = 0;
                for (const choice of choices) {
                    // 计算文本内容的token
                    if (choice?.message?.content) {
                        completion_tokens += encoding.encode(choice.message.content).length;
                    }

                    // 计算工具调用的token
                    if (choice?.message?.tool_calls && Array.isArray(choice.message.tool_calls)) {
                        for (const toolCall of choice.message.tool_calls) {
                            const { name, arguments: args } = toolCall.function ?? {};
                            if (name) completion_tokens += encoding.encode(name).length;
                            if (args) completion_tokens += encoding.encode(args).length;
                        }
                    }
                }

                finalUsage = {
                    completion_tokens,
                    prompt_tokens,
                    total_tokens: completion_tokens + prompt_tokens,
                };

                encoding.free();
            }

            // 清理空的工具调用
            for (const choice of choices) {
                if (choice?.message?.tool_calls) {
                    choice.message.tool_calls = choice.message.tool_calls.filter(
                        (toolCall: FunctionToolCall) => toolCall.id && toolCall.function?.name,
                    );
                }
            }

            const aggregatedResult: ChatCompletion = {
                id: crypto.randomUUID(),
                object: "chat.completion",
                created: Math.floor(Date.now() / 1000),
                model: params.model || "unknown",
                choices,
                usage: finalUsage,
            };

            finalResult = aggregatedResult;
        }

        return {
            cancel: () => {
                providerStream.cancel();
            },
            [Symbol.asyncIterator]: streamingAggregatingIterator,
            finalChatCompletion: async () => {
                if (finalResult) return finalResult;
                const iterator = streamingAggregatingIterator();
                for await (const _ of iterator) {
                    // do nothing
                }
                if (!finalResult) {
                    throw new Error("获取最终聊天完成结果失败");
                }
                return finalResult;
            },
        };
    };
}

export const textGenerator = (adapter: Adapter) => {
    const generator = new TextGenerator(adapter);
    return generator;
};
