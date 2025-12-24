import { Logger } from "@nestjs/common";
import axios from "axios";
import * as fse from "fs-extra";
import * as path from "path";
import { finished } from "stream/promises";

/**
 * 插件包验证选项接口
 */
export interface ExtensionValidationOptions {
    /** 必须存在的目录列表 */
    requiredDirs?: string[];
    /** 必须存在的文件列表 */
    requiredFiles?: string[];
    /** 至少存在其中一个的目录列表 */
    atLeastOneDirOf?: string[];
    /** 至少存在其中一个的文件列表 */
    atLeastOneFileOf?: string[];
    /** 是否检查有效文件（非隐藏文件） */
    checkValidFiles?: boolean;
    /** 自定义验证函数 */
    customValidator?: (
        pluginPath: string,
        items: string[],
    ) => Promise<{ isValid: boolean; reason?: string }>;
}

/**
 * 插件包验证选项接口（同步版本）
 */
export interface ExtensionValidationOptionsSync {
    /** 必须存在的目录列表 */
    requiredDirs?: string[];
    /** 必须存在的文件列表 */
    requiredFiles?: string[];
    /** 至少存在其中一个的目录列表 */
    atLeastOneDirOf?: string[];
    /** 至少存在其中一个的文件列表 */
    atLeastOneFileOf?: string[];
    /** 是否检查有效文件（非隐藏文件） */
    checkValidFiles?: boolean;
    /** 自定义验证函数 */
    customValidator?: (
        pluginPath: string,
        items: string[],
    ) => { isValid: boolean; reason?: string };
}

export interface DownloadOptions {
    /** 下载地址 */
    url: string;
    /** 存储文件夹 */
    targetDir?: string;
    /** 自定义文件名（含后缀） */
    fileName?: string;
    /** 是否覆盖同名文件 */
    overwrite?: boolean;
    /** 最大重试次数 */
    retry?: number;
    /** 日志实例 */
    logger?: Logger;
}

export class FileDownloader {
    private static readonly defaultLogger = new Logger("FileDownloader");

    /**
     * 检测是否为无效的插件包
     *
     * @param pluginPath 插件目录路径
     * @param options 验证选项
     * @returns 如果是无效插件包返回true，否则返回false
     */
    static async isInvalidExtensionPackage(
        pluginPath: string,
        options: ExtensionValidationOptions = {
            requiredDirs: [],
            checkValidFiles: true,
        },
    ): Promise<boolean> {
        try {
            // 检查目录是否存在
            if (!(await fse.pathExists(pluginPath))) {
                return true;
            }

            // 读取目录内容
            const items = await fse.readdir(pluginPath);

            // 如果目录为空，则无效
            if (items.length === 0) {
                return true;
            }

            // 检查是否有有效文件（非隐藏文件）
            if (options.checkValidFiles) {
                const validItems = items.filter((item) => !item.startsWith("."));
                if (validItems.length === 0) {
                    return true;
                }
            }

            // 检查必须存在的目录
            if (options.requiredDirs && options.requiredDirs.length > 0) {
                for (const dir of options.requiredDirs) {
                    const dirPath = path.join(pluginPath, dir);
                    const exists = await fse.pathExists(dirPath);
                    const isDir = exists ? (await fse.stat(dirPath)).isDirectory() : false;

                    if (!exists || !isDir) {
                        return true;
                    }
                }
            }

            // 检查必须存在的文件
            if (options.requiredFiles && options.requiredFiles.length > 0) {
                for (const file of options.requiredFiles) {
                    const filePath = path.join(pluginPath, file);
                    const exists = await fse.pathExists(filePath);
                    const isFile = exists ? (await fse.stat(filePath)).isFile() : false;

                    if (!exists || !isFile) {
                        return true;
                    }
                }
            }

            // 检查至少存在其中一个的目录
            if (options.atLeastOneDirOf && options.atLeastOneDirOf.length > 0) {
                let foundOne = false;
                for (const dir of options.atLeastOneDirOf) {
                    const dirPath = path.join(pluginPath, dir);
                    const exists = await fse.pathExists(dirPath);
                    const isDir = exists ? (await fse.stat(dirPath)).isDirectory() : false;

                    if (exists && isDir) {
                        foundOne = true;
                        break;
                    }
                }

                if (!foundOne) {
                    return true;
                }
            }

            // 检查至少存在其中一个的文件
            if (options.atLeastOneFileOf && options.atLeastOneFileOf.length > 0) {
                let foundOne = false;
                for (const file of options.atLeastOneFileOf) {
                    const filePath = path.join(pluginPath, file);
                    const exists = await fse.pathExists(filePath);
                    const isFile = exists ? (await fse.stat(filePath)).isFile() : false;

                    if (exists && isFile) {
                        foundOne = true;
                        break;
                    }
                }

                if (!foundOne) {
                    return true;
                }
            }

            // 执行自定义验证
            if (options.customValidator) {
                const result = await options.customValidator(pluginPath, items);
                if (!result.isValid) {
                    this.defaultLogger.log(
                        `插件包自定义验证失败: ${result.reason || "未提供原因"}`,
                    );
                    return true;
                }
            }

            return false;
        } catch (error) {
            this.defaultLogger.error(
                `检测插件包有效性失败: ${error instanceof Error ? error.message : String(error)}`,
            );
            // 出错时保守处理，返回true表示无效
            return true;
        }
    }

