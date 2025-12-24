import { BusinessCode } from "@buildingai/constants/shared/business-code.constant";
import { HttpErrorFactory } from "@buildingai/errors";
import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as fse from "fs-extra";
import * as mime from "mime-types";
import * as path from "path";

import type {
    FileMetadata,
    FileStorageOptions,
    FileStoragePath,
    RemoteFileOptions,
} from "../interfaces/file-storage.interface";
import { FilePathGenerator } from "../utils/file-path-generator.util";
import { FileTypeDetector } from "../utils/file-type-detector.util";

/**
 * File storage service
 *
 * Handles physical file storage operations (local filesystem)
 * Can be extended to support cloud storage (OSS, S3, etc.)
 */
@Injectable()
export class FileStorageService {
    private readonly defaultStorageRoot: string;
    private readonly projectRoot: string;

    constructor() {
        // Get project root directory (monorepo root)
        // Assuming service runs from packages/api, go up 2 levels to reach project root
        this.projectRoot = path.resolve(process.cwd(), "../..");

        // Default storage root relative to project root
        this.defaultStorageRoot = path.join(this.projectRoot, "storage", "uploads");
        fse.ensureDirSync(this.defaultStorageRoot);
    }

    /**
     * Get storage root directory
     *
     * @param options Storage options
     * @returns Storage root path
     */
    private getStorageRoot(options?: FileStorageOptions): string {
        // If extensionId is provided, use extension's uploads directory
        if (options?.extensionId) {
            const extensionRoot = path.join(
                this.projectRoot,
                "extensions",
                options.extensionId,
                "storage",
                "uploads",
            );
            fse.ensureDirSync(extensionRoot);
            return extensionRoot;
        }

        return options?.storageRoot || this.defaultStorageRoot;
    }

    /**
     * Extract file metadata from buffer or file object
     *
     * @param file File buffer or Multer file
     * @param originalName Original file name
     * @param mimeType Optional MIME type
     * @returns File metadata
     */
    extractMetadata(
        file: Buffer | Express.Multer.File,
        originalName?: string,
        mimeType?: string,
    ): FileMetadata {
        let fileName: string;
        let fileMimeType: string;
        let fileSize: number;

        // Handle Multer file object
        if (Buffer.isBuffer(file)) {
            fileName = originalName || "unknown";
            fileMimeType = mimeType || mime.lookup(fileName) || "application/octet-stream";
            fileSize = file.length;
        } else {
            // Express.Multer.File
            fileName = Buffer.from(file.originalname, "latin1").toString("utf8");
            fileMimeType = file.mimetype || mime.lookup(fileName) || "application/octet-stream";
            fileSize = file.size;
        }

        const extension = path.extname(fileName).replace(".", "").toLowerCase();
        const fileType = FileTypeDetector.detect(fileMimeType);

        return {
            originalName: fileName,
            mimeType: fileMimeType,
            size: fileSize,
            extension,
            type: fileType,
        };
    }

    /**
     * Generate storage path for file
     *
     * @param metadata File metadata
     * @param options Storage options
     * @returns Storage path information
     */
    generateStoragePath(metadata: FileMetadata, options?: FileStorageOptions): FileStoragePath {
        const organizeByType = options?.organizeByType ?? true;
        const organizeByDate = options?.organizeByDate ?? true;

        return FilePathGenerator.generate(
            metadata.type,
            metadata.extension,
            organizeByType,
            organizeByDate,
        );
    }

