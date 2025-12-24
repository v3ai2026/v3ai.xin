import { PaginationDto } from "@buildingai/dto/pagination.dto";
import { isEnabled } from "@buildingai/utils";
import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString } from "class-validator";

/**
 * Query Dictionary Configuration DTO
 */
export class QueryDictDto extends PaginationDto {
    /**
     * Configuration key
     * Supports fuzzy search
     */
    @IsString()
    @IsOptional()
    key?: string;

    /**
     * Configuration group
     */
    @IsString()
    @IsOptional()
    group?: string;

    /**
     * Whether enabled
     */
    @IsBoolean()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === undefined || value === null) return value;
        return isEnabled(value);
    })
    isEnabled?: boolean;
}