    /**
     * 检测是否为无效的插件包（同步版本）
     *
     * @param pluginPath 插件目录路径
     * @param options 验证选项
     * @returns 如果是无效插件包返回true，否则返回false
     */
    static isInvalidExtensionPackageSync(
        pluginPath: string,
        options: ExtensionValidationOptionsSync = {
            requiredDirs: [],
            checkValidFiles: true,
        },
    ): boolean {
        try {
            // 检查目录是否存在
            if (!fse.pathExistsSync(pluginPath)) {
                return true;
            }

            // 读取目录内容
            const items = fse.readdirSync(pluginPath);

            // 如果目录为空，则无效
            if (items.length === 0) {
                return true;
            }

            // 检查是否有有效文件（非隐藏文件）
            if (options.checkValidFiles) {
                const validItems = items.filter((item) => !item.startsWith("."));
                if (validItems.length === 0) {
                    return true;
                }
            }

            // 检查必须存在的目录
            if (options.requiredDirs && options.requiredDirs.length > 0) {
                for (const dir of options.requiredDirs) {
                    const dirPath = path.join(pluginPath, dir);
                    const exists = fse.pathExistsSync(dirPath);
                    const isDir = exists ? fse.statSync(dirPath).isDirectory() : false;

                    if (!exists || !isDir) {
                        return true;
                    }
                }
            }

            // 检查必须存在的文件
            if (options.requiredFiles && options.requiredFiles.length > 0) {
                for (const file of options.requiredFiles) {
                    const filePath = path.join(pluginPath, file);
                    const exists = fse.pathExistsSync(filePath);
                    const isFile = exists ? fse.statSync(filePath).isFile() : false;

                    if (!exists || !isFile) {
                        return true;
                    }
                }
            }

            // 检查至少存在其中一个的目录
            if (options.atLeastOneDirOf && options.atLeastOneDirOf.length > 0) {
                let foundOne = false;
                for (const dir of options.atLeastOneDirOf) {
                    const dirPath = path.join(pluginPath, dir);
                    const exists = fse.pathExistsSync(dirPath);
                    const isDir = exists ? fse.statSync(dirPath).isDirectory() : false;

                    if (exists && isDir) {
                        foundOne = true;
                        break;
                    }
                }

                if (!foundOne) {
                    return true;
                }
            }

            // 检查至少存在其中一个的文件
            if (options.atLeastOneFileOf && options.atLeastOneFileOf.length > 0) {
                let foundOne = false;
                for (const file of options.atLeastOneFileOf) {
                    const filePath = path.join(pluginPath, file);
                    const exists = fse.pathExistsSync(filePath);
                    const isFile = exists ? fse.statSync(filePath).isFile() : false;

                    if (exists && isFile) {
                        foundOne = true;
                        break;
                    }
                }

                if (!foundOne) {
                    return true;
                }
            }

            // 执行自定义验证
            if (options.customValidator) {
                const result = options.customValidator(pluginPath, items);
                if (!result.isValid) {
                    this.defaultLogger.log(
                        `插件包自定义验证失败: ${result.reason || "未提供原因"}`,
                    );
                    return true;
                }
            }

            return false;
        } catch (error) {
            this.defaultLogger.error(
                `检测插件包有效性失败: ${error instanceof Error ? error.message : String(error)}`,
            );
            // 出错时保守处理，返回true表示无效
            return true;
        }
    }

