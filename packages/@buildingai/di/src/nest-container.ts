import "reflect-metadata";

import { ApplicationError } from "@buildingai/errors";
import type { INestApplicationContext } from "@nestjs/common";

/**
 * NestJS application container error class
 */
class NestContainerError extends ApplicationError {
    constructor(message: string, extra?: Record<string, any>) {
        super(`[NestContainer] ${message}`, {
            level: "error",
            tags: { module: "di", component: "NestContainer" },
            extra,
        });
        this.name = "NestContainerError";
    }
}

/**
 * Service identifier type
 */
export type ServiceIdentifier<T = unknown> = new (...args: any[]) => T;

/**
 * Container options configuration
 */
interface ContainerOptions {
    /** Whether to enable strict mode, throws error if container is not initialized in strict mode */
    strict?: boolean;
    /** Whether to enable debug logging */
    debug?: boolean;
}

/**
 * NestJS global container management class
 *
 * Provides global access to NestJS application container with support for:
 * - Type-safe service retrieval
 * - Container state checking
 * - Circular dependency detection
 * - Debug mode
 *
 * @example
 * ```typescript
 * // Set container on application startup
 * const app = await NestFactory.create(AppModule);
 * NestContainer.set(app);
 *
 * // Get service anywhere
 * const userService = NestContainer.get(UserService);
 *
 * // Check if service exists
 * if (NestContainer.has(UserService)) {
 *   // ...
 * }
 * ```
 */
class NestContainerClass {
    /** NestJS application container instance */
    private container: INestApplicationContext | null = null;

    /** Container configuration options */
    private options: ContainerOptions = {
        strict: true,
        debug: false,
    };

    /** Service resolution stack for detecting circular dependencies */
    private readonly resolutionStack: string[] = [];

    /**
     * Set global NestJS application container
     *
     * @param container NestJS application container instance
     * @param options Container configuration options
     * @throws {NestContainerError} If container has already been set
     */
    set(container: INestApplicationContext, options?: ContainerOptions): void {
        if (this.container && this.options.strict) {
            throw new NestContainerError(
                "Container already initialized. Use reset() first if you need to reinitialize.",
                { currentOptions: this.options },
            );
        }

        this.container = container;
        if (options) {
            this.options = { ...this.options, ...options };
        }

        if (this.options.debug) {
            console.log("[NestContainer] Container initialized successfully");
        }
    }

    /**
     * Get global NestJS application container
     *
     * @returns NestJS application container instance
     * @throws {NestContainerError} If container is not initialized
     */
    getContainer(): INestApplicationContext {
        if (!this.container) {
            throw new NestContainerError(
                "Container not initialized. Call NestContainer.set() first in your bootstrap function.",
                { isInitialized: false },
            );
        }
        return this.container;
    }

    /**
     * Check if container is initialized
     *
     * @returns True if container is initialized, false otherwise
     */
    isInitialized(): boolean {
        return this.container !== null;
    }

    /**
     * Get service instance from container
     *
     * @template T Service type
     * @param serviceClass Service class constructor
     * @param options Get options
     * @param options.strict Whether to use strict mode, returns undefined instead of throwing error when service doesn't exist if false
     * @returns Service instance
     * @throws {NestContainerError} If container is not initialized or service doesn't exist (in strict mode)
     *
     * @example
     * ```typescript
     * const userService = NestContainer.get(UserService);
     * const optionalService = NestContainer.get(OptionalService, { strict: false });
     * ```
     */
    get<T>(serviceClass: ServiceIdentifier<T>, options?: { strict?: boolean }): T {
        const container = this.getContainer();
        const serviceName = serviceClass.name;
        const strict = options?.strict ?? this.options.strict;

        // Detect circular dependencies
        if (this.resolutionStack.includes(serviceName)) {
            throw new NestContainerError(
                `Circular dependency detected: ${this.resolutionStack.join(" -> ")} -> ${serviceName}`,
                {
                    serviceName,
                    resolutionStack: [...this.resolutionStack],
                    circularDependency: true,
                },
            );
        }

        this.resolutionStack.push(serviceName);

        try {
            if (this.options.debug) {
                console.log(`[NestContainer] Resolving service: ${serviceName}`);
            }

            const instance = strict
                ? container.get(serviceClass)
                : container.get(serviceClass, { strict: false });

            if (!instance && strict) {
                throw new NestContainerError(
                    `Service ${serviceName} not found in container. Make sure it's provided in a module.`,
                    { serviceName, strict },
                );
            }

            return instance;
        } catch (error) {
            if (error instanceof NestContainerError) {
                throw error;
            }
            throw new NestContainerError(
                `Failed to resolve service ${serviceName}: ${error instanceof Error ? error.message : String(error)}`,
                {
                    serviceName,
                    originalError: error instanceof Error ? error.message : String(error),
                    resolutionStack: [...this.resolutionStack],
                },
            );
        } finally {
            this.resolutionStack.pop();
        }
    }

