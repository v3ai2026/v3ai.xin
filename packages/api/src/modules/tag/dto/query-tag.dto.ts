import type { TagTypeType } from "@buildingai/constants";
import { IsOptional, IsString } from "class-validator";

/**
 * Query Tag DTO
 */
export class QueryTagDto {
    /**
     * Tag name (fuzzy search)
     */
    @IsString()
    @IsOptional()
    name?: string;

    /**
     * Tag type
     */
    @IsString()
    @IsOptional()
    type?: TagTypeType;
}
