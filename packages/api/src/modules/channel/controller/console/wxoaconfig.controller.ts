import { BaseController } from "@buildingai/base";
import { Permissions } from "@common/decorators";
import { ConsoleController } from "@common/decorators/controller.decorator";
import { UpdateWxOaConfigDto } from "@modules/channel/dto/updatewx.dto";
import { WxOaConfigService } from "@modules/channel/services/wxoaconfig.service";
import { Body, Get, Patch } from "@nestjs/common";
@ConsoleController("wxoaconfig", "公众号配置")
export class WxOaConfigConsoleController extends BaseController {
    constructor(private readonly wxoaconfigService: WxOaConfigService) {
        super();
    }
    /**
     * 获取公众号配置
     * @returns 公众号配置
     */
    @Get()
    @Permissions({
        code: "get-config",
        name: "获取公众号配置",
    })
    getConfig() {
        return this.wxoaconfigService.getConfig();
    }
    /**
     * 更新公众号配置
     * @param updateWxOaConfigDto 更新配置DTO
     * @returns 更新后的配置
     */
    @Patch()
    @Permissions({
        code: "update-config",
        name: "更新公众号配置",
    })
    update(@Body() updateWxOaConfigDto: UpdateWxOaConfigDto) {
        return this.wxoaconfigService.updateConfig(updateWxOaConfigDto);
    }
}
