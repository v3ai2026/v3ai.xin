import { Transform } from "class-transformer";
import { IsNumber, IsOptional, Min } from "class-validator";

/**
 * Base Pagination DTO
 *
 * Provides common pagination parameters that can be inherited by other query DTOs
 */
export class PaginationDto {
    /**
     * Page number
     *
     * Starting from 1
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber({}, { message: "Page must be a number" })
    @Min(1, { message: "Page minimum is 1" })
    page?: number = 1;

    /**
     * Number of items per page
     */
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber({}, { message: "Page size must be a number" })
    @Min(1, { message: "Page size minimum is 1" })
    pageSize?: number = 15;
}
