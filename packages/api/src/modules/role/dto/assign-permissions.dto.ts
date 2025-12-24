import { IsArray, IsNotEmpty, IsUUID } from "class-validator";

/**
 * 角色权限分配DTO
 *
 * 用于为角色分配权限
 */
export class AssignPermissionsDto {
    /**
     * 角色ID
     */
    @IsNotEmpty({ message: "角色ID不能为空" })
    @IsUUID("4", { message: "角色ID必须是有效的UUID" })
    id: string;

    /**
     * 权限ID列表
     */
    @IsNotEmpty({ message: "权限ID列表不能为空" })
    @IsArray({ message: "权限ID列表必须是数组" })
    @IsUUID("4", { each: true, message: "权限ID必须是有效的UUID" })
    permissionIds: string[];
}
