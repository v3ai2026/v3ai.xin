import { Injectable, Logger } from "@nestjs/common";
import pm2 from "pm2";

type BdProcessStatus =
    | "online"
    | "stopping"
    | "stopped"
    | "launching"
    | "errored"
    | "one-launch-status"
    | "waiting_restart";

/**
 * PM2 process information (simplified from official ProcessDescription)
 */
export interface Pm2ProcessInfo {
    name: string;
    pid: number;
    status: BdProcessStatus;
    cpu: number;
    memory: number;
    uptime: number;
    restarts: number;
}

/**
 * Simplified PM2 list item for API response
 */
export interface Pm2ListItem {
    pid: number;
    name: string;
    pm_id: number;
    monit: {
        memory: number;
        cpu: number;
    };
    uptime: string;
    status: BdProcessStatus;
}

/**
 * PM2 operation result
 */
export interface Pm2OperationResult<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

/**
 * PM2 Service
 * Provides unified PM2 process management functionality
 */
@Injectable()
export class Pm2Service {
    private readonly logger = new Logger(Pm2Service.name);
    private readonly pm2AppName: string;
    private isConnected = false;

    constructor() {
        this.pm2AppName = process.env.PM2_APP_NAME || "buildingai-api";
    }

    /**
     * Connect to PM2 daemon
     */
    private async connect(): Promise<void> {
        if (this.isConnected) return;

        return new Promise((resolve, reject) => {
            pm2.connect((err) => {
                if (err) {
                    this.logger.error("Failed to connect to PM2", err);
                    reject(err);
                } else {
                    this.isConnected = true;
                    resolve();
                }
            });
        });
    }

    /**
     * Disconnect from PM2 daemon
     */
    private disconnect(): void {
        if (this.isConnected) {
            pm2.disconnect();
            this.isConnected = false;
        }
    }

