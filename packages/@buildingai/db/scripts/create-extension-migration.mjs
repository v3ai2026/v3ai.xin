#!/usr/bin/env node

/**
 * Create a new migration file manually for extension
 *
 * Usage:
 *   pnpm migration:create:extension <identifier> <version> <description>
 *
 * Example:
 *   pnpm migration:create:extension buildingai-simple-blog 0.0.3 add-custom-logic
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get arguments
const args = process.argv.slice(2);
const identifier = args[0];
const version = args[1];
const description = args[2];

// Validate arguments
if (!identifier || !version || !description) {
    console.error("❌ Error: Missing required arguments");
    console.log("");
    console.log("Usage:");
    console.log("  pnpm migration:create:extension <identifier> <version> <description>");
    console.log("");
    console.log("Example:");
    console.log("  pnpm migration:create:extension buildingai-simple-blog 0.0.3 add-custom-logic");
    process.exit(1);
}

// Validate version format (semver)
const semverRegex = /^\d+\.\d+\.\d+$/;
if (!semverRegex.test(version)) {
    console.error("❌ Error: Invalid version format. Must be semver (e.g., 0.0.3)");
    process.exit(1);
}

// Validate description (kebab-case)
const descriptionRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
if (!descriptionRegex.test(description)) {
    console.error("❌ Error: Invalid description format. Must be kebab-case (e.g., add-new-field)");
    process.exit(1);
}

// Generate timestamp
const timestamp = Date.now();

// Generate filename
const filename = `${timestamp}-${version}-${description}.ts`;

// Generate schema name from identifier
const schemaName = identifier.replace(/[^a-zA-Z0-9_]/g, "_");

// Migration file template
const template = `import { DataSource } from "typeorm";

/**
 * Extension Migration: ${description}
 * Extension: ${identifier}
 * Version: ${version}
 * Created: ${new Date().toISOString()}
 */

/**
 * Run migration
 */
export async function up(dataSource: DataSource): Promise<void> {
    // Add your migration logic here
    // Example:
    // await dataSource.query(\`
    //     ALTER TABLE "${schemaName}"."article" 
    //     ADD COLUMN "new_field" VARCHAR(255);
    // \`);
}

/**
 * Revert migration (optional)
 */
export async function down(dataSource: DataSource): Promise<void> {
    // Add your rollback logic here (optional)
    // Example:
    // await dataSource.query(\`
    //     ALTER TABLE "${schemaName}"."article" 
    //     DROP COLUMN "new_field";
    // \`);
}
`;

// Determine extension migrations directory
// From packages/@buildingai/db/scripts -> project root (4 levels up)
const projectRoot = path.join(__dirname, "..", "..", "..", "..");
const extensionDir = path.join(projectRoot, "extensions", identifier);
const migrationsDir = path.join(extensionDir, "src", "api", "db", "migrations");

// Check if extension exists
if (!(await fs.pathExists(extensionDir))) {
    console.error(`❌ Error: Extension not found: ${identifier}`);
    console.error(`   Path: ${extensionDir}`);
    process.exit(1);
}

// Ensure migrations directory exists
await fs.ensureDir(migrationsDir);

// Full file path
const filePath = path.join(migrationsDir, filename);

// Check if file already exists
if (await fs.pathExists(filePath)) {
    console.error(`❌ Error: Migration file already exists: ${filename}`);
    process.exit(1);
}

// Write migration file
await fs.writeFile(filePath, template);

console.log("✅ Migration file created successfully!");
console.log("");
console.log("📄 File:", filename);
console.log("📁 Path:", filePath);
console.log("🔢 Version:", version);
console.log("📝 Description:", description);
console.log("🔌 Extension:", identifier);
console.log("");
console.log("Next steps:");
console.log("1. Edit the migration file and add your migration logic");
console.log(`2. Build the extension: pnpm --filter ${identifier} build:api`);
console.log("3. Restart the application to run the migration");
