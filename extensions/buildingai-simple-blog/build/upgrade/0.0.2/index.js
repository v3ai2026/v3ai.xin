'use strict';

var common = require('@nestjs/common');

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
class Upgrade {
  static {
    __name(this, "Upgrade");
  }
  dataSource;
  logger = new common.Logger(Upgrade.name);
  constructor(dataSource) {
    this.dataSource = dataSource;
  }
  /**
   * Execute upgrade logic
   */
  async execute() {
    this.logger.log("Starting upgrade to version 0.0.2");
    await this.queryUserData();
    this.logger.log("Upgrade to version 0.0.2 completed");
  }
  /**
   * Example: Query user table data
   */
  async queryUserData() {
    this.logger.log("Querying user table data...");
    const users = await this.dataSource.query(`
            SELECT id, username, nickname, email, created_at 
            FROM "user" 
            LIMIT 10
        `);
    console.log(`Found ${users.length} users`);
    users.forEach((user) => {
      console.log(`User: ${user.username} (${user.nickname})`);
    });
    console.log("User data query completed");
  }
}

exports.Upgrade = Upgrade;
