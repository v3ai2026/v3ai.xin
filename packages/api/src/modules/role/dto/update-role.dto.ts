import { PartialType } from "@nestjs/mapped-types";
import { IsUUID } from "class-validator";

import { CreateRoleDto } from "./create-role.dto";

/**
 * 更新角色DTO
 *
 * 用于更新角色信息时的数据验证
 * 继承自CreateRoleDto，但所有字段都是可选的
 */
export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    /**
     * 角色ID
     *
     * 要更新的角色ID
     */
    @IsUUID()
    id: string;
}
