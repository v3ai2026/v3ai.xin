import { AppConfig } from "@buildingai/config";
import { ExtensionDownloadType, ExtensionStatus } from "@buildingai/constants";
import { DICT_GROUP_KEYS, DICT_KEYS } from "@buildingai/constants/server/dict-key.constant";
import {
    ApplicationListItem,
    getExtensionEnabledStatus,
    isExtensionCompatible,
} from "@buildingai/core/modules";
import { ExtensionDetailType, ExtensionsService, PlatformInfo } from "@buildingai/core/modules";
import { DictService } from "@buildingai/dict";
import { HttpErrorFactory } from "@buildingai/errors";
import { createHttpClient, createHttpErrorMessage, HttpClientInstance } from "@buildingai/utils";
import { Injectable, Logger } from "@nestjs/common";
import * as semver from "semver";

/**
 * Extension market service
 */
@Injectable()
export class ExtensionMarketService {
    private readonly logger = new Logger(ExtensionMarketService.name);
    private readonly httpClient: HttpClientInstance;
    private platformSecret: string | null = null;

    constructor(
        private readonly dictService: DictService,
        private readonly extensionsService: ExtensionsService,
    ) {
        this.httpClient = createHttpClient({
            baseURL:
                (process.env.EXTENSION_API_URL || "https://cloud.buildingai.cc/api") + "/market",
            timeout: 20000,
            retryConfig: {
                retries: 3,
                retryDelay: 1000,
            },
            logConfig: {
                enableErrorLog: true,
            },
            headers: {
                Domain: process.env.APP_DOMAIN,
                "platform-version": AppConfig.version,
            },
        });

        // 添加请求拦截器,动态获取平台密钥
        this.httpClient.interceptors.request.use(async (config) => {
            // 如果内存中没有，尝试从数据库加载一次
            if (!this.platformSecret) {
                this.platformSecret = await this.dictService.get<string | null>(
                    DICT_KEYS.PLATFORM_SECRET,
                    null,
                    DICT_GROUP_KEYS.APPLICATION,
                );
            }

            if (this.platformSecret) {
                config.headers["X-API-Key"] = this.platformSecret;
            }

            return config;
        });
    }

    isVersionInRange(version: string, range: string): boolean {
        if (!semver.valid(version)) return false;

        if (!semver.validRange(range)) return false;

        return semver.satisfies(version, range);
    }

    /**
     * Get platform info
     */
    async getPlatformInfo(platformSecret?: string): Promise<PlatformInfo | null> {
        const originalSecret = this.platformSecret;

        try {
            if (platformSecret) {
                this.platformSecret = platformSecret;
            }

            const response = await this.httpClient.get("/getPlatform");
            return response.data;
        } catch (error) {
            if (platformSecret) {
                this.platformSecret = originalSecret;
            }
            const errorMessage = createHttpErrorMessage(error);
            this.logger.error(`Failed to get platform info: ${errorMessage}`, error);
            return null;
        }
    }

    /**
     * Get application list
     */
    async getApplicationList(): Promise<ApplicationListItem[]> {
        try {
            const response = await this.httpClient.get("/lists");
            return response.data;
        } catch (error) {
            const errorMessage = createHttpErrorMessage(error);
            this.logger.error(`Failed to get application list: ${errorMessage}`, error);
            throw HttpErrorFactory.badRequest(error.response?.data?.message);
        }
    }

    /**
     * Get application detail
     */
    async getApplicationDetail(identifier: string): Promise<ExtensionDetailType> {
        try {
            const response = await this.httpClient.get(`/detail/${identifier}`);
            return response.data;
        } catch (error) {
            const errorMessage = createHttpErrorMessage(error);
            this.logger.error(
                `Failed to get application detail for ${identifier}: ${errorMessage}`,
                error,
            );
            throw HttpErrorFactory.badRequest(error.response?.data?.message);
        }
    }

    /**
     * Get application versions list
     */
    async getApplicationVersions(identifier: string): Promise<
        {
            version: string;
            explain: string;
            createdAt: string;
        }[]
    > {
        try {
            const response = await this.httpClient.get(`/versions/${identifier}`);
            return response.data;
        } catch (error) {
            const errorMessage = createHttpErrorMessage(error);
            this.logger.error(
                `Failed to get application versions for ${identifier}: ${errorMessage}`,
                error,
            );
            throw HttpErrorFactory.badRequest(error.response?.data?.message);
        }
    }

