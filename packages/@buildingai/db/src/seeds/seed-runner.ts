import { TerminalLogger } from "@buildingai/logger";

import { DataSource } from "../typeorm";
import { BaseSeeder } from "./seeders/base.seeder";

/**
 * Seed runner
 *
 * Responsible for managing and executing all seeders
 */
export class SeedRunner {
    constructor(private readonly dataSource: DataSource) {}

    /**
     * Execute a batch of seeders
     *
     * @param seeders Seeder instances array
     */
    async run(seeders: BaseSeeder[]): Promise<void> {
        // Sort by priority
        const sortedSeeders = this.sortByPriority(seeders);

        TerminalLogger.log("SeedRunner", `Preparing to execute ${sortedSeeders.length} seeders`);

        for (const seeder of sortedSeeders) {
            try {
                // Verify whether the seeder should run
                const shouldRun = await seeder.shouldRun(this.dataSource);
                if (!shouldRun) {
                    TerminalLogger.info(
                        "SeedRunner",
                        `Skipping ${seeder.name} (conditions not met)`,
                    );
                    continue;
                }

                TerminalLogger.log("SeedRunner", `Starting seeder: ${seeder.name}`);
                const startTime = Date.now();

                await seeder.run(this.dataSource);

                const duration = Date.now() - startTime;
                TerminalLogger.success(
                    "SeedRunner",
                    `${seeder.name} completed (duration: ${duration}ms)`,
                );
            } catch (error) {
                TerminalLogger.error("SeedRunner", `${seeder.name} failed: ${error.message}`);
                throw error;
            }
        }

        TerminalLogger.success("SeedRunner", "All seeders completed");
    }

    /**
     * Sort seeders by priority
     *
     * @param seeders Seeder instances array
     * @returns Sorted seeder collection
     */
    private sortByPriority(seeders: BaseSeeder[]): BaseSeeder[] {
        return [...seeders].sort((a, b) => a.priority - b.priority);
    }

    /**
     * Execute a single seeder
     *
     * @param seeder Seeder instance
     */
    async runOne(seeder: BaseSeeder): Promise<void> {
        await this.run([seeder]);
    }
}
