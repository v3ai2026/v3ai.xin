import { PaginationDto } from "@buildingai/dto/pagination.dto";
import { isEnabled } from "@buildingai/utils";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

/**
 * 查询角色DTO
 *
 * 用于角色列表查询的参数验证
 * 继承自PaginationDto，支持分页查询
 */
export class QueryRoleDto extends PaginationDto {
    /**
     * 角色名称
     *
     * 用于按名称搜索角色，支持模糊匹配
     */
    @IsOptional()
    @IsString({ message: "角色名称必须是字符串" })
    name?: string;

    /**
     * 角色描述
     *
     * 用于按描述搜索角色，支持模糊匹配
     */
    @IsOptional()
    @IsString({ message: "角色描述必须是字符串" })
    description?: string;

    /**
     * 是否禁用
     *
     * 禁用的角色将不能被分配给用户，已分配该角色的用户将无法使用该角色的权限
     */
    @IsOptional()
    @IsBoolean({ message: "禁用状态必须是布尔值" })
    @Transform(({ value }) => {
        if (value === undefined || value === null) return value;
        return isEnabled(value);
    })
    isDisabled?: boolean;
}
