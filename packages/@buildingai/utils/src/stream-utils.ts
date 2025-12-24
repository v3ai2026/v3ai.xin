import type { Response } from "express";

/**
 * 流式输出工具类
 * 提供多种流式输出模式和配置选项
 */
export class StreamUtils {
    /**
     * 快速流式输出（适合短文本）
     * @param text 要输出的完整文本
     * @param res Express响应对象
     */
    static async fastStream(text: string, res: Response): Promise<void> {
        return this.autoStream(text, res, {
            speed: 50,
            minChunkSize: 3,
            maxChunkSize: 8,
        });
    }

    /**
     * 按句子流式输出（适合长文本）
     * @param text 要输出的完整文本
     * @param res Express响应对象
     * @param speed 输出速度（毫秒/句子）
     */
    static async sentenceStream(text: string, res: Response, speed: number = 300): Promise<void> {
        return this.autoStream(text, res, {
            speed,
            minChunkSize: 20,
            maxChunkSize: 50,
        });
    }

    /**
     * 智能流式输出（根据文本长度和内容类型自动选择最佳模式）
     * @param text 要输出的完整文本
     * @param res Express响应对象
     */
    static async smartStream(text: string, res: Response): Promise<void> {
        const isMarkdown = this.isMarkdownContent(text);

        if (isMarkdown) {
            // Markdown 内容使用专门的 markdownStream 方法
            const strategy = this.getOptimalSplitStrategy(text);
            return this.markdownStream(text, res, {
                ...strategy,
                preserveNewlines: true,
            });
        }

        // 普通文本使用智能分割策略
        const strategy = this.getOptimalSplitStrategy(text);
        return this.markdownStream(text, res, {
            ...strategy,
            preserveNewlines: false,
        });
    }

    /**
     * 自动流式输出（推荐使用）
     * 自动检测内容类型并选择最佳输出策略
     * @param text 要输出的完整文本
     * @param res Express响应对象
     * @param customOptions 自定义选项（可选）
     */
    static async autoStream(
        text: string,
        res: Response,
        customOptions?: {
            /** 输出速度（毫秒） */
            speed?: number;
            /** 最小块大小（字符数） */
            minChunkSize?: number;
            /** 最大块大小（字符数） */
            maxChunkSize?: number;
        },
    ): Promise<void> {
        const isMarkdown = this.isMarkdownContent(text);

        if (isMarkdown) {
            const strategy = this.getOptimalSplitStrategy(text);
            return this.markdownStream(text, res, {
                ...strategy,
                ...customOptions,
                preserveNewlines: true,
            });
        }

        // 普通文本使用智能分割
        const strategy = this.getOptimalSplitStrategy(text);
        const finalOptions = { ...strategy, ...customOptions };
        return this.markdownStream(text, res, {
            ...finalOptions,
            preserveNewlines: false,
        });
    }

    /**
     * 发送流式数据
     * @param res Express响应对象
     * @param type 数据类型
     * @param data 数据内容
     */
    static sendStreamData(res: Response, type: string, data: any): void {
        res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
    }

    /**
     * 发送流式结束信号
     * @param res Express响应对象
     */
    static sendStreamEnd(res: Response): void {
        res.write("data: [DONE]\n\n");
    }

