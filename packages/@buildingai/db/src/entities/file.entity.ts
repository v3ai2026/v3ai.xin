import { AppEntity } from "../decorators/app-entity.decorator";
import { Column, JoinColumn, ManyToOne } from "../typeorm";
import { BaseEntity } from "./base";
import { User } from "./user.entity";

/**
 * 文件类型枚举
 */
export enum FileType {
    /**
     * 图片
     */
    IMAGE = "image",

    /**
     * 文档
     */
    DOCUMENT = "document",

    /**
     * 视频
     */
    VIDEO = "video",

    /**
     * 音频
     */
    AUDIO = "audio",

    /**
     * 压缩包
     */
    ARCHIVE = "archive",

    /**
     * 其他
     */
    OTHER = "other",
}

/**
 * 文件实体
 *
 * 用于记录上传的文件信息
 */
@AppEntity({ name: "file", comment: "文件上传记录" })
export class File extends BaseEntity {
    /**
     * 原始文件名
     */
    @Column({ type: "varchar", length: 500, nullable: true })
    originalName: string;

    /**
     * 存储文件名
     *
     * 重命名后的文件名，用于在磁盘上存储
     */
    @Column({ type: "varchar", length: 500, nullable: true })
    storageName: string;

    /**
     * 文件类型
     */
    @Column({
        type: "varchar",
        length: 50,
        default: FileType.OTHER,
    })
    type: FileType;

    /**
     * IP地址
     */
    @Column({ type: "varchar", length: 100, nullable: true })
    ip?: string;

    /**
     * 文件MIME类型
     */
    @Column({ type: "varchar", length: 100, nullable: true })
    mimeType: string;

    /**
     * 文件大小（字节）
     */
    @Column({ type: "int" })
    size: number;

    /**
     * 文件描述
     */
    @Column({ nullable: true, type: "varchar", length: 255 })
    description: string;

    /**
     * 文件扩展名
     */
    @Column({ type: "varchar", nullable: true })
    extension: string;

    /**
     * 文件存储路径
     *
     * 相对于存储根目录的路径
     */
    @Column({ type: "varchar", length: 1024, nullable: true })
    path: string;

    /**
     * 文件URL
     *
     * 可访问的完整URL
     */
    @Column({ nullable: true, type: "varchar", length: 1024 })
    url: string;

    /**
     * 上传者ID
     */
    @Column({ nullable: true, type: "uuid" })
    uploaderId: string;

    /**
     * 上传者
     */
    @ManyToOne(() => User, { nullable: true, onDelete: "SET NULL" })
    @JoinColumn({ name: "uploader_id" })
    uploader: User;

    /**
     * 插件标识符
     *
     * 标识文件所属的插件ID,用于插件隔离和管理
     */
    @Column({ nullable: true, type: "varchar", length: 255 })
    extensionIdentifier?: string;
}
