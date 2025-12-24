import { BaseController } from "@buildingai/base";
import { BuildFileUrl } from "@buildingai/decorators/file-url.decorator";
import { ConsoleController } from "@common/decorators/controller.decorator";
import { Permissions } from "@common/decorators/permissions.decorator";
import { QueryAccountLogDto } from "@modules/finance/dto/query-account-log.dto";
import { FinanceService } from "@modules/finance/services/finance.service";
import { Get, Query } from "@nestjs/common";

@ConsoleController("finance", "财务")
export class FinanceController extends BaseController {
    constructor(private readonly financeService: FinanceService) {
        super();
    }
    @Get("center")
    @Permissions({
        code: "center",
        name: "财务中心",
        description: "财务中心",
    })
    async center() {
        return this.financeService.center();
    }

    @Get("account-log")
    @Permissions({
        code: "account-log",
        name: "用户账户日志列表",
        description: "用户账户日志列表",
    })
    @BuildFileUrl(["**.avatar"])
    async lists(@Query() queryAccountLogDto: QueryAccountLogDto) {
        return this.financeService.accountLogLists(queryAccountLogDto);
    }
}
