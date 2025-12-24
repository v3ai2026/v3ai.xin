import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { type Queue } from "bullmq";

/**
 * Queue service
 *
 * Provides task queue management and operation functionality
 */
@Injectable()
export class QueueService {
    private readonly logger = new Logger(QueueService.name);

    constructor(
        @InjectQueue("default") private defaultQueue: Queue,
        @InjectQueue("email") private emailQueue: Queue,
        @InjectQueue("vectorization") private vectorizationQueue: Queue,
    ) {}

    /**
     * Add task to specified queue
     * @param queueName Queue name
     * @param name Task name
     * @param data Task data
     * @param options Task options
     */
    async addToQueue(queueName: string, name: string, data: any, options?: any) {
        try {
            const queue = this.getQueueByName(queueName);
            const job = await queue.add(name, data, options);
            this.logger.log(`Job added to ${queueName} queue: ${job.id}`);
            return job;
        } catch (error) {
            this.logger.error(
                `Failed to add job to ${queueName} queue: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    /**
     * Add task to default queue
     * @param name Task name
     * @param data Task data
     * @param options Task options
     */
    async addToDefaultQueue(name: string, data: any, options?: any) {
        return this.addToQueue("default", name, data, options);
    }

    /**
     * Add task to email queue
     * @param name Task name
     * @param data Task data
     * @param options Task options
     */
    async addToEmailQueue(name: string, data: any, options?: any) {
        return this.addToQueue("email", name, data, options);
    }

    /**
     * Get all jobs from specified queue
     * @param queueName Queue name
     */
    async getQueueJobs(queueName: string) {
        try {
            const queue = this.getQueueByName(queueName);
            const [waiting, active, completed, failed] = await Promise.all([
                queue.getWaiting(),
                queue.getActive(),
                queue.getCompleted(),
                queue.getFailed(),
            ]);

            return {
                waiting: waiting.map((job) => this.formatJob(job)),
                active: active.map((job) => this.formatJob(job)),
                completed: completed.map((job) => this.formatJob(job)),
                failed: failed.map((job) => this.formatJob(job)),
            };
        } catch (error) {
            this.logger.error(
                `Failed to retrieve jobs from ${queueName} queue: ${error.message}`,
                error.stack,
            );
            throw error;
        }
    }

    /**
     * Get all jobs from default queue
     */
    async getDefaultQueueJobs() {
        return this.getQueueJobs("default");
    }

    /**
     * Get all jobs from email queue
     */
    async getEmailQueueJobs() {
        return this.getQueueJobs("email");
    }

    /**
     * Get job details from specified queue
     * @param queueName Queue name
     * @param jobId Job ID
     */
    async getJobById(queueName: string, jobId: string) {
        try {
            const queue = this.getQueueByName(queueName);
            const job = await queue.getJob(jobId);
            return job ? this.formatJob(job) : null;
        } catch (error) {
            this.logger.error(`Failed to get job details: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Remove job from specified queue
     * @param queueName Queue name
     * @param jobId Job ID
     */
    async removeJob(queueName: string, jobId: string) {
        try {
            const queue = this.getQueueByName(queueName);
            const job = await queue.getJob(jobId);
            if (!job) return false;

            await job.remove();
            this.logger.log(`Job removed: ${queueName}/${jobId}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to remove job: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Retry failed job from specified queue
     * @param queueName Queue name
     * @param jobId Job ID
     */
    async retryJob(queueName: string, jobId: string) {
        try {
            const queue = this.getQueueByName(queueName);
            const job = await queue.getJob(jobId);
            if (!job) return false;

            await job.retry();
            this.logger.log(`Job retried: ${queueName}/${jobId}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to retry job: ${error.message}`, error.stack);
            throw error;
        }
    }

    /**
     * Get queue instance by name
     * @param queueName Queue name
     */
    private getQueueByName(queueName: string): Queue {
        switch (queueName) {
            case "default":
                return this.defaultQueue;
            case "email":
                return this.emailQueue;
            case "vectorization":
                return this.vectorizationQueue;
            default:
                throw new Error(`Unknown queue name: ${queueName}`);
        }
    }

    /**
     * Format job information
     * @param job Job object
     */
    private formatJob(job: any) {
        return {
            id: job.id,
            name: job.name,
            data: job.data,
            opts: job.opts,
            progress: job.progress,
            attemptsMade: job.attemptsMade,
            finishedOn: job.finishedOn,
            processedOn: job.processedOn,
            timestamp: job.timestamp,
            stacktrace: job.stacktrace,
            returnvalue: job.returnvalue,
            failedReason: job.failedReason,
        };
    }
}
