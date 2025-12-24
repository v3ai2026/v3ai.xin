import type { TagTypeType } from "@buildingai/constants";
import { IsOptional, IsString, Length } from "class-validator";

/**
 * Create Tag DTO
 */
export class CreateTagDto {
    /**
     * Tag name
     */
    @IsString({ message: "Tag name must be a string" })
    @Length(1, 100, { message: "Tag name length must be between 1 and 100 characters" })
    name: string;

    /**
     * Tag type
     */
    @IsString({ message: "Tag type must be a string" })
    @IsOptional()
    type?: TagTypeType;
}
