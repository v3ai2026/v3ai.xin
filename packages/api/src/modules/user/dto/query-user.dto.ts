import { PaginationDto } from "@buildingai/dto/pagination.dto";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

/**
 * 查询用户DTO
 *
 * 继承自分页DTO，自动包含分页参数
 */
export class QueryUserDto extends PaginationDto {
    /**
     * 关键词（模糊查询）
     *
     * 用于搜索用户名、昵称、邮箱、手机号
     */
    @IsOptional()
    @IsString({ message: "关键词必须是字符串" })
    keyword?: string;

    /**
     * 状态
     *
     * 0: 禁用, 1: 启用
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber({}, { message: "状态必须是数字" })
    status?: number;

    /**
     * 创建开始时间
     *
     * 筛选创建日期的开始时间，格式：YYYY-MM-DD HH:mm:ss
     */
    @IsOptional()
    @IsString({ message: "创建开始时间必须是字符串" })
    startTime?: string;

    /**
     * 创建结束时间
     *
     * 筛选创建日期的结束时间，格式：YYYY-MM-DD HH:mm:ss
     */
    @IsOptional()
    @IsString({ message: "创建结束时间必须是字符串" })
    endTime?: string;

    // 分页参数已由 PaginationDto 提供
}
