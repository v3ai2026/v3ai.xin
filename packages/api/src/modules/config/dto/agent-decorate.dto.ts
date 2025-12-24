import { Type } from "class-transformer";
import { IsBoolean, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

export class AgentDecorateLinkItemDto {
    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    path?: string;

    @IsOptional()
    @IsObject()
    query?: Record<string, unknown>;
}

export class AgentDecorateDto {
    @IsBoolean()
    enabled!: boolean;

    @IsString()
    title!: string;

    @IsString()
    description!: string;

    @ValidateNested()
    @Type(() => AgentDecorateLinkItemDto)
    link!: AgentDecorateLinkItemDto;

    @IsString()
    heroImageUrl!: string;

    @IsString()
    overlayTitle!: string;

    @IsString()
    overlayDescription!: string;

    @IsString()
    overlayIconUrl!: string;
}