    /**
     * 下载文件
     */
    static async downloadFile(options: DownloadOptions): Promise<string> {
        const {
            url,
            targetDir = path.resolve(process.cwd(), "storage/downloads"),
            fileName,
            overwrite = false,
            retry = 3,
            logger = this.defaultLogger,
        } = options;

        const urlPath = url.split("?")[0];
        const resolvedFileName =
            fileName || (urlPath ? path.basename(urlPath) : null) || "downloaded-file";
        const filePath = path.join(targetDir, resolvedFileName);

        // 跳过已存在文件
        if (!overwrite && (await fse.pathExists(filePath))) {
            logger.warn(`文件已存在，跳过下载：${filePath}`);
            return filePath;
        }

        for (let attempt = 1; attempt <= retry; attempt++) {
            try {
                await fse.ensureDir(targetDir);
                console.log(url);

                logger.log(`开始下载：${url}`);
                const response = await axios({
                    url,
                    method: "GET",
                    responseType: "stream",
                });

                const writer = fse.createWriteStream(filePath);
                response.data.pipe(writer);
                await finished(writer);

                logger.log(`下载成功：${filePath}`);
                return filePath;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                logger.error(`第 ${attempt} 次下载失败: ${errorMessage}`);

                // 清理部分下载文件
                await fse.remove(filePath).catch(() => null);

                if (attempt === retry) {
                    throw new Error(errorMessage);
                }
            }
        }

        throw new Error(`${url}`);
    }

    /**
     * 复制文件或目录
     */
    static async copy(src: string, dest: string, options?: fse.CopyOptions): Promise<boolean> {
        try {
            await fse.copy(src, dest, options);
            return true;
        } catch (error) {
            this.defaultLogger.error(
                `复制失败: ${error instanceof Error ? error.message : String(error)}`,
            );
            return false;
        }
    }

    /**
     * 移动文件或目录
     */
    static async move(src: string, dest: string, options?: fse.MoveOptions): Promise<boolean> {
        try {
            await fse.move(src, dest, options);
            return true;
        } catch (error) {
            this.defaultLogger.error(
                `移动失败: ${error instanceof Error ? error.message : String(error)}`,
            );
            return false;
        }
    }

    /**
     * 删除文件或目录
     */
    static async remove(targetPath: string): Promise<boolean> {
        try {
            await fse.remove(targetPath);
            return true;
        } catch (error) {
            this.defaultLogger.error(
                `删除失败: ${error instanceof Error ? error.message : String(error)}`,
            );
            return false;
        }
    }

    /**
     * 判断文件或目录是否存在
     */
    static async exists(targetPath: string): Promise<boolean> {
        return fse.pathExists(targetPath);
    }

    /**
     * 读取 JSON 文件
     */
    static async readJson<T = any>(jsonPath: string): Promise<T | null> {
        try {
            return await fse.readJson(jsonPath);
        } catch (error) {
            this.defaultLogger.error(
                `读取 JSON 失败: ${error instanceof Error ? error.message : String(error)}`,
            );
            return null;
        }
    }

    /**
     * 写入 JSON 文件
     */
    static async writeJson(
        filePath: string,
        data: any,
        options?: fse.JsonOutputOptions,
    ): Promise<boolean> {
        try {
            await fse.outputJson(filePath, data, options);
            return true;
        } catch (error) {
            this.defaultLogger.error(
                `写入 JSON 失败: ${error instanceof Error ? error.message : String(error)}`,
            );
            return false;
        }
    }

