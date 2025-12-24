import { BaseController } from "@buildingai/base";
import { ConsoleController } from "@common/decorators/controller.decorator";
import { Permissions } from "@common/decorators/permissions.decorator";
import { Body, Get, Post } from "@nestjs/common";

import { AgentDecorateDto } from "../../dto/agent-decorate.dto";
import { AgentDecorateService } from "../../services/agent-decorate.service";

@ConsoleController("agent-decorate", "Agent 装饰内容")
export class AgentDecorateConsoleController extends BaseController {
    constructor(private readonly agentDecorateService: AgentDecorateService) {
        super();
    }

    @Get()
    @Permissions({ code: "get", name: "获取装饰内容", description: "获取 agent 装饰内容" })
    async get() {
        return await this.agentDecorateService.getConfig();
    }

    @Post()
    @Permissions({ code: "set", name: "设置装饰内容", description: "设置 agent 装饰内容" })
    async set(@Body() dto: AgentDecorateDto) {
        return await this.agentDecorateService.setConfig(dto);
    }
}
