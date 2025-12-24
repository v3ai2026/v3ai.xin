import { PartialType } from "@nestjs/mapped-types";

import { CreateMenuDto } from "./create-menu.dto";

/**
 * 更新菜单DTO
 */
export class UpdateMenuDto extends PartialType(CreateMenuDto) {}