    /**
     * 确保目录存在
     */
    static async ensureDir(dirPath: string): Promise<boolean> {
        try {
            await fse.ensureDir(dirPath);
            return true;
        } catch (error) {
            this.defaultLogger.error(
                `确保目录失败: ${error instanceof Error ? error.message : String(error)}`,
            );
            return false;
        }
    }
}

export class ExtensionFileManager {
    /**
     * 检测是否为无效的插件包
     *
     * @param pluginPath 插件目录路径
     * @param options 验证选项
     * @returns 如果是无效插件包返回true，否则返回false
     */
    static async isInvalidExtensionPackage(
        pluginPath: string,
        options: ExtensionValidationOptions = {
            requiredDirs: [],
            checkValidFiles: true,
        },
    ): Promise<{ isValid: boolean; reason: string }> {
        try {
            // 检查目录是否存在
            if (!(await fse.pathExists(pluginPath))) {
                return {
                    isValid: true,
                    reason: "插件包目录不存在",
                };
            }

            // 读取目录内容
            const items = await fse.readdir(pluginPath);

            // 如果目录为空，则无效
            if (items.length === 0) {
                return {
                    isValid: true,
                    reason: "插件包目录为空",
                };
            }

            // 检查是否有有效文件（非隐藏文件）
            if (options.checkValidFiles) {
                const validItems = items.filter((item) => !item.startsWith("."));
                if (validItems.length === 0) {
                    return {
                        isValid: true,
                        reason: "插件包目录中没有有效文件",
                    };
                }
            }

            // 检查必须存在的目录
            if (options.requiredDirs && options.requiredDirs.length > 0) {
                for (const dir of options.requiredDirs) {
                    const dirPath = path.join(pluginPath, dir);
                    const exists = await fse.pathExists(dirPath);
                    const isDir = exists ? (await fse.stat(dirPath)).isDirectory() : false;

                    if (!exists || !isDir) {
                        return {
                            isValid: true,
                            reason: `插件包目录中不存在必须存在的目录 ${dir}`,
                        };
                    }
                }
            }

            // 检查必须存在的文件
            if (options.requiredFiles && options.requiredFiles.length > 0) {
                for (const file of options.requiredFiles) {
                    const filePath = path.join(pluginPath, file);
                    const exists = await fse.pathExists(filePath);
                    const isFile = exists ? (await fse.stat(filePath)).isFile() : false;

                    if (!exists || !isFile) {
                        return {
                            isValid: true,
                            reason: `插件包目录中必要文件不存在 ${file}`,
                        };
                    }
                }
            }

            // 检查至少存在其中一个的目录
            if (options.atLeastOneDirOf && options.atLeastOneDirOf.length > 0) {
                let foundOne = false;
                for (const dir of options.atLeastOneDirOf) {
                    const dirPath = path.join(pluginPath, dir);
                    const exists = await fse.pathExists(dirPath);
                    const isDir = exists ? (await fse.stat(dirPath)).isDirectory() : false;

                    if (exists && isDir) {
                        foundOne = true;
                        break;
                    }
                }

                if (!foundOne) {
                    return {
                        isValid: true,
                        reason: `插件包目录中不存在至少存在其中一个的目录 ${options.atLeastOneDirOf}`,
                    };
                }
            }

            // 检查至少存在其中一个的文件
            if (options.atLeastOneFileOf && options.atLeastOneFileOf.length > 0) {
                let foundOne = false;
                for (const file of options.atLeastOneFileOf) {
                    const filePath = path.join(pluginPath, file);
                    const exists = await fse.pathExists(filePath);
                    const isFile = exists ? (await fse.stat(filePath)).isFile() : false;

                    if (exists && isFile) {
                        foundOne = true;
                        break;
                    }
                }

                if (!foundOne) {
                    return {
                        isValid: true,
                        reason: `插件包目录中不存在至少存在其中一个的文件 ${options.atLeastOneFileOf}`,
                    };
                }
            }

            // 执行自定义验证
            if (options.customValidator) {
                const result = await options.customValidator(pluginPath, items);
                if (result.isValid) {
                    return {
                        isValid: true,
                        reason: result.reason || "自定义验证失败",
                    };
                }
            }

            return {
                isValid: false,
                reason: "",
            };
        } catch (error) {
            return {
                isValid: false,
                reason: error instanceof Error ? error.message : String(error),
            };
        }
    }

