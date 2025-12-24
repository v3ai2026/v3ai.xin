import { BaseService } from "@buildingai/base";
import { BusinessCode } from "@buildingai/constants/shared/business-code.constant";
import { FileUrlService } from "@buildingai/db";
import { InjectRepository } from "@buildingai/db/@nestjs/typeorm";
import { File } from "@buildingai/db/entities";
import { Repository } from "@buildingai/db/typeorm";
import { HttpErrorFactory } from "@buildingai/errors";
import { Injectable } from "@nestjs/common";
import type { Request } from "express";
import * as mime from "mime-types";
import * as path from "path";

import type { FileStorageOptions, RemoteFileOptions } from "../interfaces/file-storage.interface";
import { FileStorageService } from "./file-storage.service";

/**
 * Upload file result
 */
export interface UploadFileResult {
    /**
     * File entity ID
     */
    id: string;

    /**
     * File access URL
     */
    url: string;

    /**
     * Original file name
     */
    originalName: string;

    /**
     * File size in bytes
     */
    size: number;

    /**
     * File MIME type
     */
    mimeType: string;

    /**
     * File extension
     */
    extension: string;
}

/**
 * File upload service
 *
 * Handles file upload business logic and database operations
 * This service can be used by both API and extensions
 */
@Injectable()
export class FileUploadService extends BaseService<File> {
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
        private readonly fileStorageService: FileStorageService,
        private readonly fileUrlService: FileUrlService,
    ) {
        super(fileRepository);
    }

    /**
     * Extract request domain from request
     *
     * @param request Express request object
     * @returns Request domain (format: protocol://host)
     */
    private getRequestDomain(request: Request): string | undefined {
        try {
            // Get protocol, prioritize proxy headers (X-Forwarded-Proto)
            let protocol =
                request.get("x-forwarded-proto") ||
                request.headers?.["x-forwarded-proto"] ||
                request.protocol ||
                "http";

            // Handle multiple protocol values (comma-separated), take the first one
            if (typeof protocol === "string" && protocol.includes(",")) {
                protocol = protocol.split(",")[0].trim();
            }

            // Ensure protocol is http or https
            protocol = protocol === "https" ? "https" : "http";

            // Get host (including port), prioritize proxy headers (X-Forwarded-Host)
            let host =
                request.get("x-forwarded-host") ||
                request.headers?.["x-forwarded-host"] ||
                request.get("host") ||
                request.headers?.host;

            if (!host) {
                return undefined;
            }

            // Convert to string if it's an array
            if (Array.isArray(host)) {
                host = host[0];
            }

            // Ensure host is a string
            if (typeof host !== "string") {
                return undefined;
            }

            // Handle multiple host values (comma-separated), take the first one
            if (host.includes(",")) {
                host = host.split(",")[0].trim();
            }

            // Check port first and correct protocol based on port
            if (host.includes(":443")) {
                protocol = "https";
                console.log(`[FileUpload] Detected :443 port, corrected protocol to https`);
            } else if (host.includes(":80")) {
                protocol = "http";
            }

            // Remove default ports (http:80, https:443)
            host = this.normalizeHost(host, protocol);

            // Handle localhost/127.0.0.1 addresses
            if (host.includes("127.0.0.1") || host.includes("localhost")) {
                console.warn(
                    `[FileUpload] Detected internal address (${host}), attempting to resolve from referer or environment variable`,
                );

                // Try to extract from referer header
                const referer = request.get("referer") || request.headers?.referer;
                if (referer && typeof referer === "string") {
                    try {
                        const refererUrl = new URL(referer);
                        const refererHost = refererUrl.host;

                        // Validate referer host is not also localhost
                        if (
                            !refererHost.includes("127.0.0.1") &&
                            !refererHost.includes("localhost")
                        ) {
                            host = refererHost;
                            protocol = refererUrl.protocol.replace(":", "") as "http" | "https";
                            console.log(
                                `[FileUpload] Resolved domain from referer: ${protocol}://${host}`,
                            );
                        }
                    } catch (_error) {
                        console.warn(`[FileUpload] Failed to parse referer: ${referer}`);
                    }
                }

                // If still localhost, fallback to APP_DOMAIN environment variable
                if (host.includes("127.0.0.1") || host.includes("localhost")) {
                    const appDomain = process.env.APP_DOMAIN;
                    if (appDomain) {
                        try {
                            const domainUrl = new URL(
                                appDomain.startsWith("http") ? appDomain : `https://${appDomain}`,
                            );
                            host = domainUrl.host;
                            protocol = domainUrl.protocol.replace(":", "") as "http" | "https";
                            console.log(
                                `[FileUpload] Using APP_DOMAIN from environment: ${protocol}://${host}`,
                            );
                        } catch {
                            console.error(
                                `[FileUpload] Invalid APP_DOMAIN format: ${appDomain}. Using localhost as fallback.`,
                            );
                        }
                    } else {
                        console.error(
                            `[FileUpload] No APP_DOMAIN configured. File URLs will use localhost and may be inaccessible externally.`,
                        );
                    }
                }
            }

            const result = `${protocol}://${host}`;

            return result;
        } catch (error) {
            console.error(error);
            return undefined;
        }
    }

    /**
     * Normalize host by removing default ports
     *
     * @param host Host name (may include port)
     * @param protocol Protocol
     * @returns Normalized host name
     */
    private normalizeHost(host: string, protocol: string): string {
        // Use regex to remove default ports
        const normalizedHost =
            protocol === "https"
                ? host.replace(/:443$/, "") // Remove https :443
                : host.replace(/:80$/, ""); // Remove http :80

        // Debug log
        if (normalizedHost !== host) {
            console.log(`[FileUpload] Port normalized: ${host} -> ${normalizedHost}`);
        }

        return normalizedHost;
    }

    /**
     * Extract client IP from request
     *
     * @param request Express request object
     * @returns Client IP address
     */
    private getClientIP(request: Request): string {
        // Check x-forwarded-for header (real IP behind proxy)
        const xForwardedFor = request.headers["x-forwarded-for"] as string;
        if (xForwardedFor) {
            const ips = xForwardedFor.split(",").map((ip) => ip.trim());
            const clientIP = ips[0];
            if (clientIP) {
                return clientIP.startsWith("::ffff:") ? clientIP.substring(7) : clientIP;
            }
        }

        // Use connection address
        const remoteAddress = request.socket?.remoteAddress || request.ip;
        return remoteAddress?.startsWith("::ffff:")
            ? remoteAddress.substring(7)
            : remoteAddress || "unknown";
    }

    /**
     * Extract uploader ID from request
     *
     * @param request Express request object
     * @returns Uploader ID or null
     */
    private getUploaderId(request: Request): string | null {
        const user = (request as any).user;
        return user?.id || null;
    }

    /**
     * Upload single file from buffer or Multer file
     *
     * @param file File buffer or Multer file
     * @param request Express request object
     * @param description Optional file description
     * @param options Storage options
     * @returns Upload result
     */
    async uploadFile(
        file: Buffer | Express.Multer.File,
        request: Request,
        description?: string,
        options?: FileStorageOptions,
    ): Promise<UploadFileResult> {
        const clientIp = this.getClientIP(request);
        const uploaderId = this.getUploaderId(request);
        if (!file) {
            throw HttpErrorFactory.badRequest("No file provided", BusinessCode.PARAM_INVALID);
        }

        // Extract file metadata
        const metadata = this.fileStorageService.extractMetadata(file);

        // Generate storage path
        const storagePath = this.fileStorageService.generateStoragePath(metadata, options);

        // Save file to storage
        if (Buffer.isBuffer(file)) {
            await this.fileStorageService.saveBuffer(file, storagePath, options);
        } else {
            await this.fileStorageService.saveMulterFile(file, storagePath, options);
        }

        try {
            // Build file URL based on extensionId
            const urlPath = options?.extensionId
                ? `/${options.extensionId}/uploads/${storagePath.fullPath}`
                : `/uploads/${storagePath.fullPath}`;
            const requestDomain = this.getRequestDomain(request);
            const fileUrl = await this.fileUrlService.get(urlPath, requestDomain);

            // Save to database
            const savedFile = await this.create({
                url: fileUrl,
                ip: clientIp,
                originalName: metadata.originalName,
                storageName: storagePath.fileName,
                type: metadata.type,
                mimeType: metadata.mimeType,
                size: metadata.size,
                extension: metadata.extension,
                path: storagePath.fullPath,
                description: description || null,
                uploaderId,
                extensionIdentifier: options?.extensionId || null,
            });

            return {
                id: savedFile.id,
                url: savedFile.url,
                originalName: savedFile.originalName,
                size: savedFile.size,
                mimeType: savedFile.mimeType,
                extension: savedFile.extension,
            };
        } catch (error) {
            console.error(error);
            // Clean up on error
            await this.fileStorageService.deleteFile(storagePath.fullPath, options);
            throw HttpErrorFactory.internal(
                "Failed to save file record",
                BusinessCode.INTERNAL_SERVER_ERROR,
            );
        }
    }

    /**
     * Upload multiple files
     *
     * @param files Array of files
     * @param request Express request object
     * @param description Optional file description
     * @param options Storage options
     * @returns Array of upload results
     */
    async uploadFiles(
        files: (Buffer | Express.Multer.File)[],
        request: Request,
        description?: string,
        options?: FileStorageOptions,
    ): Promise<UploadFileResult[]> {
        if (!files || files.length === 0) {
            throw HttpErrorFactory.badRequest("No files provided", BusinessCode.PARAM_INVALID);
        }

        const results: UploadFileResult[] = [];

        for (const file of files) {
            const result = await this.uploadFile(file, request, description, options);
            results.push(result);
        }

        return results;
    }

    /**
     * Upload file from remote URL
     *
     * @param url Remote file URL
     * @param request Express request object
     * @param description Optional file description
     * @param options Storage options
     * @returns Upload result
     */
    async uploadRemoteFile(
        url: string,
        request: Request,
        description?: string,
        options?: FileStorageOptions,
    ): Promise<UploadFileResult> {
        const clientIp = this.getClientIP(request);
        const uploaderId = this.getUploaderId(request);
        try {
            // Parse URL to get file name
            const urlPath = new URL(url).pathname;
            const originalName = path.basename(urlPath) || "remote-file";
            const extension = path.extname(originalName).replace(".", "").toLowerCase();

            // Determine MIME type (will be updated after download)
            const mimeType = mime.lookup(originalName) || "application/octet-stream";

            // Extract metadata
            const metadata = this.fileStorageService.extractMetadata(
                Buffer.from([]),
                originalName,
                mimeType,
            );

            // Generate storage path
            const storagePath = this.fileStorageService.generateStoragePath(metadata, options);

            // Download and save remote file
            const remoteOptions: RemoteFileOptions = { url };
            const { size } = await this.fileStorageService.saveRemoteFile(
                remoteOptions,
                storagePath,
                options,
            );

            try {
                // Build file URL based on extensionId
                const urlPath = options?.extensionId
                    ? `/${options.extensionId}/uploads/${storagePath.fullPath}`
                    : `/uploads/${storagePath.fullPath}`;
                const requestDomain = this.getRequestDomain(request);
                const fileUrl = await this.fileUrlService.get(urlPath, requestDomain);

                // Save to database
                const savedFile = await this.create({
                    url: fileUrl,
                    ip: clientIp,
                    originalName,
                    storageName: storagePath.fileName,
                    type: metadata.type,
                    mimeType: metadata.mimeType,
                    size,
                    extension,
                    path: storagePath.fullPath,
                    description: description || `Remote file from ${url}`,
                    uploaderId,
                    extensionIdentifier: options?.extensionId || null,
                });

                return {
                    id: savedFile.id,
                    url: savedFile.url,
                    originalName: savedFile.originalName,
                    size: savedFile.size,
                    mimeType: savedFile.mimeType,
                    extension: savedFile.extension,
                };
            } catch (error) {
                // Clean up on error
                await this.fileStorageService.deleteFile(storagePath.fullPath, options);
                throw error;
            }
        } catch (error) {
            throw HttpErrorFactory.internal(
                `Failed to upload remote file: ${error.message}`,
                BusinessCode.REQUEST_FAILED,
            );
        }
    }

    /**
     * Delete file by ID
     *
     * @param id File ID
     * @param options Storage options
     */
    async deleteFileById(id: string, options?: FileStorageOptions): Promise<void> {
        const file = await this.findOneById(id);

        if (!file) {
            throw HttpErrorFactory.notFound("File not found");
        }

        // Delete physical file
        await this.fileStorageService.deleteFile(file.path, options);

        // Delete database record
        await this.delete(id);
    }

    /**
     * Get file physical path
     *
     * @param id File ID
     * @param options Storage options
     * @returns Full file path
     */
    async getFilePath(id: string, options?: FileStorageOptions): Promise<string> {
        const file = await this.findOneById(id);

        if (!file) {
            throw HttpErrorFactory.notFound("File not found");
        }

        return this.fileStorageService.getFullPath(file.path, options);
    }

    /**
     * Check if file exists
     *
     * @param id File ID
     * @param options Storage options
     * @returns True if file exists
     */
    async fileExists(id: string, options?: FileStorageOptions): Promise<boolean> {
        const file = await this.findOneById(id);

        if (!file) {
            return false;
        }

        return this.fileStorageService.fileExists(file.path, options);
    }

    /**
     * Create read stream for file
     *
     * @param id File ID
     * @param options Storage options
     * @returns File read stream or null
     */
    async createReadStream(id: string, options?: FileStorageOptions) {
        const file = await this.findOneById(id);

        if (!file) {
            throw HttpErrorFactory.notFound("File not found");
        }

        return this.fileStorageService.createReadStream(file.path, options);
    }
}
