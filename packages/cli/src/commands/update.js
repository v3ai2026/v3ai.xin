#!/usr/bin/env node

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

import { Logger } from "../utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "../../../..");

/**
 * Execute command and return Promise
 * @param {string} command - Command to execute
 * @param {string[]} args - Command arguments
 * @param {Object} options - Execution options
 * @returns {Promise<void>}
 */
function executeCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        Logger.info("Command", `Executing: ${command} ${args.join(" ")}`);

        const childProcess = spawn(command, args, {
            stdio: "inherit",
            shell: true,
            env: {
                ...process.env,
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
                reject(new Error(`Command failed with exit code: ${code}`));
            }
        });

        childProcess.on("error", (err) => {
            reject(new Error(`Command execution error: ${err.message}`));
        });
    });
}

/**
 * Check if git command exists
 * @returns {Promise<boolean>}
 */
function checkGitExists() {
    return new Promise((resolve) => {
        const childProcess = spawn("git", ["--version"], {
            stdio: "ignore",
            shell: true,
        });

        childProcess.on("close", (code) => {
            resolve(code === 0);
        });

        childProcess.on("error", () => {
            resolve(false);
        });
    });
}

/**
 * Update project without git pull (manual git pull required)
 */
export async function updateProject() {
    try {
        Logger.info("Update", "Starting project update process...");

        // Install dependencies
        Logger.info("Dependencies", "Installing dependencies...");
        await executeCommand("pnpm", ["install"], { cwd: rootDir });
        Logger.success("Dependencies", "Dependencies installed successfully.");

        // Build project
        Logger.info("Build", "Building project...");
        await executeCommand("pnpm", ["build"], { cwd: rootDir });
        Logger.success("Build", "Project built successfully.");

        Logger.success("Update", "Project update completed successfully!");
        Logger.info("Next Step", "Please manually restart PM2 if needed: buildingai pm2:restart");
    } catch (error) {
        Logger.error(
            "Update",
            `Project update failed: ${error instanceof Error ? error.message : String(error)}`,
        );
        process.exit(1);
    }
}

/**
 * Update project with git pull
 */
export async function updateProjectWithGit() {
    try {
        Logger.info("Update", "Starting project update with git pull...");

        // Check if git exists
        Logger.info("Git", "Checking git availability...");
        const gitExists = await checkGitExists();

        if (!gitExists) {
            Logger.error("Git", "Git command not found. Please install git first.");
            process.exit(1);
        }

        Logger.success("Git", "Git is available.");

        // Provide helpful information about git credentials
        Logger.info("Git", "If prompted for credentials, you can configure git to store them:");
        Logger.info("Git", "  1. Run: git config --global credential.helper store");
        Logger.info("Git", "  2. Then manually pull once: git pull");
        Logger.info("Git", "  3. Credentials will be saved for future use");
        Logger.info("Git", "Or use SSH keys for passwordless authentication.");
        console.log(""); // Empty line for better readability

        // Reset local changes before pulling
        Logger.info("Git", "Discarding local changes...");
        await executeCommand("git", ["reset", "--hard", "HEAD"], { cwd: rootDir });
        Logger.success("Git", "Local changes discarded successfully.");

        // Fetch latest changes
        Logger.info("Git", "Fetching latest changes from repository...");
        try {
            await executeCommand("git", ["fetch", "origin"], { cwd: rootDir });
            Logger.success("Git", "Latest changes fetched successfully.");
        } catch (error) {
            Logger.error("Git", "Failed to fetch from remote repository.");
            Logger.info("Git", "This might be due to missing credentials.");
            Logger.info("Git", "");
            Logger.info("Git", "You have two options:");
            Logger.info("Git", "  Option 1: Configure git credential storage");
            Logger.info("Git", "    - Run: git config --global credential.helper store");
            Logger.info("Git", "    - Then: git pull (enter credentials once)");
            Logger.info("Git", "");
            Logger.info("Git", "  Option 2: Manually pull and use update command");
            Logger.info("Git", "    - Run: git pull (pull code manually)");
            Logger.info("Git", "    - Then: buildingai update (update without git pull)");
            throw error;
        }

        // Get current branch name
        Logger.info("Git", "Getting current branch...");
        const getCurrentBranch = () => {
            return new Promise((resolve, reject) => {
                const childProcess = spawn("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
                    cwd: rootDir,
                    shell: true,
                });

                let output = "";
                childProcess.stdout?.on("data", (data) => {
                    output += data.toString();
                });

                childProcess.on("close", (code) => {
                    if (code === 0) {
                        resolve(output.trim());
                    } else {
                        reject(new Error("Failed to get current branch"));
                    }
                });
            });
        };

        const currentBranch = await getCurrentBranch();
        Logger.success("Git", `Current branch: ${currentBranch}`);

        // Reset to remote branch (equivalent to git pull but without merge)
        Logger.info("Git", `Resetting to origin/${currentBranch}...`);
        await executeCommand("git", ["reset", "--hard", `origin/${currentBranch}`], {
            cwd: rootDir,
        });
        Logger.success("Git", "Repository updated successfully.");

        // Install dependencies
        Logger.info("Dependencies", "Installing dependencies...");
        await executeCommand("pnpm", ["install"], { cwd: rootDir });
        Logger.success("Dependencies", "Dependencies installed successfully.");

        // Build project
        Logger.info("Build", "Building project...");
        await executeCommand("pnpm", ["build"], { cwd: rootDir });
        Logger.success("Build", "Project built successfully.");

        Logger.success("Update", "Project update with git pull completed successfully!");
        Logger.info("Next Step", "Please manually restart PM2 if needed: buildingai pm2:restart");
    } catch (error) {
        Logger.error(
            "Update",
            `Project update failed: ${error instanceof Error ? error.message : String(error)}`,
        );
        process.exit(1);
    }
}
