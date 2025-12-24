import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateRechargeConfigDto {
    /**
     * 是否置顶筛选
     */
    @IsBoolean({ message: "充值状态必须是布尔值" })
    rechargeStatus: boolean;

    @IsOptional()
    @IsString({ message: "充值说明必须是字符串" })
    rechargeExplain?: string;

    @IsArray({ message: "充值必须是数组格式" })
    @Type(() => RechargeRuleDto)
    rechargeRule: RechargeRuleDto[];
}

export class RechargeRuleDto {
    id: string;
    power: number;
    givePower: number;
    sellPrice: number;
    label: string;
}
