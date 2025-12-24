import {
    IsBoolean,
    IsDefined,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
} from "class-validator";

/**
 * Create Dictionary Configuration DTO
 */
export class CreateDictDto {
    /**
     * Configuration key
     * Unique key name to identify the configuration item
     */
    @IsDefined({ message: "Configuration key parameter is required" })
    @IsString({ message: "Configuration key must be a string" })
    @IsNotEmpty({ message: "Configuration key cannot be empty" })
    @MaxLength(100, { message: "Configuration key length cannot exceed 100 characters" })
    key: string;

    /**
     * Configuration value
     * Stores the configuration item value in JSON format
     */
    @IsDefined({ message: "Configuration value parameter is required" })
    @IsNotEmpty({ message: "Configuration value cannot be empty" })
    value: string;

    /**
     * Configuration group
     * Used for categorizing and managing configurations
     */
    @IsDefined({ message: "Configuration group parameter is required" })
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
