import { HttpErrorFactory } from "@buildingai/errors";
import { UUIDValidationPipe } from "@buildingai/pipe/param-validate.pipe";
import { ConsoleController } from "@common/decorators/controller.decorator";
import { Permissions } from "@common/decorators/permissions.decorator";
import { BatchDeleteMicropageDto } from "@modules/decorate/dto/batch-delete-micropage.dto";
import { CreateMicropageDto } from "@modules/decorate/dto/create-micropage.dto";
import { QueryMicropageDto } from "@modules/decorate/dto/query-micropage.dto";
import { UpdateMicropageDto } from "@modules/decorate/dto/update-micropage.dto";
import { MicropageService } from "@modules/decorate/services/micropage.service";
import { Body, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";

/**
 * 微页面管理控制器
 */
@ConsoleController("decorate-micropage", "微页面")
export class MicroPageConsoleController {
    constructor(private readonly micropageService: MicropageService) {}

    /**
     * 获取微页面列表
     */
    @Get()
    @Permissions({
        code: "list",
        name: "微页面列表",
        description: "获取微页面列表",
    })
    async list(@Query() queryMicropageDto: QueryMicropageDto) {
        return this.micropageService.lists(queryMicropageDto);
    }

    /**
     * 获取微页面
     * @param id 微页面ID
     * @returns 微页面信息
     */
    @Get(":id")
    @Permissions({
        code: "detail",
        name: "查看微页面详情",
        description: "根据ID查询微页面信息",
    })
    async detail(@Param("id", UUIDValidationPipe) id: string) {
        const result = this.micropageService.findOneById(id, {
            excludeFields: ["page_type", "source"],
        });
        if (!result) {
            throw HttpErrorFactory.notFound("数据不存在");
        }
        return result;
    }

    /**
     * 创建微页面
     * @param createMicropageDto 创建微页面数据
     * @returns 创建的微页面信息
     */
    @Post()
    @Permissions({
        code: "create",
        name: "创建微页面",
        description: "创建新的微页面",
    })
    async create(@Body() createMicropageDto: CreateMicropageDto) {
        return this.micropageService.createMicroPage(createMicropageDto);
    }

    /**
     * 更新微页面
     * @param id 微页面ID
     * @param updateMicropageDto 更新微页面DTO
     * @returns 更新后的微页面
     */
    @Patch(":id")
    @Permissions({
        code: "update",
        name: "更新微页面",
        description: "更新微页面信息",
    })
    async update(
        @Param("id", UUIDValidationPipe) id: string,
        @Body() updateMicropageDto: UpdateMicropageDto,
    ) {
        const micropage = await this.micropageService.findOne({
            where: {
                id,
            },
        });
        if (!micropage) {
            throw HttpErrorFactory.notFound("数据不存在");
        }
        return await this.micropageService.updateMicroPageById(id, updateMicropageDto);
    }

    /**
     * 设置首页
     * @param id 微页面ID
     * @returns 更新后的微页面
     */
    @Patch("home/:id")
    @Permissions({
        code: "set-home",
        name: "设置首页",
        description: "设置微页面为首页",
    })
    async home(@Param("id", UUIDValidationPipe) id: string) {
        return this.micropageService.home(id);
    }

    /**
     * 删除微页面
     * @param id 微页面ID
     * @returns 删除结果
     */
    @Delete(":id")
    @Permissions({
        code: "delete",
        name: "删除微页面",
        description: "删除微页面",
    })
    async remove(@Param("id", UUIDValidationPipe) id: string) {
        await this.micropageService.delete(id);
        return {
            success: true,
            message: "删除成功",
        };
    }

    /**
     * 批量删除微页面
     * @param batchDeleteMicropageDto 批量删除微页面DTO
     * @returns 操作结果
     */
    @Post("batch-delete")
    @Permissions({
        code: "batch-delete",
        name: "批量删除微页面",
        description: "批量删除微页面",
    })
    async batchRemove(@Body() batchDeleteMicropageDto: BatchDeleteMicropageDto) {
        await this.micropageService.batchDelete(batchDeleteMicropageDto.ids);
        return {
            success: true,
            message: "批量删除成功",
        };
    }
}
