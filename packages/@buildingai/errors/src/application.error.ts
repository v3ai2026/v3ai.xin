import callsites from "callsites";
import fs from "fs";
import path from "path";

import type { ErrorLevel, ErrorTags, ReportingOptions } from "./types";

/**
 * 包名缓存
 *
 * key: 包目录路径 (如 "/path/to/packages/api" 或 "/path/to/packages/@buildingai/errors")
 * value: package.json 中的真实包名 (如 "@buildingai/api")
 */
const packageNameCache = new Map<string, string>();

/**
 * 应用错误基类
 *
 * 提供统一的错误处理和日志记录功能
 */
export class ApplicationError extends Error {
    level: ErrorLevel;
    readonly tags: ErrorTags;
    readonly extra?: Record<string, any>;
    readonly packageName?: string;

    constructor(message: string, { level, tags = {}, extra }: ReportingOptions = {}) {
        super(message);
        this.level = level ?? "error";
        this.tags = { ...tags };
        this.extra = extra;

        try {
            const sites = callsites();
            // 遍历调用栈,找到第一个不在 errors 包内的调用位置
            for (let i = 2; i < sites.length; i++) {
                const filePath = sites[i]?.getFileName() ?? "";
                if (!filePath.includes("/errors/")) {
                    const packageName = this.extractPackageName(filePath);
                    if (packageName) {
                        this.tags.packageName = packageName;
                        break;
                    }
                }
            }
        } catch {
            // ignore
        }
    }

    /**
     * 从文件路径提取包名
     *
     * 通过读取 package.json 获取真实包名,使用缓存提升性能
     *
     * @param filePath 文件路径
     * @returns 包名
     */
    private extractPackageName(filePath: string): string | null {
        try {
            // 匹配 packages/ 后面的目录结构
            // 支持: packages/@scope/name/ 或 packages/name/
            const scopedMatch = /packages\/(@[^/]+\/[^/]+)\//.exec(filePath);
            const normalMatch = /packages\/([^/@][^/]*)\//.exec(filePath);
            const dirName = scopedMatch?.[1] || normalMatch?.[1];

            if (!dirName) return null;

            // 构建包目录的绝对路径
            const packagesIndex = filePath.indexOf("/packages/");
            if (packagesIndex === -1) return null;

            const rootPath = filePath.substring(0, packagesIndex);
            const packageDir = path.join(rootPath, "packages", dirName);

            // 检查缓存
            if (packageNameCache.has(packageDir)) {
                return packageNameCache.get(packageDir)!;
            }

            // 读取 package.json
            const packageJsonPath = path.join(packageDir, "package.json");
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
                const packageName = packageJson.name || dirName;
                // 缓存结果
                packageNameCache.set(packageDir, packageName);
                return packageName;
            }

            // 如果没有 package.json,缓存目录名
            packageNameCache.set(packageDir, dirName);
            return dirName;
        } catch {
            return null;
        }
    }
}
