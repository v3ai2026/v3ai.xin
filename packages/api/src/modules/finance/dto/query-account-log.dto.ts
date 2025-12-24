import { PaginationDto } from "@buildingai/dto/pagination.dto";
import { IsOptional, IsString } from "class-validator";

/**
 * 查询用户账户记录订单DTO
 */
export class QueryAccountLogDto extends PaginationDto {
    /**
     * 关键词搜索
     */
    @IsString()
    @IsOptional()
    keyword?: string;

    /**
     * 账户类型
     */
    @IsOptional()
    accountType?: number;
}
