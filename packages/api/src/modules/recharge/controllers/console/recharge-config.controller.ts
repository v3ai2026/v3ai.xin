import { BaseController } from "@buildingai/base";
import { ConsoleController } from "@common/decorators/controller.decorator";
import { Permissions } from "@common/decorators/permissions.decorator";
import { UpdateRechargeConfigDto } from "@modules/recharge/dto/update-recharge-config.dto";
import { RechargeConfigService } from "@modules/recharge/services/recharge-config.service";
import { Body, Get, Post } from "@nestjs/common";
@ConsoleController("recharge-config", "充值配置")
export class RechargeConfigController extends BaseController {
    constructor(private readonly rechargeConfigService: RechargeConfigService) {
        super();
    }

    @Get()
    @Permissions({
        code: "getConfig",
        name: "获取充值配置",
        description: "获取充值配置",
    })
    async getConfig() {
        return await this.rechargeConfigService.getConfig();
    }

    @Post()
    @Permissions({
        code: "setConfig",
        name: "设置充值配置",
        description: "设置充值配置",
    })
    async setConfig(@Body() updateRechargeConfigDto: UpdateRechargeConfigDto) {
        return await this.rechargeConfigService.setConfig(updateRechargeConfigDto);
    }
}
