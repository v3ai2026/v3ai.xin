import { Injectable, LoggerService, LogLevel, Optional } from "@nestjs/common";
import chalk from "chalk";
import { format } from "date-fns";
import * as fse from "fs-extra";
import * as path from "path";

/**
 * Custom application logger service.
 *
 * Extends the NestJS LoggerService interface to provide richer logging features.
 * Supports console output and file logging.
 * Supports colorized output for different log levels.
 * Supports splitting log files by date.
 */
@Injectable()
export class AppLoggerService implements LoggerService {
    private context?: string;
    private logLevels: LogLevel[] = ["log", "error", "warn", "debug", "verbose", "fatal"];
    private logDir: string;
    private logFile: string;
    private isFileLogEnabled: boolean;
    private logCleanInterval: number;

    /**
     * Constructor.
     *
     * @param context Logger context, typically the class name.
     * @param configService Configuration service for reading logger settings.
     */
    constructor(@Optional() context?: string) {
        this.context = context;
        // Initialize logger context.

        // Initialize logger configuration.
        this.initLogConfig();
    }

    /**
     * Locate the project root directory.
     *
     * Traverse upward until a pnpm-workspace.yaml file is found.
     * @returns Project root directory path.
     */
    private findProjectRoot(): string {
        let currentDir = process.cwd();
        let maxDepth = 10; // Prevent infinite loops.

        while (maxDepth > 0) {
            const workspaceYamlPath = path.join(currentDir, "pnpm-workspace.yaml");
            if (fse.pathExistsSync(workspaceYamlPath)) {
                return currentDir;
            }

            const parentDir = path.dirname(currentDir);
            if (parentDir === currentDir) {
                // Already reached the file system root directory.
                break;
            }
            currentDir = parentDir;
            maxDepth--;
        }

        // If no workspace marker is found, return the current working directory.
        return process.cwd();
    }

    /**
     * Initialize logger configuration.
     *
     * Read logger settings from the configuration service or fall back to defaults.
     */
    private initLogConfig(): void {
        // Locate the project root directory (search upward for pnpm-workspace.yaml).
        const rootDir = this.findProjectRoot();
        // Persist all logs under the root-level logs directory.
        this.logDir = path.join(rootDir, "logs");

        const configLevels = process.env.LOG_LEVELS;

        if (configLevels) {
            this.logLevels = configLevels.split(",") as LogLevel[];
        }

        // Read the file logging switch.
        this.isFileLogEnabled = process.env.LOG_TO_FILE === "true";

        // Read the log cleanup interval (defaults to three months).
        this.logCleanInterval = parseInt(process.env.LOG_CLEAN_INTERVAL || "3", 10);
        if (isNaN(this.logCleanInterval) || this.logCleanInterval < 1) {
            this.logCleanInterval = 3;
        }

        // Ensure the log directory exists.
        if (this.isFileLogEnabled) {
            fse.ensureDirSync(this.logDir);
            // Initialize the log file path.
            const { filePath } = this.getLogFileInfo();
            this.logFile = filePath;
            // Clean up expired logs during initialization to avoid removal during writes.
            this.cleanupOldLogs();
        }
    }

    /**
     * Clean up outdated logs.
     *
     * Remove logs older than the configured LOG_CLEAN_INTERVAL in months.
     * For example, LOG_CLEAN_INTERVAL=3 removes logs older than three months.
     * Correctly handles leap years and differing month lengths.
     */
    private cleanupOldLogs(): void {
        try {
            // Calculate the target date N months ago.
            const targetDate = this.getDateMonthsAgo(this.logCleanInterval);
            const targetYear = String(targetDate.getFullYear());
            const targetMonth = String(targetDate.getMonth() + 1).padStart(2, "0");

            // Determine the targeted month directory.
            const targetMonthDir = path.join(this.logDir, `${targetYear}-${targetMonth}`);

            // Remove the directory when it exists.
            if (fse.pathExistsSync(targetMonthDir)) {
                console.log(
                    `Cleaning logs older than ${this.logCleanInterval} month(s): ${targetMonthDir} (${targetYear}-${targetMonth})`,
                );
                fse.removeSync(targetMonthDir);
            }
        } catch (error) {
            console.error(`Failed to clean outdated logs: ${error.message}`);
        }
    }

    /**
     * Compute the date N months in the past.
     *
     * Relies on the Date object to correctly handle year boundaries,
     * leap years, and variable month lengths.
     *
     * @param months Number of months to subtract.
     * @returns Date instance representing N months ago.
     */
    private getDateMonthsAgo(months: number): Date {
        const date = new Date();
        // The setMonth method automatically handles:
        // 1. Year transitions (e.g., 2025-01 minus 3 months becomes 2024-10)
        // 2. Leap years (processed internally by Date)
        // 3. Variable month lengths (e.g., 31 May minus one month becomes 30 April)
        date.setMonth(date.getMonth() - months);
        return date;
    }

    /**
     * Retrieve the current date components.
     *
     * @returns Date parts for year, month, and day.
     */
    private getCurrentDate(): { year: string; month: string; day: string } {
        const date = new Date();
        const year = String(date.getFullYear());
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return { year, month, day };
    }

