/**
 * AI 模型特性常量定义
 * 定义了 AI 模型支持的各种功能特性
 */

/**
 * 模型特性常量对象
 */
export const MODEL_FEATURES = {
    /**
     * 代理思考能力
     * 模型具有推理和思考过程的能力，可以展示其决策路径
     */
    AGENT_THOUGHT: "agent-thought",

    /**
     * 音频处理能力
     * 模型可以处理、理解或生成音频内容
     */
    AUDIO: "audio",

    /**
     * 文档处理能力
     * 模型可以处理和理解各种格式的文档内容
     */
    DOCUMENT: "document",

    /**
     * 多工具调用能力
     * 模型可以同时调用多个工具来完成复杂任务
     */
    MULTI_TOOL_CALL: "multi-tool-call",

    /**
     * 流式工具调用能力
     * 模型可以以流的方式调用工具，支持实时响应
     */
    STREAM_TOOL_CALL: "stream-tool-call",

    /**
     * 结构化输出能力
     * 模型可以生成符合特定结构的输出，如 JSON、XML 等
     */
    STRUCTURED_OUTPUT: "structured-output",

    /**
     * 工具调用能力
     * 模型可以调用外部工具来扩展其功能
     */
    TOOL_CALL: "tool-call",

    /**
     * 视频处理能力
     * 模型可以处理、理解或分析视频内容
     */
    VIDEO: "video",

    /**
     * 视觉理解能力
     * 模型可以处理和理解图像内容
     */
    VISION: "vision",
} as const;

/**
 * 模型特性类型
 */
export type ModelFeatureType = (typeof MODEL_FEATURES)[keyof typeof MODEL_FEATURES];

/**
 * 模型特性含义对照表
 * 提供每个特性的详细描述和用途
 */
export const MODEL_FEATURE_DESCRIPTIONS: Record<ModelFeatureType, string> = {
    [MODEL_FEATURES.AGENT_THOUGHT]:
        "代理思考能力 - 模型能够展示其推理过程和思考路径，使决策过程更加透明",
    [MODEL_FEATURES.AUDIO]:
        "音频处理能力 - 模型可以理解、处理和生成音频内容，支持语音识别和音频分析",
    [MODEL_FEATURES.DOCUMENT]:
        "文档处理能力 - 模型可以处理各种格式的文档，包括解析、理解和提取文档中的信息",
    [MODEL_FEATURES.MULTI_TOOL_CALL]:
        "多工具调用能力 - 模型可以协调和同时使用多个外部工具来解决复杂问题",
    [MODEL_FEATURES.STREAM_TOOL_CALL]:
        "流式工具调用能力 - 模型支持以流的方式调用工具，实现实时交互和响应",
    [MODEL_FEATURES.STRUCTURED_OUTPUT]:
        "结构化输出能力 - 模型可以生成符合预定义格式的输出，如JSON或其他结构化数据",
    [MODEL_FEATURES.TOOL_CALL]:
        "工具调用能力 - 模型可以调用和使用外部工具来扩展其功能和解决特定问题",
    [MODEL_FEATURES.VIDEO]: "视频处理能力 - 模型可以理解和分析视频内容，支持视频内容的识别和理解",
    [MODEL_FEATURES.VISION]: "视觉理解能力 - 模型可以处理和理解图像，支持图像识别、分析和描述",
};

/**
 * 获取所有模型特性值列表
 *
 * @returns 模型特性值数组
 */
export function getAllModelFeatures(): ModelFeatureType[] {
    return Object.values(MODEL_FEATURES);
}

/**
 * 获取模型特性及其描述信息
 *
 * @returns 特性及描述对象数组
 */
export function getModelFeaturesWithDescriptions(): Array<{
    value: ModelFeatureType;
    label: string;
    description: string;
}> {
    return getAllModelFeatures().map((feature) => ({
        value: feature,
        label: feature.toLocaleUpperCase().replaceAll("-", " "),
        description: MODEL_FEATURE_DESCRIPTIONS[feature],
    }));
}