    /**
     * Save file buffer to storage
     *
     * @param buffer File buffer
     * @param storagePath Storage path information
     * @param options Storage options
     * @returns Full file path
     */
    async saveBuffer(
        buffer: Buffer,
        storagePath: FileStoragePath,
        options?: FileStorageOptions,
    ): Promise<string> {
        const storageRoot = this.getStorageRoot(options);
        const fullPath = path.join(storageRoot, storagePath.fullPath);

        try {
            // Ensure directory exists
            await fse.ensureDir(path.dirname(fullPath));

            // Write file
            await fse.writeFile(fullPath, buffer);

            return fullPath;
        } catch (error) {
            throw HttpErrorFactory.internal(
                `Failed to save file: ${error.message}`,
                BusinessCode.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Save Multer file to storage
     *
     * @param file Multer file object
     * @param storagePath Storage path information
     * @param options Storage options
     * @returns Full file path
     */
    async saveMulterFile(
        file: Express.Multer.File,
        storagePath: FileStoragePath,
        options?: FileStorageOptions,
    ): Promise<string> {
        return this.saveBuffer(file.buffer, storagePath, options);
    }

    /**
     * Download and save remote file
     *
     * @param remoteOptions Remote file options
     * @param storagePath Storage path information
     * @param options Storage options
     * @returns Full file path and file size
     */
    async saveRemoteFile(
        remoteOptions: RemoteFileOptions,
        storagePath: FileStoragePath,
        options?: FileStorageOptions,
    ): Promise<{ fullPath: string; size: number }> {
        const { url, timeout = 60000, maxSize = 100 * 1024 * 1024 } = remoteOptions;
        const storageRoot = this.getStorageRoot(options);
        const fullPath = path.join(storageRoot, storagePath.fullPath);

        try {
            // Download remote file
            const response = await axios.get(url, {
                responseType: "stream",
                timeout,
                maxContentLength: maxSize,
            });

            // Ensure directory exists
            await fse.ensureDir(path.dirname(fullPath));

            // Save file stream
            const writer = fse.createWriteStream(fullPath);
            response.data.pipe(writer);

            await new Promise<void>((resolve, reject) => {
                writer.on("finish", () => resolve());
                writer.on("error", reject);
            });

            // Get file size
            const stats = await fse.stat(fullPath);

            return {
                fullPath,
                size: stats.size,
            };
        } catch (error) {
            // Clean up on error
            if (await fse.pathExists(fullPath)) {
                await fse.unlink(fullPath);
            }

            throw HttpErrorFactory.internal(
                `Failed to download remote file: ${error.message}`,
                BusinessCode.REQUEST_FAILED,
            );
        }
    }

    /**
     * Delete file from storage
     *
     * @param relativePath Relative file path
     * @param options Storage options
     */
    async deleteFile(relativePath: string, options?: FileStorageOptions): Promise<void> {
        const storageRoot = this.getStorageRoot(options);
        const fullPath = path.join(storageRoot, relativePath);

        try {
            if (await fse.pathExists(fullPath)) {
                await fse.unlink(fullPath);
            }
        } catch (error) {
            throw HttpErrorFactory.internal(
                `Failed to delete file: ${error.message}`,
                BusinessCode.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Check if file exists
     *
     * @param relativePath Relative file path
     * @param options Storage options
     * @returns True if file exists
     */
    async fileExists(relativePath: string, options?: FileStorageOptions): Promise<boolean> {
        const storageRoot = this.getStorageRoot(options);
        const fullPath = path.join(storageRoot, relativePath);
        return fse.pathExists(fullPath);
    }

    /**
     * Get full file path
     *
     * @param relativePath Relative file path
     * @param options Storage options
     * @returns Full file path
     */
    getFullPath(relativePath: string, options?: FileStorageOptions): string {
        const storageRoot = this.getStorageRoot(options);
        return path.join(storageRoot, relativePath);
    }

    /**
     * Create read stream for file
     *
     * @param relativePath Relative file path
     * @param options Storage options
     * @returns File read stream
     */
    createReadStream(relativePath: string, options?: FileStorageOptions): fse.ReadStream | null {
        const fullPath = this.getFullPath(relativePath, options);

        if (!fse.existsSync(fullPath)) {
            return null;
        }

        return fse.createReadStream(fullPath);
    }
}
