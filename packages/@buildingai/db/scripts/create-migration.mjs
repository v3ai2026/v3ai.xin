#!/usr/bin/env node

/**
 * Create a new migration file
 *
 * Usage:
 *   pnpm migration:create <version> <description>
 *
 * Example:
 *   pnpm migration:create 25.0.1 add-extension-identifier
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get arguments
const args = process.argv.slice(2);
const version = args[0];
const description = args[1];

// Validate arguments
if (!version || !description) {
    console.error("❌ Error: Missing required arguments");
    console.log("");
    console.log("Usage:");
    console.log("  pnpm migration:create <version> <description>");
    console.log("");
    console.log("Example:");
    console.log("  pnpm migration:create 25.0.1 add-extension-identifier");
    process.exit(1);
}

// Validate version format (semver)
const semverRegex = /^\d+\.\d+\.\d+$/;
if (!semverRegex.test(version)) {
    console.error("❌ Error: Invalid version format. Must be semver (e.g., 25.0.1)");
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
const filename = `${version}-${timestamp}-${description}.ts`;

// Migration file template
const template = `import { DataSource } from "typeorm";

/**
 * Migration: ${description}
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
    //     ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
    // \`);
}

/**
 * Revert migration (optional)
 */
export async function down(dataSource: DataSource): Promise<void> {
    // Add your rollback logic here (optional)
    // Example:
    // await dataSource.query(\`
    //     ALTER TABLE users DROP COLUMN new_field;
    // \`);
}
`;

// Determine migrations directory
const migrationsDir = path.join(__dirname, "../src/migrations");

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
console.log("");
console.log("Next steps:");
console.log("1. Edit the migration file and add your migration logic");
console.log("2. Build the package: pnpm build");
console.log("3. Restart the application to run the migration");