    /**
     * Get process list from PM2
     */
    private async getProcessList(): Promise<pm2.ProcessDescription[]> {
        return new Promise((resolve, reject) => {
            pm2.list((err, list) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(list);
                }
            });
        });
    }

    /**
     * Check if PM2 is available
     */
    isPm2Available(): boolean {
        return true; // PM2 is installed as a dependency
    }

    /**
     * Execute PM2 operation with proper connection handling
     */
    private async executePm2Operation<T>(
        operation: () => Promise<T>,
    ): Promise<Pm2OperationResult<T>> {
        try {
            await this.connect();
            const result = await operation();
            this.disconnect();
            return {
                success: true,
                data: result,
            };
        } catch (error) {
            this.disconnect();
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error(`PM2 operation failed: ${errorMessage}`);
            return {
                success: false,
                message: errorMessage,
            };
        }
    }

    /**
     * Restart PM2 process
     * @param appName Optional app name, uses default if not provided
     */
    async restart(appName?: string): Promise<Pm2OperationResult> {
        const targetApp = appName || this.pm2AppName;
        this.logger.log(`Restarting PM2 process: ${targetApp}`);

        return this.executePm2Operation(async () => {
            return new Promise<pm2.Proc>((resolve, reject) => {
                pm2.restart(targetApp, (err, proc) => {
                    if (err) reject(err);
                    else {
                        this.logger.log(`PM2 process restarted successfully: ${targetApp}`);
                        resolve(proc);
                    }
                });
            });
        });
    }

    /**
     * Reload PM2 process (zero downtime)
     * @param appName Optional app name, uses default if not provided
     */
    async reload(appName?: string): Promise<Pm2OperationResult> {
        const targetApp = appName || this.pm2AppName;
        this.logger.log(`Reloading PM2 process: ${targetApp}`);

        return this.executePm2Operation(async () => {
            return new Promise<pm2.Proc>((resolve, reject) => {
                pm2.reload(targetApp, (err, proc) => {
                    if (err) reject(err);
                    else {
                        this.logger.log(`PM2 process reloaded successfully: ${targetApp}`);
                        resolve(proc);
                    }
                });
            });
        });
    }

    /**
     * Stop PM2 process
     * @param appName Optional app name, uses default if not provided
     */
    async stop(appName?: string): Promise<Pm2OperationResult> {
        const targetApp = appName || this.pm2AppName;
        this.logger.log(`Stopping PM2 process: ${targetApp}`);

        return this.executePm2Operation(async () => {
            return new Promise<pm2.Proc>((resolve, reject) => {
                pm2.stop(targetApp, (err, proc) => {
                    if (err) reject(err);
                    else {
                        this.logger.log(`PM2 process stopped successfully: ${targetApp}`);
                        resolve(proc);
                    }
                });
            });
        });
    }

    /**
     * Start PM2 process with config
     * @param configPath PM2 config file path
     */
    async start(configPath: string): Promise<Pm2OperationResult> {
        this.logger.log(`Starting PM2 process with config: ${configPath}`);

        return this.executePm2Operation(async () => {
            return new Promise<pm2.Proc>((resolve, reject) => {
                pm2.start(configPath, (err, proc) => {
                    if (err) reject(err);
                    else {
                        this.logger.log("PM2 process started successfully");
                        resolve(proc);
                    }
                });
            });
        });
    }

    /**
     * Delete PM2 process
     * @param appName Optional app name, uses default if not provided
     */
    async delete(appName?: string): Promise<Pm2OperationResult> {
        const targetApp = appName || this.pm2AppName;
        this.logger.log(`Deleting PM2 process: ${targetApp}`);

        return this.executePm2Operation(async () => {
            return new Promise<pm2.Proc>((resolve, reject) => {
                pm2.delete(targetApp, (err, proc) => {
                    if (err) reject(err);
                    else {
                        this.logger.log(`PM2 process deleted successfully: ${targetApp}`);
                        resolve(proc);
                    }
                });
            });
        });
    }

    /**
     * Get PM2 process list
     */
    async list(): Promise<Pm2OperationResult<Pm2ListItem[]>> {
        return this.executePm2Operation(async () => {
            const processList = await this.getProcessList();
            return processList.map((proc) => ({
                pid: proc.pid || 0,
                name: proc.name || "",
                pm_id: proc.pm_id || 0,
                status: proc.pm2_env?.status,
                monit: {
                    cpu: proc.monit?.cpu || 0,
                    memory: proc.monit?.memory || 0,
                },
                restarts: proc.pm2_env?.restart_time || 0,
                uptime: proc.pm2_env?.pm_uptime
                    ? `${Math.floor((Date.now() - proc.pm2_env.pm_uptime) / 1000)}s`
                    : "0s",
            }));
        });
    }

    /**
     * Get specific PM2 process info
     * @param appName Optional app name, uses default if not provided
     */
    async getProcessInfo(appName?: string): Promise<Pm2OperationResult<Pm2ProcessInfo>> {
        const targetApp = appName || this.pm2AppName;

        return this.executePm2Operation(async () => {
            const processList = await this.getProcessList();
            const process = processList.find((p) => p.name === targetApp);

            if (!process) {
                throw new Error(`Process not found: ${targetApp}`);
            }

            return {
                name: process.name || "",
                pid: process.pid || 0,
                status: process.pm2_env?.status,
                cpu: process.monit?.cpu || 0,
                memory: process.monit?.memory || 0,
                uptime: process.pm2_env?.pm_uptime ? Date.now() - process.pm2_env.pm_uptime : 0,
                restarts: process.pm2_env?.restart_time || 0,
            };
        });
    }

    /**
     * Check if PM2 process is running
     * @param appName Optional app name, uses default if not provided
     */
    async isProcessRunning(appName?: string): Promise<boolean> {
        const result = await this.getProcessInfo(appName);
        return result.success && result.data?.status === "online";
    }

    /**
     * Get PM2 logs (returns log file paths)
     * @param lines Number of lines to retrieve (not used with API, kept for compatibility)
     * @param appName Optional app name, uses default if not provided
     */
    async getLogs(appName?: string): Promise<Pm2OperationResult> {
        const targetApp = appName || this.pm2AppName;

        return this.executePm2Operation(async () => {
            return new Promise<pm2.ProcessDescription[]>((resolve, reject) => {
                pm2.describe(targetApp, (err, processDescriptionList) => {
                    if (err) reject(err);
                    else resolve(processDescriptionList);
                });
            }).then((processList) => {
                if (processList.length === 0) {
                    throw new Error(`Process not found: ${targetApp}`);
                }
                const proc = processList[0];
                return {
                    outLogPath: proc.pm2_env?.pm_out_log_path,
                    errLogPath: proc.pm2_env?.pm_err_log_path,
                };
            });
        });
    }

    /**
     * Flush PM2 logs
     */
    async flushLogs(): Promise<Pm2OperationResult> {
        this.logger.log("Flushing PM2 logs");

        return this.executePm2Operation(async () => {
            return new Promise<any>((resolve, reject) => {
                pm2.flush(this.pm2AppName, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        });
    }

    /**
     * Save PM2 process list
     */
    async save(): Promise<Pm2OperationResult> {
        this.logger.log("Saving PM2 process list");

        return this.executePm2Operation(async () => {
            return new Promise<any>((resolve, reject) => {
                pm2.dump((err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        });
    }

    /**
     * Get PM2 health status
     */
    async getHealthStatus(): Promise<Pm2OperationResult> {
        if (!this.isPm2Available()) {
            return {
                success: false,
                message: "PM2 is not available",
            };
        }

        const processInfo = await this.getProcessInfo();

        if (!processInfo.success) {
            return {
                success: false,
                message: "Failed to get process information",
            };
        }

        const isHealthy = processInfo.data?.status === "online";

        return {
            success: true,
            data: {
                healthy: isHealthy,
                process: processInfo.data,
            },
        };
    }
}
