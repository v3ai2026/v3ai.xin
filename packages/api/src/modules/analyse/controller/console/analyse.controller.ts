import { BaseController } from "@buildingai/base";
import { BuildFileUrl } from "@buildingai/decorators/file-url.decorator";
import { ConsoleController } from "@common/decorators/controller.decorator";
import { Permissions } from "@common/decorators/permissions.decorator";
import { Get, Query } from "@nestjs/common";

import { DashboardService } from "../../services/dashboard.service";

/**
 * 数据分析控制器（控制台）
 *
 * 提供后台工作台数据看板相关的 API 接口
 */
@ConsoleController("analyse", "数据分析")
export class AnalyseConsoleController extends BaseController {
    /**
     * 构造函数
     *
     * @param dashboardService 数据看板服务
     */
    constructor(private readonly dashboardService: DashboardService) {
        super();
    }

    /**
     * 获取数据看板统计信息
     *
     * @param userDays 用户图表时间范围（天数）
     * @param revenueDays 收入图表时间范围（天数）
     * @param tokenDays Token使用排行时间范围（天数）
     * @returns 数据看板统计信息
     */
    @Get("dashboard")
    @BuildFileUrl(["**.iconUrl"])
    @Permissions({
        code: "dashboard",
        name: "数据看板",
        description: "获取数据看板统计信息",
    })
    async getDashboard(
        @Query("userDays") userDays?: string,
        @Query("revenueDays") revenueDays?: string,
        @Query("tokenDays") tokenDays?: string,
    ) {
        return this.dashboardService.getDashboardData({
            userDays: userDays ? Number.parseInt(userDays, 10) : 15,
            revenueDays: revenueDays ? Number.parseInt(revenueDays, 10) : 15,
            tokenDays: tokenDays ? Number.parseInt(tokenDays, 10) : 15,
        });
    }
}
