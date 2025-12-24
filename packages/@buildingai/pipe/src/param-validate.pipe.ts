import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { validate as isUUID } from "uuid";

/**
 * UUID Validation Pipe
 */
@Injectable()
export class UUIDValidationPipe implements PipeTransform {
    transform(value: string) {
        if (!isUUID(value)) {
            throw new BadRequestException("Invalid UUID format");
        }
        return value;
    }
}
