import "@buildingai/config/utils/env";

import { globSync } from "glob";
import path from "path";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { DataSource } from "./../typeorm";

const distDir = __dirname.replace("/src", "/dist");
const entitiesPattern = path.join(distDir, "..", "entities", "**", "*.entity.js");
const entityFiles = globSync(entitiesPattern);

export const AppDataSource = new DataSource({
    type: process.env.DB_TYPE as "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "buildingai",
    logging: true,
    namingStrategy: new SnakeNamingStrategy(),
    migrations: [path.join(distDir, "migrations", "**", "*.js")],
    entities: entityFiles,
    synchronize: false,
    migrationsTableName: "migrations_history",
});
