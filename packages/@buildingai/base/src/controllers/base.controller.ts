import { PaginationDto } from "@buildingai/dto/pagination.dto";
import { Logger } from "@nestjs/common";

/**
 * 基础控制器类
 *
 * 提供通用的控制器方法，如成功响应、错误响应、分页结果处理等
 */
export class BaseController {
    /**
     * 日志记录器
     */
    protected readonly logger: Logger;

    /**
     * 构造函数
     */
    constructor() {
        const controllerName = this.constructor.name;
        this.logger = new Logger(controllerName);
    }

    /**
     * 构建分页返回结果
     *
     * @param data 列表数据
     * @param total 总条数
     * @param paginationDto 分页参数
     * @returns 分页返回格式
     */
    protected paginationResult<T = any>(data: T[], total: number, paginationDto: PaginationDto) {
        const totalPages = Math.ceil(total / paginationDto.pageSize);

        return {
            items: data,
            total,
            page: paginationDto.page,
            pageSize: paginationDto.pageSize,
            totalPages,
        };
    }
}