    /**
     * Check if service is registered in container
     *
     * @template T Service type
     * @param serviceClass Service class constructor
     * @returns True if service is registered, false otherwise
     *
     * @example
     * ```typescript
     * if (NestContainer.has(UserService)) {
     *   const userService = NestContainer.get(UserService);
     * }
     * ```
     */
    has<T>(serviceClass: ServiceIdentifier<T>): boolean {
        if (!this.isInitialized()) {
            return false;
        }

        try {
            const instance = this.get(serviceClass, { strict: false });
            return instance !== undefined;
        } catch {
            return false;
        }
    }

    /**
     * Optionally get service instance
     * Returns undefined instead of throwing error if service doesn't exist
     *
     * @template T Service type
     * @param serviceClass Service class constructor
     * @returns Service instance or undefined
     *
     * @example
     * ```typescript
     * const service = NestContainer.resolve(OptionalService);
     * if (service) {
     *   service.doSomething();
     * }
     * ```
     */
    resolve<T>(serviceClass: ServiceIdentifier<T>): T | undefined {
        try {
            return this.get(serviceClass, { strict: false });
        } catch {
            return undefined;
        }
    }

    /**
     * Get multiple service instances in batch
     *
     * @param serviceClasses Array of service class constructors
     * @returns Array of service instances
     * @throws {NestContainerError} If any service retrieval fails
     *
     * @example
     * ```typescript
     * const [userService, authService] = NestContainer.getMany([
     *   UserService,
     *   AuthService
     * ]);
     * ```
     */
    getMany<T extends ServiceIdentifier[]>(
        serviceClasses: [...T],
    ): { [K in keyof T]: T[K] extends ServiceIdentifier<infer U> ? U : never } {
        return serviceClasses.map((serviceClass) => this.get(serviceClass)) as any;
    }

    /**
     * Reset container
     * Clears container reference and resolution stack
     *
     * @example
     * ```typescript
     * // Reset container in tests
     * afterEach(() => {
     *   NestContainer.reset();
     * });
     * ```
     */
    reset(): void {
        this.container = null;
        this.resolutionStack.length = 0;

        if (this.options.debug) {
            console.log("[NestContainer] Container reset");
        }
    }

    /**
     * Set container options
     *
     * @param options Container configuration options
     */
    setOptions(options: Partial<ContainerOptions>): void {
        this.options = { ...this.options, ...options };
    }

    /**
     * Get current container options
     *
     * @returns Container configuration options
     */
    getOptions(): Readonly<ContainerOptions> {
        return { ...this.options };
    }
}

/**
 * NestJS global container singleton instance
 *
 * @example
 * ```typescript
 * // Set container
 * NestContainer.set(app);
 *
 * // Get service
 * const service = NestContainer.get(MyService);
 *
 * // Check service
 * if (NestContainer.has(MyService)) {
 *   // ...
 * }
 * ```
 */
export const NestContainer = new NestContainerClass();

/**
 * Convenience function: Set global container
 *
 * @param container NestJS application container instance
 * @param options Container configuration options
 *
 * @deprecated Recommend using NestContainer.set() directly
 */
export function setGlobalContainer(
    container: INestApplicationContext,
    options?: ContainerOptions,
): void {
    NestContainer.set(container, options);
}

/**
 * Convenience function: Get global container
 *
 * @returns NestJS application container instance
 *
 * @deprecated Recommend using NestContainer.getContainer() directly
 */
export function getGlobalContainer(): INestApplicationContext {
    return NestContainer.getContainer();
}

/**
 * Convenience function: Get service instance from global container
 *
 * @template T Service type
 * @param serviceClass Service class constructor
 * @returns Service instance
 *
 * @deprecated Recommend using NestContainer.get() directly
 */
export function getService<T>(serviceClass: ServiceIdentifier<T>): T {
    return NestContainer.get(serviceClass);
}
