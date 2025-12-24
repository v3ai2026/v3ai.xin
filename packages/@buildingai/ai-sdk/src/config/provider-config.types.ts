/**
 * 供应商配置类型定义
 */

import { ModelFeatureType, ModelType } from "../interfaces";

/**
 * 模型属性接口
 */
export interface ModelProperties {
    /**
     * 上下文大小
     */
    context_size?: number;

    /**
     * 模型模式
     */
    mode?: string;

    /**
     * 其他属性
     */
    [key: string]: any;
}

/**
 * 模型配置接口
 */
export interface ModelConfig {
    /**
     * 模型标识符
     */
    model: string;

    /**
     * 模型显示名称
     */
    label: string;

    /**
     * 模型类型
     */
    model_type: ModelType;

    /**
     * 模型特性
     */
    features: ModelFeatureType[];

    /**
     * 模型属性
     */
    model_properties: ModelProperties;

    /**
     * 是否已废弃
     */
    deprecated: boolean;

    /**
     * 图标URL
     */
    icon_url?: string;
}

/**
 * 供应商配置接口
 */
export interface ProviderConfig {
    /**
     * 供应商标识符
     */
    provider: string;

    /**
     * 供应商显示名称
     */
    label: string;

    /**
     * 图标URL
     */
    icon_url?: string;

    /**
     * 支持的模型类型
     */
    supported_model_types: ModelType[];

    /**
     * 模型列表
     */
    models: ModelConfig[];
}
