#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import { networkInterfaces } from "os";
import path from "path";
import { fileURLToPath } from "url";

import { AdvancedLogger, Logger, printBrandLogo } from "../src/utils/logger.js";

// Define project root directory (ESM requires manual calculation of __dirname/__filename)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "../../..");

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
 * Run predeploy script to prepare the project
 */
async function runPredeploy() {
    try {
        Logger.info("Setup", "Running predeploy script...");
        const predeployScript = path.join(__dirname, "predeploy.js");
        await executeCommand("node", [predeployScript, "--quiet"], { cwd: rootDir });
        Logger.success("Setup", "Predeploy completed.");
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Logger.error("Setup", `Predeploy failed: ${reason}`);
        process.exit(1);
    }
}

/**
 * Print startup information
 * @param {number} startTime - Setup start timestamp
 */
async function printStartupInfo(startTime) {
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
        Logger.warning("Startup Info", `Failed to read project info: ${reason}`);
    }

    const env = process.env.NODE_ENV || "development";
    const port = process.env.SERVER_PORT || 4090;

    // Get network interfaces
    const nets = networkInterfaces();
    const ipAddresses = [];

    for (const name of Object.keys(nets)) {
        for (const net of nets[name] ?? []) {
            // Only get IPv4 addresses and exclude internal address 127.0.0.1
            // Support both Node.js < 18 (family: "IPv4") and >= 18 (family: 4)
            const isIPv4 = net.family === "IPv4" || net.family === 4;
            if (isIPv4 && !net.internal) {
                ipAddresses.push(net.address);
            }
        }
    }

    AdvancedLogger.log("App Name", projectName);
    AdvancedLogger.log("App Version", `v${projectVersion}`);
    AdvancedLogger.log("Env", env);
    AdvancedLogger.log("Node Version", process.version);
    AdvancedLogger.log("Local", `http://localhost:${port}`);

    // Display all network addresses
    if (ipAddresses.length > 0) {
        ipAddresses.forEach((ip) => {
            AdvancedLogger.log("Network", `http://${ip}:${port}`);
        });
    }

    // Calculate and display setup duration
    const duration = Date.now() - startTime;

    if (duration < 60000) {
        AdvancedLogger.success("Setup Time", `${duration} ms`);
    } else if (duration < 180000) {
        AdvancedLogger.log("Setup Time", `${duration} ms`);
    } else if (duration < 600000) {
        AdvancedLogger.warn("Setup Time", `${duration} ms`);
    } else {
        AdvancedLogger.error("Setup Time", `${duration} ms`, {
            icon: "⚠",
        });
    }

    console.log(""); // Empty line for better readability
}

/**
 * Show completion message after setup
 */
function showCompletionMessage() {
    Logger.success("Setup", "BuildingAI project setup completed!");
}

/**
 * Main function
 */
async function main() {
    const startTime = Date.now();
    Logger.info("Setup", "Starting BuildingAI project setup...");

    try {
        // Run predeploy script to prepare the project
        await runPredeploy();

        // Show completion message
        showCompletionMessage();

        // Dynamically import pm2 command after dependencies are installed
        const { startApi: startApiWithPm2 } = await import("../src/commands/pm2.js");

        // Start API service via PM2 (non-blocking process supervision)
        await startApiWithPm2();

        printBrandLogo();

        // Print startup information
        await printStartupInfo(startTime);
    } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        Logger.error("Setup", `Project setup failed: ${reason}`);
        process.exit(1);
    }
}

// Execute main function
main().catch((error) => {
    const reason = error instanceof Error ? (error.stack ?? error.message) : String(error);
    Logger.error("Setup", `Uncaught error: ${reason}`);
    process.exit(1);
});
