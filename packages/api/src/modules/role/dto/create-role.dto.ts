import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
} from "class-validator";

/**
 * 创建角色DTO
 *
 * 用于创建新角色时的数据验证
 */
export class CreateRoleDto {
    /**
     * 角色名称
     *
     * 例如: "管理员", "编辑者", "普通用户"
     */
    @IsNotEmpty({ message: "角色名称不能为空" })
    @IsString({ message: "角色名称必须是字符串" })
    @MaxLength(50, { message: "角色名称最大长度为50个字符" })
    @MinLength(2, { message: "角色名称最小长度为2个字符" })
    name: string;

    /**
     * 角色描述
     *
     * 对角色功能和用途的简要说明
     */
    @IsOptional()
    @IsString({ message: "角色描述必须是字符串" })
    @MaxLength(200, { message: "角色描述最大长度为200个字符" })
    description?: string;

    /**
     * 角色关联的权限ID列表
     */
    @IsOptional()
    @IsArray({ message: "权限列表必须是数组" })
    @IsUUID("all", { each: true, message: "数组项必须是UUID格式" })
    permissionIds?: string[];

    /**
     * 是否禁用
     *
     * 禁用的角色将不能被分配给用户，已分配该角色的用户将无法使用该角色的权限
     */
    @IsOptional()
    @IsBoolean({ message: "禁用状态必须是布尔值" })
    isDisabled?: boolean;
}