    /**
     * Download application
     */
    async downloadApplication(
        identifier: string,
        version: string,
        type: ExtensionDownloadType,
    ): Promise<{
        version: string;
        explain: string;
        url: string;
    }> {
        try {
            const response = await this.httpClient.post(
                `/download/${identifier}/${version}/${type}`,
            );
            return response.data;
        } catch (error) {
            const errorMessage = createHttpErrorMessage(error);
            this.logger.error(
                `Failed to download application ${identifier}@${version}: ${errorMessage}`,
                error,
            );
            throw HttpErrorFactory.badRequest(error.response?.data?.message);
        }
    }

    /**
     * Uninstall application
     */
    async uninstallApplication(identifier: string, version: string) {
        try {
            const response = await this.httpClient.post(`/uninstall/${identifier}/${version}`);
            return response.data;
        } catch (error) {
            const errorMessage = createHttpErrorMessage(error);
            this.logger.error(
                `Failed to uninstall application ${identifier}@${version}: ${errorMessage}`,
                error,
            );
            throw HttpErrorFactory.badRequest(error.response?.data?.message);
        }
    }

    /**
     * Get extension list with market data if platform secret is configured
     * Handles both scenarios: with/without platform secret
     */
    async getMixedApplicationList() {
        const platformSecret = await this.dictService.get<string | null>(
            DICT_KEYS.PLATFORM_SECRET,
            null,
            DICT_GROUP_KEYS.APPLICATION,
        );

        const installedExtensions = await this.extensionsService.findAll();

        // Fetch market list only if platform secret is configured
        let extensionList: ApplicationListItem[] = [];
        if (platformSecret) {
            try {
                extensionList = await this.getApplicationList();
            } catch (error) {
                this.logger.error(`Failed to get application list: ${error}`);
                extensionList = [];
            }
        }

        const installedIdentifiers = new Set(installedExtensions.map((ext) => ext.identifier));

        // Create a map for quick lookup of market versions
        const marketVersionMap = new Map(
            extensionList.map((item) => [item.identifier, item.version]),
        );

        // Map uninstalled market extensions
        const marketExtensions = extensionList
            .filter((item) => !installedIdentifiers.has(item.identifier))
            .map((item) => ({
                id: item.id || null,
                name: item.name,
                identifier: item.identifier,
                version: item.version,
                description: item.description,
                isCompatible: item.isCompatible || null,
                icon: item.icon,
                type: item.type,
                supportTerminal: item.supportTerminal,
                isLocal: false,
                status: ExtensionStatus.DISABLED,
                author: item.author,
                homepage: "",
                documentation: "",
                config: null,
                isInstalled: false,
                createdAt: new Date(item.createdAt),
                updatedAt: new Date(item.updatedAt),
                purchasedAt: new Date(item.purchasedAt),
                latestVersion: item.version,
                hasUpdate: false,
            }));

        // Map installed extensions with update check and compatibility check
        const installedExtensionsList = await Promise.all(
            installedExtensions.map(async (ext) => {
                let hasUpdate = false;
                let latestVersion: string | null = null;

                // Only check updates for non-local extensions
                if (!ext.isLocal) {
                    const marketVersion = marketVersionMap.get(ext.identifier);
                    if (marketVersion) {
                        latestVersion = marketVersion;
                        // Use semver to compare versions
                        if (semver.valid(marketVersion) && semver.valid(ext.version)) {
                            hasUpdate = semver.gt(marketVersion, ext.version);
                        }
                    }
                }

                // Check version compatibility for installed extensions
                const isCompatible = await isExtensionCompatible(ext.identifier);

                // Get enabled status from extensions.json (true -> 1, false -> 0)
                const enabledStatus = await getExtensionEnabledStatus(ext.identifier);
                const status =
                    enabledStatus === null
                        ? ext.status
                        : enabledStatus
                          ? ExtensionStatus.ENABLED
                          : ExtensionStatus.DISABLED;

                return {
                    ...ext,
                    status,
                    isInstalled: true,
                    isCompatible,
                    latestVersion,
                    hasUpdate,
                };
            }),
        );

        const mergedList = installedExtensionsList.concat(marketExtensions);

        return mergedList;
    }
}
