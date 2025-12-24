import {
    ExtensionStatus,
    type ExtensionStatusType,
} from "@buildingai/constants/shared/extension.constant";
import { PartialType } from "@nestjs/mapped-types";
import { ArrayNotEmpty, IsArray, IsEnum, IsOptional, IsString } from "class-validator";

import { CreateExtensionDto } from "./create-extension.dto";

/**
 * Update Extension DTO
 */
export class UpdateExtensionDto extends PartialType(CreateExtensionDto) {
    /**
     * alias
     */
    @IsString({ message: "alias must be a string" })
    @IsOptional()
    alias?: string;
}

/**
 * Batch Update Extension Status DTO
 */
export class BatchUpdateExtensionStatusDto {
    /**
     * Extension ID array
     */
    @IsArray({ message: "ids must be an array" })
    @ArrayNotEmpty({ message: "ids cannot be empty" })
    @IsString({ each: true, message: "Each id must be a string" })
    ids: string[];

    /**
     * Extension status
     */
    @IsEnum(ExtensionStatus, { message: "Extension status must be a valid enum value" })
    status: ExtensionStatusType;
}
