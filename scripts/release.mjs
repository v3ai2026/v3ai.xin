import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { cp, mkdir, rm, chmod, lstat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import chalk from "chalk";

// Check Node.js version
const requiredVersion = 16;
const currentVersion = process.version.match(/^v(\d+)/)[1];

if (Number(currentVersion) < requiredVersion) {
    console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    console.log(chalk.red(`✖ Node.js v${requiredVersion} or higher is required`));
    console.log(chalk.red(`✖ Current version: ${process.version}`));
    console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    process.exit(1);
}

// Path configuration
const cwd = process.cwd();
const releasePath = path.resolve(cwd, "../../../public/web");
const outputPath = path.resolve(cwd, ".output");
const isSSR = process.env.NUXT_BUILD_SSR === "true";

// Build release mapping table
function buildReleaseMap() {
    console.log(chalk.blue(`📋 Build mode: ${isSSR ? "SSR" : "Static Generation"}`));

    // SSR mode mapping
    if (isSSR) {
        console.log(chalk.blue("🔍 SSR mode - copying server files"));
        return {
            ".output": ".output",
            static: "static",
            "package.json": "package.json",
            ".env": ".env",
            ".env.production": ".env.production",
        };
    }

    // Static mode mapping
    console.log(chalk.blue("🔍 Static mode - copying client files"));
    const releaseMap = {};

    if (!existsSync(".output/public")) {
        console.log(chalk.red("❌ Static output directory does not exist: .output/public"));
        process.exit(1);
    }

    const files = readdirSync(".output/public");
    console.log(chalk.blue(`📁 Found ${files.length} files/directories to copy`));

    files.forEach((file) => {
        releaseMap[`.output/public/${file}`] = file;
    });

    return releaseMap;
}

/**
 * Process SPA loading icon path replacement
 * If PNG file exists, replace with PNG path, otherwise keep SVG path
 */
function processSpaLoadingIcon() {
    if (isSSR) return; // SSR mode does not need processing

    console.log(chalk.blue("🔄 Processing SPA loading icon path replacement..."));

    const templatePath = path.resolve(releasePath, "spa-loading-template.html");
    const pngPath = path.resolve(cwd, "public/spa-loading.png");

    if (!existsSync(templatePath)) {
        console.log(chalk.yellow("⚠️ Template file does not exist: spa-loading-template.html"));
        return;
    }

    try {
        let templateContent = readFileSync(templatePath, "utf-8");

        // Check if PNG file exists
        const iconPath = existsSync(pngPath) ? "/spa-loading.png" : "/spa-loading.svg";

        // Replace image path
        templateContent = templateContent.replace(
            /src="\/spa-loading\.(png|svg)"/g,
            `src="${iconPath}"`,
        );

        // Write back to file
        writeFileSync(templatePath, templateContent, { encoding: "utf-8", mode: 0o777 });
        console.log(chalk.green(`✅ SPA loading icon updated to: ${iconPath}`));
    } catch (error) {
        console.log(chalk.red(`❌ SPA loading icon processing failed: ${error.message}`));
    }
}

// Copy file or directory
async function copyFile(src, dest) {
    if (!existsSync(src)) return;

    // Ensure target directory exists
    await mkdir(path.dirname(dest), { recursive: true, mode: 0o777 });

    // Handle existing target
    const isUpdate = existsSync(dest);
    if (isUpdate) {
        await rm(dest, { recursive: true, force: true });
    }

    // Execute copy
    try {
        await cp(src, dest, { recursive: true, force: true });

        // Set file permissions
        if (process.platform !== "win32") {
            // Only set permissions on non-Windows systems
            // If it's a directory, set to 777, if it's a file, set to 777
            const stat = await lstat(dest);
            const isDir = stat.isDirectory();
            await chmod(dest, isDir ? 0o777 : 0o777);
        }
    } catch (error) {
        console.log(chalk.red(`Copy file failed: ${src} -> ${dest}`));
        console.log(chalk.red(`Error message: ${error.message}`));
        throw error;
    }

    // Output log
    const relativeSrc = path.relative(cwd, src);
    const relativeDest = path.relative(releasePath, dest);
    const logColor = isUpdate ? chalk.yellow : chalk.blue;
    const logIcon = isUpdate ? "🔄 Updated:" : "📦 Added:";
    console.log(`${logColor}${logIcon} ${relativeSrc} → ${relativeDest}`);
}

/**
 * Recursively set directory and file permissions
 * @param {string} dirPath Directory path
 */
async function setPermissionsRecursively(dirPath) {
    if (process.platform === "win32") return; // Windows does not set permissions

    try {
        console.log(chalk.blue(`Setting directory permissions: ${dirPath}`));

        // Set current directory permissions
        await chmod(dirPath, 0o777);

        // Read directory contents
        const entries = readdirSync(dirPath, { withFileTypes: true });

        // Traverse directory contents
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            if (entry.isDirectory()) {
                // If it's a directory, recursively set
                await setPermissionsRecursively(fullPath);
            } else {
                // If it's a file, set file permissions
                await chmod(fullPath, 0o777);
            }
        }
    } catch (error) {
        console.log(
            chalk.yellow(`Warning: Failed to set permissions: ${dirPath}, error: ${error.message}`),
        );
    }
}

// Main build process
async function build() {
    try {
        console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        console.log(chalk.blue("🚀 Starting release process"));
        console.log(chalk.blue(`📂 Working directory: ${cwd}`));
        console.log(chalk.blue(`📦 Target directory: ${releasePath}`));
        console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

        // Check source directory
        if (!existsSync(outputPath)) {
            console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
            console.log(chalk.red("✖ Source directory does not exist: .output"));
            console.log(chalk.red("✖ Please run build command first to generate output files"));
            console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
            process.exit(1);
        }

        // Ensure target directory exists
        await mkdir(releasePath, { recursive: true, mode: 0o777 });

        // Get release mapping and execute copy
        const releaseMap = buildReleaseMap();
        const entries = Object.entries(releaseMap);

        console.log(chalk.blue(`📋 Preparing to copy ${entries.length} items...`));

        await Promise.all(
            entries.map(([src, dest]) =>
                copyFile(path.resolve(cwd, src), path.resolve(releasePath, dest)),
            ),
        );

        // Process SPA loading icon path replacement
        processSpaLoadingIcon();

        // Recursively set permissions for all files and directories
        console.log(chalk.blue("Starting to set file and directory permissions..."));
        await setPermissionsRecursively(releasePath);
        console.log(chalk.green("Permission setting completed"));

        // Output success information
        console.log(chalk.green("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        console.log(chalk.green("✨ Release successful!"));
        console.log(chalk.green(`📋 Build mode: ${isSSR ? "SSR" : "Static Generation"}`));
        console.log(
            chalk.green(`📦 Target directory: ${path.relative(process.cwd(), releasePath)}`),
        );
        console.log(chalk.green(`🔗 Access path: "/"`));
        console.log(chalk.green("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    } catch (error) {
        console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        console.log(chalk.red("❌ Release failed"));
        console.log(chalk.red(`💥 Error message: ${error.message}`));
        console.log(chalk.red("📍 Error stack:"));
        console.log(error.stack);
        console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        process.exit(1);
    }
}

// Execute build
build();
