import "@buildingai/config/utils/env";

import path from "path";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

import { DataSource } from "../typeorm";

// Get extension identifier from environment variable
const identifier = process.env.EXTENSION_IDENTIFIER;
if (!identifier) {
    throw new Error("EXTENSION_IDENTIFIER environment variable is required");
}

// Calculate paths
// From packages/@buildingai/db/src/datasources -> project root (4 levels up)
const projectRoot = path.join(__dirname, "..", "..", "..", "..", "..");
const extensionDir = path.join(projectRoot, "extensions", identifier);
const extensionBuildDir = path.join(extensionDir, "build");
// From src/datasources -> @buildingai/db package root (2 levels up)
const dbPackageDir = path.join(__dirname, "..", "..");

// Entity paths (absolute paths for glob)
const extensionEntitiesPath = path
    .join(extensionBuildDir, "db", "entities", "*.entity.js")
    .replace(/\\/g, "/");

const mainEntitiesPath = path
    .join(dbPackageDir, "dist", "entities", "**", "*.entity.js")
    .replace(/\\/g, "/");

// Migration path (relative to this file)
const extensionMigrationsDir = path.join(extensionDir, "src", "api", "db", "migrations");
const migrationsRelativePath = path.relative(__dirname, extensionMigrationsDir).replace(/\\/g, "/");

export const ExtensionDataSource = new DataSource({
    type: (process.env.DB_TYPE || "postgres") as "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "buildingai",
    namingStrategy: new SnakeNamingStrategy(),
    // Don't limit schema here, let TypeORM see all tables for relations
    entities: [extensionEntitiesPath, mainEntitiesPath],
    migrations: [`${migrationsRelativePath}/*.ts`],
    synchronize: false,
    logging: true,
});