    /**
     * 设置流式响应头
     * @param res Express响应对象
     */
    static setStreamHeaders(res: Response): void {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "Cache-Control");
    }

    /**
     * 智能分割文本，保持语义完整
     * @param text 要分割的文本
     * @param minSize 最小块大小
     * @param maxSize 最大块大小
     * @returns 分割后的文本块数组
     */
    private static splitTextByWords(text: string, minSize: number, maxSize: number): string[] {
        const chunks: string[] = [];
        let currentChunk = "";

        // 按空格、标点符号分割
        const words = text.split(/(\s+|[^\s]+)/).filter((s) => s.trim());

        for (const word of words) {
            if (currentChunk.length + word.length <= maxSize) {
                currentChunk += word;
            } else {
                if (currentChunk.length >= minSize) {
                    chunks.push(currentChunk);
                    currentChunk = word;
                } else {
                    currentChunk += word;
                }
            }
        }

        // 添加最后一个块
        if (currentChunk.trim()) {
            chunks.push(currentChunk);
        }

        return chunks;
    }

    /**
     * 检测文本是否为 Markdown 内容
     * @param text 要检测的文本
     * @returns 是否为 Markdown 内容
     */
    private static isMarkdownContent(text: string): boolean {
        // 检测常见的 Markdown 语法标记
        const markdownPatterns = [
            /^#{1,6}\s/m, // 标题
            /^\s*[-*+]\s/m, // 无序列表
            /^\s*\d+\.\s/m, // 有序列表
            /^\s*>\s/m, // 引用
            /```[\s\S]*```/, // 代码块
            /`[^`]+`/, // 行内代码
            /\[([^\]]+)\]\([^)]+\)/, // 链接
            /!\[([^\]]*)\]\([^)]+\)/, // 图片
            /^\s*\|.*\|.*\|/m, // 表格
            /\*\*[^*]+\*\*/, // 粗体
            /\*[^*]+\*/, // 斜体
            /~~[^~]+~~/, // 删除线
        ];

        return markdownPatterns.some((pattern) => pattern.test(text));
    }

    /**
     * 获取文本的最佳分割策略
     * @param text 要分析的文本
     * @returns 推荐的分割策略配置
     */
    private static getOptimalSplitStrategy(text: string): {
        speed: number;
        minChunkSize: number;
        maxChunkSize: number;
    } {
        const length = text.length;
        const isMarkdown = this.isMarkdownContent(text);

        if (isMarkdown) {
            if (length < 100) {
                return { speed: 60, minChunkSize: 12, maxChunkSize: 40 };
            } else if (length < 500) {
                return { speed: 80, minChunkSize: 15, maxChunkSize: 60 };
            } else {
                return { speed: 100, minChunkSize: 20, maxChunkSize: 80 };
            }
        }

        if (length < 50) {
            return { speed: 40, minChunkSize: 5, maxChunkSize: 12 };
        } else if (length < 200) {
            return { speed: 60, minChunkSize: 8, maxChunkSize: 20 };
        } else {
            return { speed: 80, minChunkSize: 12, maxChunkSize: 30 };
        }
    }

    /**
     * Markdown 友好的流式输出
     * 保持 Markdown 语法结构的完整性，避免破坏格式
     * @param text 要输出的完整文本
     * @param res Express响应对象
     * @param options 输出选项
     */
    static async markdownStream(
        text: string,
        res: Response,
        options: {
            /** 输出速度（毫秒） */
            speed?: number;
            /** 最小块大小（字符数） */
            minChunkSize?: number;
            /** 最大块大小（字符数） */
            maxChunkSize?: number;
            /** 是否保持换行符完整 */
            preserveNewlines?: boolean;
        } = {},
    ): Promise<void> {
        const {
            speed = 80,
            minChunkSize = 15,
            maxChunkSize = 60,
            preserveNewlines = true,
        } = options;

        // 如果文本很短，直接输出
        if (text.length <= minChunkSize) {
            res.write(`data: ${JSON.stringify({ type: "chunk", data: text })}\n\n`);
            return;
        }

        // 智能分割 Markdown 文本，保持语法结构完整
        const chunks = this.splitMarkdownText(text, minChunkSize, maxChunkSize, preserveNewlines);

        // 逐块输出
        for (const chunk of chunks) {
            if (chunk.trim()) {
                res.write(`data: ${JSON.stringify({ type: "chunk", data: chunk })}\n\n`);
                await new Promise((resolve) => setTimeout(resolve, speed));
            }
        }
    }

    /**
     * 智能分割 Markdown 文本，保持语法结构完整
     * @param text 要分割的文本
     * @param minSize 最小块大小
     * @param maxSize 最大块大小
     * @param preserveNewlines 是否保持换行符完整
     * @returns 分割后的文本块数组
     */
    private static splitMarkdownText(
        text: string,
        minSize: number,
        maxSize: number,
        _preserveNewlines?: boolean,
    ): string[] {
        const chunks: string[] = [];
        let currentChunk = "";

        // 按行分割，保持换行符完整
        const lines = text.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const rawLine = lines[i];
            if (rawLine === undefined) {
                continue;
            }
            const line = rawLine;
            const isLastLine = i === lines.length - 1;
            const lineWithNewline = isLastLine ? line : line + "\n";

            // 如果当前行加上换行符超过最大块大小，需要分割长行
            if (lineWithNewline && lineWithNewline.length > maxSize) {
                // 先输出当前块
                if (currentChunk.length >= minSize) {
                    chunks.push(currentChunk);
                    currentChunk = "";
                }

                // 分割长行
                const lineChunks = this.splitLongLine(line || "", minSize, maxSize);
                for (let j = 0; j < lineChunks.length; j++) {
                    const lineChunk = lineChunks[j];
                    const isLastLineChunk = j === lineChunks.length - 1;
                    if (lineChunk === undefined) {
                        continue;
                    }
                    const chunkWithNewline =
                        isLastLineChunk && !isLastLine ? lineChunk + "\n" : lineChunk;

                    if (currentChunk.length + chunkWithNewline.length <= maxSize) {
                        currentChunk += chunkWithNewline;
                    } else {
                        if (currentChunk.length >= minSize) {
                            chunks.push(currentChunk);
                            currentChunk = chunkWithNewline;
                        } else {
                            currentChunk += chunkWithNewline;
                        }
                    }
                }
            } else {
                // 检查是否需要刷新当前块
                if (
                    currentChunk.length + lineWithNewline.length > maxSize &&
                    currentChunk.length >= minSize
                ) {
                    chunks.push(currentChunk);
                    currentChunk = lineWithNewline;
                } else {
                    currentChunk += lineWithNewline;
                }
            }
        }

        // 添加最后一个块
        if (currentChunk.trim()) {
            chunks.push(currentChunk);
        }

        return chunks;
    }

    /**
     * 分割长行，保持 Markdown 语法完整
     * @param line 要分割的行
     * @param minSize 最小块大小
     * @param maxSize 最大块大小
     * @returns 分割后的行块数组
     */
    private static splitLongLine(line: string, minSize: number, maxSize: number): string[] {
        const chunks: string[] = [];

        // 如果行长度在合理范围内，直接返回
        if (line.length <= maxSize) {
            return [line];
        }

        // 尝试在句子结束处分割
        const sentenceEndings = /[。！？.!?]\s*/g;
        let lastIndex = 0;
        let match;

        while ((match = sentenceEndings.exec(line)) !== null) {
            const endIndex = match.index + match[0].length;
            const segment = line.substring(lastIndex, endIndex);

            if (segment.length >= minSize && segment.length <= maxSize) {
                chunks.push(segment);
                lastIndex = endIndex;
            } else if (segment.length > maxSize) {
                // 如果段落仍然太长，按标点符号分割
                const subChunks = this.splitByPunctuation(segment, minSize, maxSize);
                chunks.push(...subChunks);
                lastIndex = endIndex;
            }
        }

        // 处理剩余部分
        const remaining = line.substring(lastIndex);
        if (remaining.length > 0) {
            if (remaining.length <= maxSize) {
                chunks.push(remaining);
            } else {
                // 按标点符号分割剩余部分
                const subChunks = this.splitByPunctuation(remaining, minSize, maxSize);
                chunks.push(...subChunks);
            }
        }

        return chunks;
    }

    /**
     * 按标点符号分割文本
     * @param text 要分割的文本
     * @param minSize 最小块大小
     * @param maxSize 最大块大小
     * @returns 分割后的文本块数组
     */
    private static splitByPunctuation(text: string, minSize: number, maxSize: number): string[] {
        const chunks: string[] = [];
        const punctuation = /[，,；;：:、]/g;
        let lastIndex = 0;
        let match;

        while ((match = punctuation.exec(text)) !== null) {
            const endIndex = match.index + 1;
            const segment = text.substring(lastIndex, endIndex);

            if (segment.length >= minSize && segment.length <= maxSize) {
                chunks.push(segment);
                lastIndex = endIndex;
            } else if (segment.length > maxSize) {
                // 如果仍然太长，强制分割
                const forcedChunks = this.forceSplit(segment, minSize, maxSize);
                chunks.push(...forcedChunks);
                lastIndex = endIndex;
            }
        }

        // 处理剩余部分
        const remaining = text.substring(lastIndex);
        if (remaining.length > 0) {
            if (remaining.length <= maxSize) {
                chunks.push(remaining);
            } else {
                const forcedChunks = this.forceSplit(remaining, minSize, maxSize);
                chunks.push(...forcedChunks);
            }
        }

        return chunks;
    }

    /**
     * 强制分割文本（当无法按标点符号分割时）
     * @param text 要分割的文本
     * @param minSize 最小块大小
     * @param maxSize 最大块大小
     * @returns 分割后的文本块数组
     */
    private static forceSplit(text: string, minSize: number, maxSize: number): string[] {
        const chunks: string[] = [];
        let start = 0;

        while (start < text.length) {
            const end = Math.min(start + maxSize, text.length);
            const chunk = text.substring(start, end);

            if (chunk.length >= minSize) {
                chunks.push(chunk);
            } else if (chunks.length > 0) {
                // 如果当前块太小，合并到前一个块
                chunks[chunks.length - 1] += chunk;
            } else {
                // 第一个块，即使很小也要保留
                chunks.push(chunk);
            }

            start = end;
        }

        return chunks;
    }
}
