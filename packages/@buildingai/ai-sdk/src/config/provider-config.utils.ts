/**
 * 供应商配置工具函数
 * 用于整合所有供应商配置数据
 */

import * as fse from "fs-extra";
import * as path from "path";

import { ProviderConfig } from "./provider-config.types";

/**
 * 供应商配置工具类
 */
export class ProviderConfigUtils {
    /**
     * 供应商配置文件目录
     */
    private static readonly PROVIDERS_DIR = path.join(__dirname, "providers");

    /**
     * 获取所有供应商配置
     *
     * @returns 所有供应商配置数组
     */
    public static getAllProviderConfigs(): ProviderConfig[] {
        try {
            // 确保目录存在
            if (!fse.pathExistsSync(this.PROVIDERS_DIR)) {
                console.warn(`供应商配置目录不存在: ${this.PROVIDERS_DIR}`);
                return [];
            }

            // 读取目录中的所有文件
            const files = fse.readdirSync(this.PROVIDERS_DIR);

            // 过滤出 .config.json 文件
            const configFiles = files.filter((file: string) => file.endsWith(".config.json"));

            // 读取并解析每个配置文件
            const providerConfigs: ProviderConfig[] = [];

            for (const file of configFiles) {
                try {
                    const filePath = path.join(this.PROVIDERS_DIR, file);
                    const config: ProviderConfig = fse.readJsonSync(filePath);

                    providerConfigs.push(config);
                } catch (error) {
                    console.error(`读取供应商配置文件失败: ${file}`, error);
                }
            }

            return providerConfigs;
        } catch (error) {
            console.error("获取供应商配置失败", error);
            return [];
        }
    }

    /**
     * 获取指定供应商的配置
     *
     * @param providerName 供应商名称
     * @returns 供应商配置，如果不存在则返回 undefined
     */
    public static getProviderConfig(providerName: string): ProviderConfig | undefined {
        const allConfigs = this.getAllProviderConfigs();
        return allConfigs.find((config) => config.provider === providerName);
    }

    /**
     * 获取所有模型配置
     *
     * @returns 所有供应商配置数组
     */
    public static getAllModelConfigs(): ProviderConfig[] {
        return this.getAllProviderConfigs();
    }
}
