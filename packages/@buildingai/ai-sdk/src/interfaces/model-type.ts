/**
 * AI 模型分类常量定义
 * 定义了 AI 模型的不同分类类型
 */

/**
 * 模型分类常量对象
 */
export const MODEL_TYPES = {
    /**
     * 大语言模型
     * 用于自然语言处理、对话生成等任务的通用语言模型
     */
    LLM: "llm",

    /**
     * 内容审核模型
     * 用于检测和过滤有害、不适当或违规内容
     */
    MODERATION: "moderation",

    /**
     * 重排序模型
     * 用于对搜索结果或文档进行相关性排序
     */
    RERANK: "rerank",

    /**
     * 语音转文本模型
     * 将语音内容转换为文本形式
     */
    SPEECH_TO_TEXT: "speech2text",

    /**
     * 文本嵌入模型
     * 将文本转换为向量表示，用于语义搜索等任务
     */
    TEXT_EMBEDDING: "text-embedding",

    /**
     * 文本转语音模型
     * 将文本内容转换为自然语音
     */
    TTS: "tts",
} as const;

/**
 * 模型分类类型
 */
export type ModelType = (typeof MODEL_TYPES)[keyof typeof MODEL_TYPES];

/**
 * 模型分类含义对照表
 * 提供每个分类的详细描述和用途
 */
export const MODEL_TYPE_DESCRIPTIONS: Record<ModelType, string> = {
    [MODEL_TYPES.LLM]: "大语言模型 - 用于自然语言处理、对话生成、内容创作等任务的通用语言模型",
    [MODEL_TYPES.MODERATION]: "内容审核模型 - 用于检测和过滤有害、不适当或违规内容，保障平台安全",
    [MODEL_TYPES.RERANK]: "重排序模型 - 用于对搜索结果或文档列表进行相关性排序，提高搜索质量",
    [MODEL_TYPES.SPEECH_TO_TEXT]:
        "语音转文本模型 - 将语音内容准确转换为文本形式，支持语音识别和转录",
    [MODEL_TYPES.TEXT_EMBEDDING]:
        "文本嵌入模型 - 将文本转换为向量表示，用于语义搜索、文本聚类等任务",
    [MODEL_TYPES.TTS]: "文本转语音模型 - 将文本内容转换为自然、流畅的语音输出",
};

/**
 * 获取所有模型分类值列表
 *
 * @returns 模型分类值数组
 */
export function getAllModelTypes(): ModelType[] {
    return Object.values(MODEL_TYPES);
}

/**
 * 获取模型分类及其描述信息
 *
 * @returns 分类及描述对象数组
 */
export function getModelTypesWithDescriptions(): Array<{
    value: ModelType;
    label: string;
    description: string;
}> {
    return getAllModelTypes().map((type) => ({
        value: type,
        label: type.toLocaleUpperCase().replaceAll("-", " "),
        description: MODEL_TYPE_DESCRIPTIONS[type],
    }));
}
