#!/usr/bin/env node

/**
 * Automatic translation script entrypoint
 *
 * Usage:
 * 1. Install dependencies manually: `pnpm add bing-translate-api --save-dev -w`
 * 2. Run the script: `node scripts/translate-i18n.mjs`
 *
 * This script automatically detects the execution location and translates only the relevant i18n files.
 * - If executed from a plugin directory (extensions/xxx/web), it only translates that plugin's i18n files
 * - If executed from the root directory, it translates all i18n files
 */

import { translate } from "bing-translate-api";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";

// Locate the current file directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the current working directory
const cwd = process.cwd();
const projectRoot = path.resolve(__dirname, "../");

console.log(`📁 Current working directory: ${cwd}`);
console.log(`📁 Project root: ${projectRoot}\n`);

// Define constants
const SOURCE_LANG = "zh";
const LANGUAGE_DEFINITION_FILE = path.resolve(
    projectRoot,
    "packages/web/@buildingai/i18n-config/src/language.ts",
);

/**
 * Get language definitions
 */
function getLanguageDefinitions() {
    const result = {
        language: {
            ZH: "zh",
            EN: "en",
            JP: "jp",
        },
        options: [
            { code: "zh", name: "简体中文", translationCode: "zh" },
            { code: "en", name: "English", translationCode: "en" },
            { code: "jp", name: "日本語", translationCode: "ja" },
        ],
    };

    console.log(`📋 Language definitions:`);
    console.log(result.options.map((opt) => `  - ${opt.name} (${opt.code})`).join("\n"));
    return result;
}

const languages = getLanguageDefinitions();

// Determine target languages
const SOURCE_LANG_OBJ = languages.language.ZH || "zh";
const TARGET_LANGS = languages.options.map((opt) => opt.code).filter((code) => code !== SOURCE_LANG_OBJ);

// Language code mapping
const LANG_CODE_MAP = languages.options.reduce((map, option) => {
    map[option.code] = option.translationCode || option.code;
    return map;
}, {});

/**
 * Detect the execution context and return i18n directories to translate
 */
function detectI18nDirectories() {
    const i18nDirs = [];

    // Check if we're in a plugin directory (extensions/xxx/web)
    const extensionMatch = cwd.match(/extensions\/([^/]+)/);
    if (extensionMatch) {
        const pluginName = extensionMatch[1];
        const pluginI18nPath = path.resolve(projectRoot, "extensions", pluginName, "web", "app", "i18n");

        if (fs.existsSync(pluginI18nPath)) {
            console.log(`🔌 Detected plugin context: ${pluginName}`);
            i18nDirs.push({
                path: pluginI18nPath,
                name: `Plugin: ${pluginName}`,
            });
            return i18nDirs;
        }
    }

    // Check if we're in the main app directory (more precise check)
    const mainAppPath = path.resolve(projectRoot, "packages/web/buildingai-ui/app/i18n");
    const mainAppDir = path.resolve(projectRoot, "packages/web/buildingai-ui");
    const i18nConfigPath = path.resolve(projectRoot, "packages/web/@buildingai/i18n-config/src/i18n");
    if (cwd.startsWith(mainAppDir + path.sep) || cwd === mainAppDir) {
        if (fs.existsSync(mainAppPath)) {
            console.log(`📱 Detected main app context`);
            i18nDirs.push({
                path: mainAppPath,
                name: "Main App",
            });
            // Also include i18n-config if it exists
            if (fs.existsSync(i18nConfigPath)) {
                i18nDirs.push({
                    path: i18nConfigPath,
                    name: "i18n-config",
                });
            }
            return i18nDirs;
        }
    }

    // Check if we're in the i18n-config directory (more precise check)
    const i18nConfigDir = path.resolve(projectRoot, "packages/web/@buildingai/i18n-config");
    if (cwd.startsWith(i18nConfigDir + path.sep) || cwd === i18nConfigDir) {
        if (fs.existsSync(i18nConfigPath)) {
            console.log(`🔧 Detected i18n-config context`);
            i18nDirs.push({
                path: i18nConfigPath,
                name: "i18n-config",
            });
            return i18nDirs;
        }
    }

    // If no context detected, scan for all i18n directories
    console.log(`🌐 Scanning for all i18n directories...`);

    // Add main app i18n
    if (fs.existsSync(mainAppPath)) {
        i18nDirs.push({
            path: mainAppPath,
            name: "Main App",
        });
    }

    // Add i18n-config i18n
    if (fs.existsSync(i18nConfigPath)) {
        i18nDirs.push({
            path: i18nConfigPath,
            name: "i18n-config",
        });
    }

    // Scan extensions
    const extensionsDir = path.resolve(projectRoot, "extensions");
    if (fs.existsSync(extensionsDir)) {
        const items = fs.readdirSync(extensionsDir);
        for (const item of items) {
            const extensionPath = path.join(extensionsDir, item);
            if (!fs.statSync(extensionPath).isDirectory()) {
                continue;
            }

            const i18nPath = path.join(extensionPath, "web", "app", "i18n");
            if (fs.existsSync(i18nPath)) {
                i18nDirs.push({
                    path: i18nPath,
                    name: `Plugin: ${item}`,
                });
            }
        }
    }

    return i18nDirs;
}

/**
 * Reorder the target object to match the key order of the source object
 */
