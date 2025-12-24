import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * 允许更新的用户字段
 */
export const ALLOWED_USER_FIELDS = [
    "nickname",
    "email",
    "phone",
    "avatar",
    "bio",
    "gender",
    "realName",
] as const;

export type AllowedUserField = (typeof ALLOWED_USER_FIELDS)[number];

/**
 * 更新用户字段DTO
 */
export class UpdateUserFieldDto {
    /**
     * 要更新的字段名
     */
    @IsString({ message: "字段名必须是字符串" })
    @IsNotEmpty({ message: "字段名不能为空" })
    @IsIn(ALLOWED_USER_FIELDS, { message: "不允许更新该字段" })
    field: AllowedUserField;

    /**
     * 字段值
     */
    @IsOptional()
    value: any;
}
