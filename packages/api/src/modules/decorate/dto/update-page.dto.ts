import { IsArray } from "class-validator";

export class UpdatePageDto {
    @IsArray({ message: "数据必须是数组格式" })
    data: any[];

    @IsArray({ message: "数据必须是数组格式" })
    meta: any[];
}
