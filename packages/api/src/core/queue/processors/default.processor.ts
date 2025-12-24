import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";

/**
 * 默认队列处理器（BullMQ版）
 */
@Processor("default")
export class DefaultProcessor extends WorkerHost {
    private readonly logger = new Logger(DefaultProcessor.name);

    /**
     * 处理任务的主入口
     * BullMQ中，不再用 @Process，而是重写 process 方法
     */
    async process(job: Job): Promise<any> {
        this.logger.log(`开始处理任务: ${job.name} (ID: ${job.id})`);
        this.logger.debug(`任务数据: ${JSON.stringify(job.data)}`);

        try {
            switch (job.name) {
                case "generic":
                    return await this.handleGenericJob(job);
                case "import":
                    return await this.handleImportJob(job);
                default:
                    this.logger.warn(`未识别的任务类型: ${job.name}`);
                    return { success: false, reason: "Unknown job type" };
            }
        } catch (error) {
            this.logger.error(`任务处理失败: ${error.message}`, error.stack);
            throw error;
        }
    }

    private async handleGenericJob(job: Job<any>) {
        this.logger.log(`开始处理通用任务: ${job.id}`);
        await this.simulateProcessing(job.data.duration || 1000);
        await job.updateProgress(100);
        this.logger.log(`通用任务处理完成: ${job.id}`);

        return { success: true, processedAt: new Date() };
    }

    private async handleImportJob(job: Job<any>) {
        this.logger.log(`开始处理数据导入任务: ${job.id}`);
        const { items, options } = job.data;
        const totalItems = items?.length || 10;

        for (let i = 0; i < totalItems; i++) {
            await job.updateProgress(Math.floor((i / totalItems) * 100));
            await this.simulateProcessing(100);
            this.logger.debug(`已处理项目 ${i + 1}/${totalItems}`);
        }

        await job.updateProgress(100);
        this.logger.log(`数据导入任务处理完成: ${job.id}`);

        return {
            success: true,
            processedItems: totalItems,
            processedAt: new Date(),
            options,
        };
    }

    private async simulateProcessing(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * 可选：监听 Worker 事件（如完成、失败等）
     */
    @OnWorkerEvent("completed")
    onCompleted(job: Job) {
        this.logger.log(`任务完成: ${job.name} (${job.id})`);
    }

    @OnWorkerEvent("failed")
    onFailed(job: Job, err: Error) {
        this.logger.error(`任务失败: ${job.name} (${job.id}) -> ${err.message}`);
    }
}
