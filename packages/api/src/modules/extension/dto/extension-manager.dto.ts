import { IsOptional, IsString } from "class-validator";

/**
 * Download Extension DTO
 */
export class DownloadExtensionDto {
    /**
     * Extension version
     */
    @IsOptional()
    @IsString({ message: "Extension version must be a string" })
    version?: string;
}

/**
 * Set Platform Secret DTO
 */
export class SetPlatformSecretDto {
    /**
     * Platform secret (optional, can be empty string)
     */
    @IsOptional()
    @IsString({ message: "Platform secret must be a string" })
    platformSecret?: string;
}
