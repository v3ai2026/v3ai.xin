import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { QueueService } from "./queue.service";

/**
 * Queue module
 *
 * Core queue functionality based on Bull
 * Provides basic queue infrastructure without business logic
 */
@Module({
    imports: [
        // Register Bull module with Redis backend
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async () => ({
                connection: {
                    host: process.env.REDIS_HOST || "localhost",
                    port: Number(process.env.REDIS_PORT) || 6379,
                    password: process.env.REDIS_PASSWORD || "",
                    db: Number(process.env.REDIS_DB) || 0,
                },
                defaultJobOptions: {
                    attempts: 3,
                    removeOnComplete: true,
                    removeOnFail: false,
                },
            }),
            inject: [ConfigService],
        }),
        // Register queues
        BullModule.registerQueue({ name: "default" }, { name: "email" }, { name: "vectorization" }),
    ],
    providers: [QueueService],
    exports: [QueueService, BullModule],
})
export class QueueModule {}
