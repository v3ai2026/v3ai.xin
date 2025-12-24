#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { AdvancedLogger, Logger, printBrandLogo } from "../src/utils/logger.js";

// Define project root directory (ESM requires manual calculation of __dirname/__filename)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "../../..");

// Parse command line arguments
const args = process.argv.slice(2);
const isQuietMode = args.includes("--quiet") || args.includes("-q");

/**
 * Execute command and return Promise
 * @param {string} command - Command to execute
 * @param {string[]} args - Command arguments
 * @param {Object} options - Execution options
 * @returns {Promise<void>}
 */
function executeCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        Logger.info("Command", `Executing command: ${command} ${args.join(" ")}`);

        const childProcess = spawn(command, args, {
            stdio: "inherit",
            shell: true,
            env: {
                ...process.env,
                // Force color output and interactive mode
                FORCE_COLOR: "1",
                // Set CI based on TTY availability to avoid pnpm TTY errors
                CI: process.stdout.isTTY ? "false" : "true",
            },
            ...options,
        });

        childProcess.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command execution failed with exit code: ${code}`));
            }
        });

        childProcess.on("error", (err) => {
            reject(new Error(`Command execution error: ${err.message}`));
        });
    });
}

/**
 * Generate extensions.json file by scanning extensions directory
 */
async function generateExtensionsConfig() {
    const extensionsDir = path.join(rootDir, "extensions");
    const extensionsConfigPath = path.join(extensionsDir, "extensions.json");

    // Check if extensions.json already exists
    if (fs.existsSync(extensionsConfigPath)) {
        Logger.info("Extensions", "extensions.json already exists, skipping generation.");
        return;
    }

    Logger.info("Extensions", "Generating extensions.json...");

    const config = {
        applications: {},
        functionals: {},
    };

    try {
        // Ensure extensions directory exists
        if (!fs.existsSync(extensionsDir)) {
            Logger.warning("Extensions", "Extensions directory does not exist.");
            return;
        }

        // Read all subdirectories in extensions folder
        const entries = fs.readdirSync(extensionsDir, { withFileTypes: true });

        for (const entry of entries) {
            if (!entry.isDirectory()) continue;

            const extensionPath = path.join(extensionsDir, entry.name);
            const manifestPath = path.join(extensionPath, "manifest.json");

            // Check if manifest.json exists
            if (!fs.existsSync(manifestPath)) {
                Logger.warning("Extensions", `No manifest.json found in ${entry.name}, skipping.`);
                continue;
            }

            try {
                // Read and parse manifest.json
                const manifestContent = fs.readFileSync(manifestPath, "utf-8");
                const manifest = JSON.parse(manifestContent);

                // Extract required fields
                const { identifier, name, version, description, author, type } = manifest;

                if (!identifier) {
                    Logger.warning(
                        "Extensions",
                        `Invalid manifest in ${entry.name}: missing identifier.`,
                    );
                    continue;
                }

                // Create extension config
                const extensionConfig = {
                    manifest: {
                        identifier,
                        name: name || identifier,
                        version: version || "0.0.1",
                        description: description || "",
                        author: author || {
                            avatar: "",
                            name: "",
                            homepage: "",
                        },
                    },
                    isLocal: true,
                    enabled: true,
                    installedAt: new Date().toISOString(),
                };

                // Add to appropriate category based on type
                if (type === "functional") {
                    config.functionals[identifier] = extensionConfig;
                } else {
                    // Default to applications
                    config.applications[identifier] = extensionConfig;
                }

                Logger.success("Extensions", `Added extension: ${identifier}`);
            } catch (error) {
                const reason = error instanceof Error ? error.message : String(error);
                Logger.warning(
                    "Extensions",
                    `Failed to parse manifest in ${entry.name}: ${reason}`,
                );
            }
        }

        // Write extensions.json
        fs.writeFileSync(extensionsConfigPath, JSON.stringify(config, null, 4), "utf-8");
        Logger.success("Extensions", "extensions.json generated successfully.");
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Logger.error("Extensions", `Failed to generate extensions.json: ${reason}`);
        throw error;
    }
}

/**
 * Check if environment file exists, create if not
 */
async function checkEnvFile() {
    const envFilePath = path.join(rootDir, ".env");
    const envExamplePath = path.join(rootDir, ".env.example");

    if (!fs.existsSync(envFilePath) && fs.existsSync(envExamplePath)) {
        Logger.info("Environment", "Creating .env file...");
        fs.copyFileSync(envExamplePath, envFilePath);
        Logger.success("Environment", ".env file created.");
    }
}

/**
 * Install dependencies
 */
async function installDependencies() {
    try {
        Logger.info("Dependencies", "Installing project dependencies...");
        await executeCommand("pnpm", ["install"], { cwd: rootDir });
        Logger.success("Dependencies", "Dependencies installation completed.");
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Logger.error("Dependencies", `Dependencies installation failed: ${reason}`);
        process.exit(1);
    }
}

/**
 * Build project
 */
async function buildProject() {
    try {
        Logger.info("Build", "Building project...");
        // Only output errors: ignore child process stdout, keep stderr to current terminal
        await executeCommand("pnpm", ["build"], {
            cwd: rootDir,
            // stdio: ["ignore", "ignore", "inherit"],
        });
        Logger.success("Build", "Project build completed.");
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Logger.error("Build", `Project build failed: ${reason}`);
        process.exit(1);
    }
}

/**
 * Setup buildingai CLI command for project use
 */
async function setupCliCommand() {
    try {
        Logger.info("CLI", "Setting up buildingai command for project...");
        const cliDir = path.join(rootDir, "packages/cli");

        // 使用 pnpm link 在项目内创建链接(不使用 --global)
        await executeCommand("pnpm", ["link", cliDir], { cwd: rootDir });

        Logger.success("CLI", "buildingai command setup completed.");
        Logger.info("CLI", "You can now use 'pnpm buildingai' or 'pnpm pm2:xxx' commands.");
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Logger.warning("CLI", `CLI command setup skipped: ${reason}`);
        Logger.info("CLI", "You can still use: pnpm pm2:start, pnpm pm2:status, etc.");
        // 不退出,继续执行
    }
}

/**
 * Print deployment preparation information
 * @param {number} startTime - Predeploy start timestamp
 */
async function printPredeployInfo(startTime) {
    // In quiet mode, skip detailed info display
    if (isQuietMode) {
        return;
    }

    const packageJsonPath = path.join(rootDir, "package.json");
    let projectName = "BuildingAI";
    let projectVersion = "unknown";

    // Try to read project info from package.json
    try {
        if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
            projectName = packageJson.title || projectName;
            projectVersion = packageJson.version || projectVersion;
        }
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Logger.warning("Predeploy Info", `Failed to read project info: ${reason}`);
    }

    const env = process.env.NODE_ENV || "development";

    AdvancedLogger.log("App Name", projectName);
    AdvancedLogger.log("App Version", `v${projectVersion}`);
    AdvancedLogger.log("Env", env);
    AdvancedLogger.log("Node Version", process.version);

    // Calculate and display predeploy duration
    const duration = Date.now() - startTime;

    if (duration < 60000) {
        AdvancedLogger.success("Predeploy Time", `${duration} ms`);
    } else if (duration < 180000) {
        AdvancedLogger.log("Predeploy Time", `${duration} ms`);
    } else if (duration < 600000) {
        AdvancedLogger.warn("Predeploy Time", `${duration} ms`);
    } else {
        AdvancedLogger.error("Predeploy Time", `${duration} ms`, {
            icon: "⚠",
        });
    }

    console.log(""); // Empty line for better readability
}

/**
 * Show completion message after predeploy
 */
function showCompletionMessage() {
    Logger.success("Predeploy", "BuildingAI project predeploy completed!");
    Logger.info(
        "Predeploy",
        "Project is ready for deployment. Use PM2 commands to start services.",
    );
}

/**
 * Main function
 */
async function main() {
    const startTime = Date.now();
    Logger.info("Predeploy", "Starting BuildingAI project predeploy...");

    try {
        // Generate extensions configuration
        await generateExtensionsConfig();
        Logger.success("Extensions", "Extensions configuration check completed.");

        // Check environment variables file
        await checkEnvFile();
        Logger.success("Environment", "Environment variables check completed.");

        // Install dependencies
        await installDependencies();
        Logger.success("Dependencies", "Dependencies installation completed.");

        // Build project
        await buildProject();
        Logger.success("Build", "Project build completed.");

        // Setup buildingai CLI command for project use
        await setupCliCommand();
        Logger.success("CLI", "CLI command setup completed.");

        // Print brand logo only in verbose mode
        if (!isQuietMode) {
            printBrandLogo();
        }

        // Print predeploy information
        await printPredeployInfo(startTime);

        // Show completion message
        showCompletionMessage();
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Logger.error("Predeploy", `Project predeploy failed: ${reason}`);
        process.exit(1);
    }
}

// Execute main function
main().catch((error) => {
    const reason = error instanceof Error ? (error.stack ?? error.message) : String(error);
    Logger.error("Predeploy", `Uncaught error: ${reason}`);
    process.exit(1);
});
