import { ClientOptions } from "openai";

import { Adapter } from "../interfaces/adapter";
import {
    custom,
    deepseek,
    google,
    hunyuan,
    moonshot,
    ollama,
    openai,
    siliconflow,
    tongyi,
    volcengine,
    wenxin,
    x,
    zhipuai,
} from "../providers";

/**
 * 适配器提供者类型，键为提供者名称，值为对应的适配器工厂函数
 */
type ProviderMap = {
    [key: string]: (config?: ClientOptions) => Adapter;
};

/**
 * 支持的适配器提供者映射
 */
const providers: ProviderMap = {
    deepseek,
    google,
    hunyuan,
    moonshot,
    ollama,
    openai,
    siliconflow,
    tongyi,
    volcengine,
    wenxin,
    x,
    zhipuai,
};

/**
 * 根据提供者名称获取对应的适配器实例
 *
 * @param providerName 适配器提供者名称
 * @param config 可选的客户端配置选项
 * @returns 对应的适配器实例
 */
export const getProvider = (providerName: string, config: ClientOptions = {}): Adapter => {
    // 检查是否存在该提供者
    if (!(providerName in providers)) {
        // 如果不存在，返回自定义适配器
        return custom(config);
    }

    // 获取适配器实例
    const adapter = providers[providerName]!(config);

    // 验证适配器名称是否与请求的名称匹配
    if (adapter.name !== providerName) {
        throw new Error(`Adapter name mismatch: expected ${providerName}, but got ${adapter.name}`);
    }

    return adapter;
};
