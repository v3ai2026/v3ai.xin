import { existsSync, readFileSync } from "node:fs";
import { cp, mkdir, rm, chmod, lstat } from "node:fs/promises";
import { readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import chalk from "chalk";

/**
 * Copy extension build output to public/web/extensions directory
 * @description Copy .output/public directory contents to root /public/web/extensions/{package-name} directory
 */
async function copyExtensionBuild() {
    try {
        const cwd = process.cwd();
        const packageJsonPath = path.resolve(cwd, "package.json");
        const outputPath = path.resolve(cwd, ".output/public");
        const rootPath = path.resolve(cwd, "../../");
        const targetBasePath = path.resolve(rootPath, "public/web/extensions");

        console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        console.log(chalk.blue("🚀 Starting extension build copy process"));
        console.log(chalk.blue(`📂 Working directory: ${cwd}`));
        console.log(chalk.blue("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));

        // Check if package.json exists
        if (!existsSync(packageJsonPath)) {
            console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
            console.log(chalk.red("✖ package.json file not found"));
            console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
            process.exit(1);
        }

        // Read package.json to get package name
        const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
        const packageName = packageJson.name;

        if (!packageName) {
            console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
            console.log(chalk.red("✖ name field not found in package.json"));
            console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
            process.exit(1);
        }

        console.log(chalk.blue(`📦 Extension package name: ${packageName}`));

        // Check if source directory exists
        if (!existsSync(outputPath)) {
            console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
            console.log(chalk.red("✖ Source directory does not exist: .output/public"));
            console.log(chalk.red("✖ Please run build:publish command first to generate build files"));
            console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
            process.exit(1);
        }

        // Target directory path
        const targetPath = path.resolve(targetBasePath, packageName);

        // Ensure parent directory exists
        await mkdir(targetBasePath, { recursive: true, mode: 0o777 });

        // Remove existing target directory if it exists
        if (existsSync(targetPath)) {
            console.log(chalk.yellow(`🔄 Removing existing target directory: ${targetPath}`));
            await rm(targetPath, { recursive: true, force: true });
        }

        // Copy files
        console.log(chalk.blue(`📋 Starting to copy files...`));
        console.log(chalk.blue(`   Source: ${path.relative(cwd, outputPath)}`));
        console.log(chalk.blue(`   Target: ${path.relative(rootPath, targetPath)}`));

        await cp(outputPath, targetPath, { recursive: true, force: true });

        // Set file permissions (non-Windows systems)
        if (process.platform !== "win32") {
            console.log(chalk.blue("🔐 Setting file permissions..."));
            await setPermissionsRecursively(targetPath);
        }

        // Output success message
        console.log(chalk.green("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        console.log(chalk.green("✨ Copy successful!"));
        console.log(chalk.green(`📦 Extension package name: ${packageName}`));
        console.log(chalk.green(`📂 Target directory: ${path.relative(rootPath, targetPath)}`));
        console.log(chalk.green(`🔗 Access path: /web/extensions/${packageName}`));
        console.log(chalk.green("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
    } catch (error) {
        console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        console.log(chalk.red("❌ Copy failed"));
        console.log(chalk.red(`💥 Error message: ${error.message}`));
        console.log(chalk.red("📍 Error stack:"));
        console.log(error.stack);
        console.log(chalk.red("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"));
        process.exit(1);
    }
}

/**
 * Recursively set directory and file permissions
 * @param {string} dirPath Directory path
 */
async function setPermissionsRecursively(dirPath) {
    if (process.platform === "win32") return; // Windows does not set permissions

    try {
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
            chalk.yellow(`⚠️  Warning: Failed to set permissions: ${dirPath}, error: ${error.message}`),
        );
    }
}

// Execute copy
copyExtensionBuild();