    /**
     * 检测是否为无效的插件包（同步版本）
     *
     * @param pluginPath 插件目录路径
     * @param options 验证选项
     * @returns 如果是无效插件包返回true，否则返回false
     */
    static isInvalidExtensionPackageSync(
        pluginPath: string,
        options: ExtensionValidationOptionsSync = {
            requiredDirs: [],
            checkValidFiles: true,
        },
    ): { isValid: boolean; reason: string } {
        try {
            // 检查目录是否存在
            if (!fse.pathExistsSync(pluginPath)) {
                return {
                    isValid: true,
                    reason: "插件包目录不存在",
                };
            }

            // 读取目录内容
            const items = fse.readdirSync(pluginPath);

            // 如果目录为空，则无效
            if (items.length === 0) {
                return {
                    isValid: true,
                    reason: "插件包目录为空",
                };
            }

            // 检查是否有有效文件（非隐藏文件）
            if (options.checkValidFiles) {
                const validItems = items.filter((item) => !item.startsWith("."));
                if (validItems.length === 0) {
                    return {
                        isValid: true,
                        reason: "插件包目录中没有有效文件",
                    };
                }
            }

            // 检查必须存在的目录
            if (options.requiredDirs && options.requiredDirs.length > 0) {
                for (const dir of options.requiredDirs) {
                    const dirPath = path.join(pluginPath, dir);
                    const exists = fse.pathExistsSync(dirPath);
                    const isDir = exists ? fse.statSync(dirPath).isDirectory() : false;

                    if (!exists || !isDir) {
                        return {
                            isValid: true,
                            reason: `插件包目录中不存在必须存在的目录 ${dir}`,
                        };
                    }
                }
            }

            // 检查必须存在的文件
            if (options.requiredFiles && options.requiredFiles.length > 0) {
                for (const file of options.requiredFiles) {
                    const filePath = path.join(pluginPath, file);
                    const exists = fse.pathExistsSync(filePath);
                    const isFile = exists ? fse.statSync(filePath).isFile() : false;

                    if (!exists || !isFile) {
                        return {
                            isValid: true,
                            reason: `插件包目录中不存在必须存在的文件 ${file}`,
                        };
                    }
                }
            }

            // 检查至少存在其中一个的目录
            if (options.atLeastOneDirOf && options.atLeastOneDirOf.length > 0) {
                let foundOne = false;
                for (const dir of options.atLeastOneDirOf) {
                    const dirPath = path.join(pluginPath, dir);
                    const exists = fse.pathExistsSync(dirPath);
                    const isDir = exists ? fse.statSync(dirPath).isDirectory() : false;

                    if (exists && isDir) {
                        foundOne = true;
                        break;
                    }
                }

                if (!foundOne) {
                    return {
                        isValid: true,
                        reason: `插件包目录中不存在至少存在其中一个的目录 ${options.atLeastOneDirOf}`,
                    };
                }
            }

            // 检查至少存在其中一个的文件
            if (options.atLeastOneFileOf && options.atLeastOneFileOf.length > 0) {
                let foundOne = false;
                for (const file of options.atLeastOneFileOf) {
                    const filePath = path.join(pluginPath, file);
                    const exists = fse.pathExistsSync(filePath);
                    const isFile = exists ? fse.statSync(filePath).isFile() : false;

                    if (exists && isFile) {
                        foundOne = true;
                        break;
                    }
                }

                if (!foundOne) {
                    return {
                        isValid: true,
                        reason: `插件包目录中不存在至少存在其中一个的文件 ${options.atLeastOneFileOf}`,
                    };
                }
            }

            // 执行自定义验证
            if (options.customValidator) {
                const result = options.customValidator(pluginPath, items);
                if (result.isValid) {
                    return {
                        isValid: true,
                        reason: result.reason || "自定义验证失败",
                    };
                }
            }

            return {
                isValid: false,
                reason: "",
            };
        } catch (error) {
            return {
                isValid: true,
                reason: error instanceof Error ? error.message : String(error),
            };
        }
    }
}