function reorderObjectBySource(sourceObj, targetObj) {
    const result = {};

    for (const key of Object.keys(sourceObj)) {
        if (Object.prototype.hasOwnProperty.call(targetObj, key)) {
            if (
                typeof sourceObj[key] === "object" &&
                sourceObj[key] !== null &&
                !Array.isArray(sourceObj[key])
            ) {
                result[key] = reorderObjectBySource(sourceObj[key], targetObj[key]);
            } else {
                result[key] = targetObj[key];
            }
        }
    }

    return result;
}

/**
 * Translate missing keys within an object deeply
 */
async function translateMissingKeyDeeply(sourceObj, targetObj, toLanguage) {
    await Promise.all(
        Object.keys(sourceObj).map(async (key) => {
            if (targetObj[key] === undefined) {
                if (typeof sourceObj[key] === "object" && sourceObj[key] !== null) {
                    targetObj[key] = {};
                    await translateMissingKeyDeeply(sourceObj[key], targetObj[key], toLanguage);
                } else {
                    try {
                        const source = sourceObj[key];
                        if (!source) {
                            targetObj[key] = "";
                            return;
                        }

                        // Skip translating content containing parentheses
                        if (
                            typeof source === "string" &&
                            (source.includes("(") || source.includes(")"))
                        ) {
                            targetObj[key] = source;
                            return;
                        }

                        // Perform translation
                        console.log(
                            `Translating: "${String(source).substring(0, 30)}${String(source).length > 30 ? "..." : ""}" to ${toLanguage}`,
                        );
                        const result = await translate(source, null, LANG_CODE_MAP[toLanguage] || toLanguage);
                        targetObj[key] = result?.translation || source;
                    } catch (error) {
                        console.error(
                            `Translation error for "${sourceObj[key]}" (${key}) to ${toLanguage}`,
                            error,
                        );
                        targetObj[key] = sourceObj[key];
                    }
                }
            } else if (typeof sourceObj[key] === "object" && sourceObj[key] !== null) {
                targetObj[key] = targetObj[key] || {};
                await translateMissingKeyDeeply(sourceObj[key], targetObj[key], toLanguage);
            }
        }),
    );
}

/**
 * Translate a single file
 */
async function translateFile(fileName, sourceLang, targetLang, i18nDir) {
    try {
        const sourceFile = path.join(i18nDir, sourceLang, `${fileName}.json`);
        const targetFile = path.join(i18nDir, targetLang, `${fileName}.json`);

        if (!fs.existsSync(sourceFile)) {
            throw new Error(`Source file does not exist: ${sourceFile}`);
        }

        const sourceContent = fs.readFileSync(sourceFile, "utf8");
        const sourceObj = JSON.parse(sourceContent);

        let targetObj = {};
        if (fs.existsSync(targetFile)) {
            const targetContent = fs.readFileSync(targetFile, "utf8");
            targetObj = JSON.parse(targetContent);
        }

        await translateMissingKeyDeeply(sourceObj, targetObj, targetLang);

        const reorderedTargetObj = reorderObjectBySource(sourceObj, targetObj);

        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        fs.writeFileSync(targetFile, JSON.stringify(reorderedTargetObj, null, 4), "utf8");

        console.log(`✅ Successfully translated ${fileName}.json from ${sourceLang} to ${targetLang}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to process file: ${fileName}`, error);
        return false;
    }
}

/**
 * Get all JSON files in a language directory
 */
function getLanguageFiles(langDir) {
    if (!fs.existsSync(langDir)) {
        return [];
    }

    return fs
        .readdirSync(langDir)
        .filter((file) => file.endsWith(".json"))
        .map((file) => file.replace(/\.json$/, ""));
}

/**
 * Translate i18n files for a given directory
 */
async function translateI18nDirectory(i18nDir, dirName) {
    const sourceDir = path.join(i18nDir, SOURCE_LANG);
    const files = getLanguageFiles(sourceDir);

    if (files.length === 0) {
        console.log(`⚠️ No JSON files found in ${sourceDir}`);
        return;
    }

    console.log(`\n📁 Processing directory: ${dirName}`);
    console.log(`📝 Found ${files.length} source language files: ${files.join(", ")}`);

    for (const file of files) {
        console.log(`\n🔄 Processing file: ${file}.json`);
        for (const targetLang of TARGET_LANGS) {
            if (targetLang !== SOURCE_LANG) {
                await translateFile(file, SOURCE_LANG, targetLang, i18nDir);
            }
        }
    }
}

/**
 * Main entrypoint
 */
async function main() {
    try {
        console.log(`🔄 Starting automatic translation...`);
        console.log(`📚 Source language: ${SOURCE_LANG}`);
        console.log(`🌐 Target languages: ${TARGET_LANGS.join(", ")}\n`);

        const i18nDirs = detectI18nDirectories();

        if (i18nDirs.length === 0) {
            console.log(`⚠️ No i18n directories found!`);
            return;
        }

        console.log(`\n📂 Found ${i18nDirs.length} i18n directory(ies) to process:`);
        i18nDirs.forEach((dir) => {
            console.log(`  - ${dir.name} (${dir.path})`);
        });

        for (const i18nDir of i18nDirs) {
            await translateI18nDirectory(i18nDir.path, i18nDir.name);
        }

        console.log(`\n✅ Batch translation complete!`);
    } catch (error) {
        console.error(`❌ Script execution error:`, error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error(`❌ Unhandled error:`, error);
    process.exit(1);
});
