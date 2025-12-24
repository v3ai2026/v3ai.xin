import { parsePackageName } from "@buildingai/utils";
import * as fse from "fs-extra";
import * as path from "path";

import { ExtensionPackageJson } from "../interfaces/extension.interface";

/**
 * 同步读取package.json
 * @param dirPath 目录路径
 * @returns package.json内容
 */
export const getPackageJsonSync = (dirPath: string): ExtensionPackageJson | null => {
    try {
        if (!dirPath.includes("package.json")) {
            dirPath = path.join(dirPath, "package.json");
        }

        if (!fse.pathExistsSync(dirPath)) {
            console.error("package.json不存在", dirPath);
            return null;
        }
        const packageJson: ExtensionPackageJson = fse.readJsonSync(dirPath);
        packageJson.name = parsePackageName(packageJson.name) ?? "";
        return packageJson;
    } catch (error) {
        console.error(error);
        return null;
    }
};

/**
 * 异步读取package.json
 * @param dirPath 目录路径
 * @returns package.json内容
 */
export const getPackageJson = async (dirPath: string): Promise<ExtensionPackageJson | null> => {
    try {
        if (!dirPath.includes("package.json")) {
            dirPath = path.join(dirPath, "package.json");
        }

        if (!(await fse.pathExists(dirPath))) {
            console.error("package.json不存在", dirPath);
            return null;
        }
        const packageJson: ExtensionPackageJson = await fse.readJson(dirPath);
        packageJson.name = parsePackageName(packageJson.name) ?? "";
        return packageJson;
    } catch (error) {
        console.error(error);
        return null;
    }
};
