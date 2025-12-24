import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

/**
 * PM2 restart request DTO
 */
export class Pm2RestartDto {
    @IsOptional()
    @IsString()
    appName?: string;
}

/**
 * PM2 reload request DTO
 */
export class Pm2ReloadDto {
    @IsOptional()
    @IsString()
    appName?: string;
}

/**
 * PM2 stop request DTO
 */
export class Pm2StopDto {
    @IsOptional()
    @IsString()
    appName?: string;
}

/**
 * PM2 delete request DTO
 */
export class Pm2DeleteDto {
    @IsOptional()
    @IsString()
    appName?: string;
}

/**
 * PM2 logs query DTO
 */
export class Pm2LogsQueryDto {
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(1000)
    lines?: number = 100;

    @IsOptional()
    @IsString()
    appName?: string;
}

/**
 * PM2 process info query DTO
 */
export class Pm2ProcessInfoQueryDto {
    @IsOptional()
    @IsString()
    appName?: string;
}