    /**
     * 获取日志文件名和目录
     *
     * 根据当前日期生成日志文件名和目录
     * @returns 日志文件名和目录信息
     */
    private getLogFileInfo(): {
        filePath: string;
        monthDir: string;
        fileExists: boolean;
    } {
        const { year, month, day } = this.getCurrentDate();

        // Store logs under a month-specific directory.
        const monthDir = path.join(this.logDir, `${year}-${month}`);

        fse.ensureDirSync(monthDir);

        // Build the log file path.
        const filePath = path.join(monthDir, `${day}.log`);

        // Track whether the file already exists.
        const fileExists = fse.pathExistsSync(filePath);

        return { filePath, monthDir, fileExists };
    }

    /**
     * Get a formatted timestamp string.
     *
     * @returns Timestamp formatted as YYYY-MM-DD HH:mm:ss.SSS.
     */
    private getTimestamp(): string {
        // Use the date-fns library to format time as YYYY-MM-DD HH:mm:ss.SSS.
        return format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");
    }

    /**
     * Format a log message.
     *
     * @param level Log level.
     * @param message Log message.
     * @param context Log context.
     * @param isColored Whether to apply colorized output.
     * @returns The formatted log message.
     */
    private formatMessage(level: string, message: any, context?: string, isColored = true): string {
        const timestamp = this.getTimestamp();
        const contextStr = context || this.context || "";
        const contextInfo = contextStr ? `[${contextStr}]` : "";

        // Configure colors based on log level.
        let levelStr = `[${level.toUpperCase()}]`;
        let contextDisplay = this.context ? `[${this.context}]` : "";

        if (isColored) {
            // Apply colors using the chalk library.
            switch (level) {
                case "error":
                    levelStr = chalk.red(levelStr); // Red
                    break;
                case "warn":
                    levelStr = chalk.yellow(levelStr); // Yellow
                    break;
                case "debug":
                    levelStr = chalk.cyan(levelStr); // Cyan
                    break;
                case "verbose":
                    levelStr = chalk.magenta(levelStr); // Magenta
                    break;
                default:
                    levelStr = chalk.green(levelStr); // Green
            }

            // Display the context with a blue background.
            contextDisplay = this.context
                ? this.context === "HTTP"
                    ? chalk.bgRgb(55, 78, 227).white(` ${this.context} `)
                    : chalk.rgb(55, 78, 227)(` ${this.context} `)
                : "";
        }

        return `${contextDisplay} ${timestamp} ${levelStr} ${contextInfo} ${message}`;
    }

    /**
     * Write the log message to a file.
     *
     * @param message Log message.
     */
    private writeToFile(message: string): void {
        if (!this.isFileLogEnabled) return;

        const { filePath } = this.getLogFileInfo();

        this.logFile = filePath;

        const removeAnsiCodes = (str: string) => {
            let result = "";
            let inEscSeq = false;

            for (let i = 0; i < str.length; i++) {
                const char = str[i];

                if (char === "\u001B" || char === "\u009B") {
                    inEscSeq = true;
                    continue;
                }

                if (inEscSeq) {
                    if ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z")) {
                        inEscSeq = false;
                    }
                    continue;
                }

                result += char;
            }

            return result;
        };

        const cleanMessage = removeAnsiCodes(message);

        void fse.appendFile(this.logFile, cleanMessage + "\n");
    }

    /**
     * Record a standard log entry.
     *
     * @param message Log message.
     * @param context Log context.
     */
    log(message: any, context?: string): void {
        if (!this.logLevels.includes("log")) return;

        const formattedMessage = this.formatMessage("log", message, context);
        console.log(">", formattedMessage);
        this.writeToFile(this.formatMessage("log", message, context, false));
    }

    /**
     * Record an error log entry.
     *
     * @param message Log message.
     * @param trace Error stack trace.
     * @param context Log context.
     */
    error(message: any, trace?: string, context?: string): void {
        if (!this.logLevels.includes("error")) return;

        const formattedMessage = this.formatMessage("error", message, context);
        console.error(">", formattedMessage);

        if (trace) {
            console.error(">", trace);
            this.writeToFile(this.formatMessage("error", message, context, false) + "\n" + trace);
        } else {
            this.writeToFile(this.formatMessage("error", message, context, false));
        }
    }

    /**
     * Record a warning log entry.
     *
     * @param message Log message.
     * @param context Log context.
     */
    warn(message: any, context?: string): void {
        if (!this.logLevels.includes("warn")) return;

        const formattedMessage = this.formatMessage("warn", message, context);
        console.warn(">", formattedMessage);
        this.writeToFile(this.formatMessage("warn", message, context, false));
    }

    /**
     * Record a debug log entry.
     *
     * @param message Log message.
     * @param context Log context.
     */
    debug(message: any, context?: string): void {
        if (!this.logLevels.includes("debug")) return;

        const formattedMessage = this.formatMessage("debug", message, context);
        console.debug(">", formattedMessage);
        this.writeToFile(this.formatMessage("debug", message, context, false));
    }

    /**
     * Record a verbose log entry.
     *
     * @param message Log message.
     * @param context Log context.
     */
    verbose(message: any, context?: string): void {
        if (!this.logLevels.includes("verbose")) return;

        const formattedMessage = this.formatMessage("verbose", message, context);
        console.log(">", formattedMessage);
        this.writeToFile(this.formatMessage("verbose", message, context, false));
    }

    /**
     * Set the logger context.
     *
     * @param context Log context.
     * @returns The logger service instance.
     */
    setContext(context: string): this {
        this.context = context;
        return this;
    }

    /**
     * Set the active log levels.
     *
     * @param levels Array of log levels.
     * @returns The logger service instance.
     */
    setLogLevels(levels: LogLevel[]): this {
        this.logLevels = levels;
        return this;
    }
}
