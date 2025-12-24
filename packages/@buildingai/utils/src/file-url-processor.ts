/**
 * File URL processing utility
 *
 * Provides high-performance utilities for processing file URLs while avoiding
 * heavy loops and recursion that may cause performance issues.
 */
export class FileUrlProcessorUtil {
    /**
     * Maximum concurrency for batch URL processing
     */
    private static readonly MAX_CONCURRENT_REQUESTS = 10;

    /**
     * Cache of processed URLs to avoid duplicate work
     */
    private static readonly urlCache = new Map<string, string>();

    /**
     * Batch process a list of URLs
     *
     * @param urls List of URLs to process
     * @param processor Asynchronous URL processor
     * @returns Processed URLs in original order
     */
    static async batchProcessUrls(
        urls: string[],
        processor: (url: string) => Promise<string>,
    ): Promise<string[]> {
        if (!urls || urls.length === 0) {
            return [];
        }

        // De-duplicate first
        const uniqueUrls = [...new Set(urls)];
        const results = new Map<string, string>();

        // Process in chunks to limit concurrency
        for (let i = 0; i < uniqueUrls.length; i += this.MAX_CONCURRENT_REQUESTS) {
            const batch = uniqueUrls.slice(i, i + this.MAX_CONCURRENT_REQUESTS);

            const batchPromises = batch.map(async (url) => {
                // Check cache
                if (this.urlCache.has(url)) {
                    return { url, result: this.urlCache.get(url)! };
                }

                try {
                    const result = await processor(url);
                    // Cache result
                    this.urlCache.set(url, result);
                    return { url, result };
                } catch (error) {
                    // On failure, return original URL
                    console.error(error);
                    return { url, result: url };
                }
            });

            const batchResults = await Promise.all(batchPromises);
            batchResults.forEach(({ url, result }) => {
                results.set(url, result);
            });
        }

        // Return results in original order
        return urls.map((url) => results.get(url) || url);
    }

    /**
     * Cleanup URL cache
     *
     * @param maxSize Maximum cache size; when exceeded, keep half of the newest
     */
    static cleanupCache(maxSize: number = 1000): void {
        if (this.urlCache.size > maxSize) {
            const entries = Array.from(this.urlCache.entries());
            const keepCount = Math.floor(maxSize / 2);

            this.urlCache.clear();

            // Keep the newest half
            entries.slice(-keepCount).forEach(([key, value]) => {
                this.urlCache.set(key, value);
            });
        }
    }

    /**
     * Get cache statistics
     */
    static getCacheStats(): { size: number; hitRate?: number } {
        return {
            size: this.urlCache.size,
            // Optional: add hit rate tracking
        };
    }

    /**
     * Clear all cache entries
     */
    static clearCache(): void {
        this.urlCache.clear();
    }

    /**
     * Check whether a field path matches a target path
     *
     * @param fieldPath Field path (supports * and ** wildcards)
     * @param targetPath Target path
     * @returns Whether it matches
     *
     * @example
     * - "avatar" matches "avatar"
     * - "*.avatar" matches "user.avatar", "item.avatar"
     * - "**.avatar" matches "avatar" (root), "user.avatar", "data.user.avatar", "items.0.user.avatar"
     * - "items.*.avatar" matches "items.0.avatar", "items.user.avatar"
     */
    static isFieldPathMatch(fieldPath: string, targetPath: string): boolean {
        if (fieldPath === targetPath) {
            return true;
        }

        // Wildcard matching
        if (fieldPath.includes("*")) {
            // Handle deep wildcard **
            if (fieldPath.includes("**")) {
                // Special handling for **.fieldName: match any depth including root
                if (fieldPath.startsWith("**.")) {
                    const fieldName = fieldPath.substring(3); // strip "**."
                    // Match at root level or any depth
                    const patterns = [
                        `^${fieldName}$`, // root level
                        `^.*\\.${fieldName}$`, // any depth
                    ];
                    return patterns.some((pattern) => new RegExp(pattern).test(targetPath));
                }

                // Other ** wildcard cases
                const regexPattern = fieldPath
                    .replace(/\*\*/g, "DOUBLE_WILDCARD") // temporary replacement
                    .replace(/\*/g, "[^.]+") // single wildcard matches one level
                    .replace(/DOUBLE_WILDCARD/g, ".*"); // double wildcard matches any depth

                const regex = new RegExp("^" + regexPattern + "$");
                return regex.test(targetPath);
            }

            // Handle single-level wildcard *
            const regex = new RegExp("^" + fieldPath.replace(/\*/g, "[^.]+") + "$");
            return regex.test(targetPath);
        }

        return false;
    }

    /**
     * Flatten an object and extract all possible field paths
     *
     * @param obj Input object
     * @param prefix Path prefix
     * @returns Mapping of field paths
     */
    static flattenObject(
        obj: any,
        prefix: string = "",
    ): Map<string, { value: any; parent: any; key: string }> {
        const result = new Map();

        if (!obj || typeof obj !== "object") {
            return result;
        }

        if (Array.isArray(obj)) {
            obj.forEach((item, index) => {
                const currentPath = prefix ? `${prefix}.${index}` : `${index}`;
                if (item && typeof item === "object") {
                    const nested = this.flattenObject(item, currentPath);
                    nested.forEach((value, key) => {
                        result.set(key, value);
                    });
                } else {
                    result.set(currentPath, { value: item, parent: obj, key: index });
                }
            });
        } else {
            Object.keys(obj).forEach((key) => {
                const currentPath = prefix ? `${prefix}.${key}` : key;
                const value = obj[key];

                if (value && typeof value === "object") {
                    const nested = this.flattenObject(value, currentPath);
                    nested.forEach((nestedValue, nestedKey) => {
                        result.set(nestedKey, nestedValue);
                    });
                } else {
                    result.set(currentPath, { value, parent: obj, key });
                }
            });
        }

        return result;
    }

    /**
     * High-performance field matching and processing
     *
     * @param data Input data object
     * @param fieldPatterns Field patterns to match
     * @param processor Async processor for matched field values
     * @returns Processed data object
     */
    static async processFieldsEfficiently(
        data: any,
        fieldPatterns: string[],
        processor: (value: string) => Promise<string>,
    ): Promise<any> {
        if (!data || typeof data !== "object" || fieldPatterns.length === 0) {
            return data;
        }

        // Flatten to get all field paths
        const flattenedFields = this.flattenObject(data);

        // Collect fields to process
        const fieldsToProcess: Array<{
            path: string;
            value: string;
            parent: any;
            key: string | number;
        }> = [];

        flattenedFields.forEach(({ value, parent, key }, path) => {
            if (typeof value === "string" && value) {
                // Check if matches any field pattern
                const matches = fieldPatterns.some((pattern) =>
                    this.isFieldPathMatch(pattern, path),
                );

                if (matches) {
                    fieldsToProcess.push({ path, value, parent, key });
                }
            }
        });

        // Batch process all matched fields
        if (fieldsToProcess.length > 0) {
            const values = fieldsToProcess.map((field) => field.value);
            const processedValues = await this.batchProcessUrls(values, processor);

            // Update original data in place
            fieldsToProcess.forEach((field, index) => {
                field.parent[field.key] = processedValues[index];
            });
        }

        return data;
    }
}
