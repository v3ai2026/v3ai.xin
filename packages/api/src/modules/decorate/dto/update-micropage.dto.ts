import { CreateMicropageDto } from "@modules/decorate/dto/create-micropage.dto";
import { PartialType } from "@nestjs/mapped-types";

/**
 *
 * 继承自分页DTO，自动包含分页参数
 */
export class UpdateMicropageDto extends PartialType(CreateMicropageDto) {}
