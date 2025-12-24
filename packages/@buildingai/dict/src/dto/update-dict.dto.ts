import { IsBoolean, IsInt, IsOptional, IsString, MaxLength } from "class-validator";

/**
 * Update Dictionary Configuration DTO
 */
export class UpdateDictDto {
    /**
     * Configuration key
     * Unique key name to identify the configuration item
     */
    @IsString()
    @IsOptional()
    @MaxLength(100, { message: "Configuration key length cannot exceed 100 characters" })
    key?: string;

    /**
     * Configuration value
     * Stores the configuration item value in JSON format
     */
    @IsString()
    @IsOptional()
    value?: string;

    /**
     * Configuration group
     * Used for categorizing and managing configurations
     */
    @IsString()
    @IsOptional()
    @MaxLength(50, { message: "Configuration group length cannot exceed 50 characters" })
    group?: string;

    /**
     * Configuration description
     * Description of the configuration item
     */
    @IsString()
    @IsOptional()
    @MaxLength(255, { message: "Configuration description length cannot exceed 255 characters" })
    description?: string;

    /**
     * Sort order
     */
    @IsInt()
    @IsOptional()
    sort?: number;

    /**
     * Whether enabled
     */
    @IsBoolean()
    @IsOptional()
    isEnabled?: boolean;
}
