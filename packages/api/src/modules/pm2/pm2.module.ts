import { Module } from "@nestjs/common";

import { Pm2Controller } from "./controllers/console/pm2.controller";
import { Pm2Service } from "./services/pm2.service";

/**
 * PM2 Management Module
 * Provides PM2 process management functionality
 */
@Module({
    controllers: [Pm2Controller],
    providers: [Pm2Service],
    exports: [Pm2Service],
})
export class Pm2Module {}
