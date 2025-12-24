import { Transform, Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
    ValidateNested,
} from "class-validator";

/**
 * 文本预处理规则 DTO
 */
export class TextPreprocessingRulesDto {
    /**
     * 替换连续的空格、换行符和制表符
     */
    @IsOptional()
    @IsBoolean({ message: "替换连续空白字符必须是布尔值" })
    @Transform(({ value }) => value === true || value === "true")
    replaceConsecutiveWhitespace?: boolean = true;

    /**
     * 删除所有 URL 和电子邮件地址
     */
    @IsOptional()
    @IsBoolean({ message: "删除URL和邮箱必须是布尔值" })
    @Transform(({ value }) => value === true || value === "true")
    removeUrlsAndEmails?: boolean = true;
}

/**
 * 分段配置 DTO
 */
export class SegmentationDto {
    /**
     * 分段标识符
     */
    @IsString({ message: "分段标识符必须是字符串" })
    @IsNotEmpty({ message: "分段标识符不能为空" })
    segmentIdentifier: string;

    /**
     * 分段最大长度
     */
    @IsInt({ message: "分段最大长度必须是整数" })
    @Min(50, { message: "分段最大长度不能小于50" })
    @Max(8000, { message: "分段最大长度不能超过8000" })
    @Transform(({ value }) => parseInt(value))
    maxSegmentLength: number;

    /**
     * 分段重叠长度（普通分段模式使用）
     */
    @IsOptional()
    @IsInt({ message: "分段重叠长度必须是整数" })
    @Min(0, { message: "分段重叠长度不能小于0" })
    @Max(2000, { message: "分段重叠长度不能超过2000" })
    @Transform(({ value }) => parseInt(value))
    segmentOverlap?: number;
}

/**
 * 子分段配置 DTO
 */
export class SubSegmentationDto {
    /**
     * 分段标识符
     */
    @IsString({ message: "子分段标识符必须是字符串" })
    @IsNotEmpty({ message: "子分段标识符不能为空" })
    segmentIdentifier: string;

    /**
     * 分段最大长度
     */
    @IsInt({ message: "子分段最大长度必须是整数" })
    @Min(50, { message: "子分段最大长度不能小于50" })
    @Max(8000, { message: "子分段最大长度不能超过8000" })
    @Transform(({ value }) => parseInt(value))
    maxSegmentLength: number;
}

/**
 * 知识库分段清洗 DTO
 */
export class IndexingSegmentsDto {
    /**
     * 文档处理模式：normal-普通分段，hierarchical-父子分段
     */
    @IsOptional()
    @IsString({ message: "文档处理模式必须是字符串" })
    documentMode?: "normal" | "hierarchical" = "normal";

    /**
     * 父块上下文模式（父子分段模式使用）：fullText-全文，paragraph-段落
     */
    @IsOptional()
    @IsString({ message: "父块上下文模式必须是字符串" })
    parentContextMode?: "fullText" | "paragraph";

    /**
     * 分段配置（普通模式使用，父子模式中用于父块段落分段）
     */
    @IsOptional()
    @ValidateNested()
    @Type(() => SegmentationDto)
    segmentation?: SegmentationDto;

    /**
     * 子分段配置（父子分段模式使用）
     */
    @IsOptional()
    @ValidateNested()
    @Type(() => SubSegmentationDto)
    subSegmentation?: SubSegmentationDto;

    /**
     * 文本预处理规则
     */
    @IsOptional()
    @ValidateNested()
    @Type(() => TextPreprocessingRulesDto)
    preprocessingRules?: TextPreprocessingRulesDto = new TextPreprocessingRulesDto();

    /**
     * 文件 ID 列表
     */
    @IsArray({ message: "文件ID列表必须是数组" })
    @IsNotEmpty({ message: "文件ID列表不能为空" })
    @IsUUID("4", { each: true, message: "每个文件ID必须是有效的UUID" })
    fileIds: string[];
}

/**
 * 分段结果 DTO
 */
export class SegmentResultDto {
    /**
     * 分段内容
     */
    content: string;

    /**
     * 分段索引（可选）
     */
    index?: number;

    /**
     * 分段长度（可选）
     */
    length?: number;
}

/**
 * 子块结果 DTO
 */
export class ChildSegmentDto {
    /**
     * 子块内容
     */
    content: string;

    /**
     * 子块索引
     */
    index: number;

    /**
     * 子块长度
     */
    length: number;
}

/**
 * 父块结果 DTO
 */
export class ParentSegmentDto {
    /**
     * 父块内容
     */
    content: string;

    /**
     * 父块索引
     */
    index: number;

    /**
     * 父块长度
     */
    length: number;

    /**
     * 关联的子块列表
     */
    children: ChildSegmentDto[];
}

/**
 * 单个文件的分段结果 DTO
 */
export class FileSegmentResultDto {
    /**
     * 文件ID
     */
    fileId: string;

    /**
     * 文件名
     */
    fileName: string;

    /**
     * 文件分段结果
     */
    segments: (SegmentResultDto | ParentSegmentDto)[];

    /**
     * 该文件的分段数量
     */
    segmentCount: number;
}

/**
 * 知识库分段清洗响应 DTO
 */
export class IndexingSegmentsResponseDto {
    /**
     * 按文件分组的分段结果
     */
    fileResults: FileSegmentResultDto[];

    /**
     * 总分段数量
     */
    totalSegments: number;

    /**
     * 处理文件数量
     */
    processedFiles: number;

    /**
     * 处理时间（毫秒）
     */
    processingTime: number;
}
