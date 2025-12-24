# @buildingai/upgrade

Version upgrade scripts package for BuildingAI.

## Overview

This package contains version-specific upgrade scripts that handle complex business logic during
system upgrades.

## Structure

```
src/
├── index.ts           # Package exports and base classes
└── scripts/           # Version-specific upgrade scripts
    ├── 1.0.0.ts      # Example: Upgrade script for version 1.0.0
    ├── 1.1.0.ts      # Example: Upgrade script for version 1.1.0
    └── ...
```

## Creating an Upgrade Script

### 1. Create a new script file

Create a file in `src/scripts/` named after the version (e.g., `1.2.0.ts`):

```typescript
import { BaseUpgradeScript, UpgradeContext } from "../index";

/**
 * Upgrade script for version 1.2.0
 */
export class Upgrade extends BaseUpgradeScript {
    readonly version = "1.2.0";

    async execute(context: UpgradeContext): Promise<void> {
        this.log("Starting upgrade to version 1.2.0");

        try {
            // Access database connection
            const { dataSource } = context;

            // Example: Run custom SQL
            await dataSource.query(`
                -- Your SQL here
            `);

            // Example: Update data
            await this.updateMenus(context);

            this.success("Upgrade completed");
        } catch (error) {
            this.error("Upgrade failed", error);
            throw error;
        }
    }

    private async updateMenus(context: UpgradeContext): Promise<void> {
        // Custom logic here
        this.log("Updating menus...");
    }
}

// Export as default
export default Upgrade;
```

### 2. Build the package

```bash
pnpm build
```

### 3. The upgrade will run automatically

When the system detects a version mismatch, it will:

1. Run database migrations from `@buildingai/db/migrations`
2. Execute the upgrade script from this package
3. Mark the version as upgraded

## Upgrade Context

The `UpgradeContext` provides access to:

- `dataSource`: TypeORM DataSource for database operations
- Additional services can be added as needed

### Database Operations

The `dataSource` in `UpgradeContext` is a TypeORM DataSource instance that provides:

#### 1. Execute Raw SQL

```typescript
// Simple query
await context.dataSource.query("SELECT * FROM users WHERE id = $1", [userId]);

// DDL operations
await context.dataSource.query(`
    ALTER TABLE users ADD COLUMN new_field VARCHAR(255)
`);

// Batch updates
await context.dataSource.query(`
    UPDATE users SET status = 'active' WHERE last_login > NOW() - INTERVAL '30 days'
`);
```

#### 2. Use Repository Pattern

```typescript
// Get repository
const userRepository = context.dataSource.getRepository("User");

// Find records
const users = await userRepository.find({ where: { status: "active" } });

// Update records
await userRepository.update({ status: "inactive" }, { status: "archived" });

// Save new records
await userRepository.save({ name: "New User", email: "user@example.com" });
```

#### 3. Use Query Builder

```typescript
const userRepository = context.dataSource.getRepository("User");

const result = await userRepository
    .createQueryBuilder("user")
    .where("user.created_at > :date", { date: new Date("2024-01-01") })
    .andWhere("user.status = :status", { status: "active" })
    .orderBy("user.created_at", "DESC")
    .getMany();
```

#### 4. Use Transactions

```typescript
const queryRunner = context.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

try {
    // Execute multiple operations
    await queryRunner.query("UPDATE table1 SET ...");
    await queryRunner.query("INSERT INTO table2 ...");

    // Commit if all succeed
    await queryRunner.commitTransaction();
} catch (error) {
    // Rollback on error
    await queryRunner.rollbackTransaction();
    throw error;
} finally {
    await queryRunner.release();
}
```

#### 5. Use Entity Manager

```typescript
const manager = context.dataSource.manager;

// Save entity
await manager.save(User, { name: "John", email: "john@example.com" });

// Find with relations
const user = await manager.findOne(User, {
    where: { id: 1 },
    relations: ["posts", "comments"],
});
```

## Best Practices

1. **Idempotent**: Scripts should be safe to run multiple times
2. **Error Handling**: Always wrap operations in try-catch
3. **Logging**: Use `this.log()`, `this.error()`, `this.success()` for consistent logging
4. **Testing**: Test upgrade scripts thoroughly before deployment
5. **Documentation**: Document what each script does

## Example: Menu Upgrade

```typescript
import { BaseUpgradeScript, UpgradeContext } from "../index";
import * as path from "path";
import * as fs from "fs-extra";

export class Upgrade extends BaseUpgradeScript {
    readonly version = "1.2.0";

    async execute(context: UpgradeContext): Promise<void> {
        this.log("Upgrading menus");

        // Read menu configuration
        const menuPath = path.join(process.cwd(), "data/upgrade/1.2.0/menu.json");
        if (await fs.pathExists(menuPath)) {
            const menus = await fs.readJson(menuPath);
            await this.importMenus(context.dataSource, menus);
        }

        this.success("Menu upgrade completed");
    }

    private async importMenus(dataSource: any, menus: any[]): Promise<void> {
        // Import logic here
    }
}

export default Upgrade;
```

## Notes

- Upgrade scripts are executed in version order (using semver)
- Each script is only executed once per version
- Failed upgrades will prevent the system from starting
