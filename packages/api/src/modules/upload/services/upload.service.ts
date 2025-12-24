import { BaseService } from "@buildingai/base";
import { FileUploadService, type UploadFileResult } from "@buildingai/core/modules";
import { InjectRepository } from "@buildingai/db/@nestjs/typeorm";
import { File } from "@buildingai/db/entities";
import { Repository } from "@buildingai/db/typeorm";
import { RemoteUploadDto } from "@modules/upload/dto/remote-upload.dto";
import { Injectable } from "@nestjs/common";
import { Request } from "express";

/**
 * File upload service (API layer)
 *
 * Handles HTTP request-specific logic and delegates core operations to FileUploadService
 */
@Injectable()
export class UploadService extends BaseService<File> {
    /**
     * Constructor
     *
     * @param fileRepository File repository
     * @param fileUploadService Core file upload service
     */
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
        private readonly fileUploadService: FileUploadService,
    ) {
        super(fileRepository);
    }

    /**
     * Save uploaded file
     *
     * @param file Uploaded file
     * @param request Express request object
     * @param description File description
     * @param extensionId Extension ID
     * @returns Upload result
     */
    async saveUploadedFile(
        file: Express.Multer.File,
        request: Request,
        description?: string,
        extensionId?: string,
    ): Promise<UploadFileResult> {
        return this.fileUploadService.uploadFile(
            file,
            request,
            description,
            extensionId ? { extensionId } : undefined,
        );
    }

    /**
     * Save multiple uploaded files
     *
     * @param files Array of uploaded files
     * @param request Express request object
     * @param description File description
     * @param extensionId Extension ID
     * @returns Array of upload results
     */
    async saveUploadedFiles(
        files: Express.Multer.File[],
        request: Request,
        description?: string,
        extensionId?: string,
    ): Promise<UploadFileResult[]> {
        return this.fileUploadService.uploadFiles(
            files,
            request,
            description,
            extensionId ? { extensionId } : undefined,
        );
    }

    /**
     * Get file by ID
     *
     * @param id File ID
     * @returns File entity
     */
    async getFileById(id: string): Promise<Partial<File>> {
        return this.fileUploadService.findOneById(id);
    }

    /**
     * Delete file
     *
     * @param id File ID
     * @returns Success status
     */
    async deleteFile(id: string): Promise<boolean> {
        await this.fileUploadService.deleteFileById(id);
        return true;
    }

    /**
     * Get file physical path
     *
     * @param id File ID
     * @returns File physical path
     */
    async getFilePath(id: string): Promise<string> {
        return this.fileUploadService.getFilePath(id);
    }

    /**
     * Upload remote file
     *
     * @param remoteUploadDto Remote upload parameters
     * @param request Express request object
     * @returns Upload result
     */
    async uploadRemoteFile(
        remoteUploadDto: RemoteUploadDto,
        request: Request,
    ): Promise<UploadFileResult> {
        const { url, description, extensionId } = remoteUploadDto;

        return this.fileUploadService.uploadRemoteFile(
            url,
            request,
            description,
            extensionId ? { extensionId } : undefined,
        );
    }
}
