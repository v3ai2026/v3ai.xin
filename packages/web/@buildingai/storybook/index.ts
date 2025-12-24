/**
 * BuildingAI Storybook Configuration
 *
 * This package provides standardized Storybook configurations for all BuildingAI projects.
 * It includes common addons, settings, and best practices to ensure consistency across projects.
 */

import { sharedConfig } from "./main";
import { sharedPreview } from "./preview";

export { default as mainConfig, sharedConfig } from "./main";
export { default as previewConfig, sharedPreview } from "./preview";

// Re-export types for convenience
export type { StorybookConfig } from "@storybook-vue/nuxt";
export type { Preview } from "@storybook-vue/nuxt";

/**
 * Create a custom Storybook configuration by extending the default configuration
 *
 * @param customConfig - Custom configuration to merge with defaults
 * @returns Merged Storybook configuration
 */
export function createStorybookConfig(
    customConfig: Partial<import("@storybook-vue/nuxt").StorybookConfig> = {},
) {
    const stories = Array.isArray(sharedConfig.stories)
        ? [
              ...sharedConfig.stories,
              ...(Array.isArray(customConfig.stories) ? customConfig.stories : []),
          ]
        : [...(Array.isArray(customConfig.stories) ? customConfig.stories : [])];

    const addons = Array.isArray(sharedConfig.addons)
        ? [
              ...sharedConfig.addons,
              ...(Array.isArray(customConfig.addons) ? customConfig.addons : []),
          ]
        : [...(Array.isArray(customConfig.addons) ? customConfig.addons : [])];

    const baseFramework = typeof sharedConfig.framework === "object" ? sharedConfig.framework : {};
    const customFramework =
        typeof customConfig.framework === "object" ? customConfig.framework : {};

    const baseFrameworkWithOptions =
        typeof baseFramework === "object" && baseFramework !== null && "options" in baseFramework;
    const frameworkOptions = baseFrameworkWithOptions
        ? ((baseFramework as any).options as Record<string, any>)
        : {};

    return {
        ...sharedConfig,
        ...customConfig,
        stories,
        addons,
        framework: {
            ...baseFramework,
            ...customFramework,
            options: {
                ...frameworkOptions,
                ...(typeof customFramework === "object" &&
                customFramework !== null &&
                "options" in customFramework
                    ? ((customFramework as any).options as Record<string, any>)
                    : {}),
            },
        },
    };
}

/**
 * Create a custom preview configuration by extending the default configuration
 *
 * @param customConfig - Custom preview configuration to merge with defaults
 * @returns Merged preview configuration
 */
export function createPreviewConfig(
    customConfig: Partial<import("@storybook-vue/nuxt").Preview> = {},
) {
    const defaultParameters = sharedPreview.parameters || {};
    const customParameters = customConfig.parameters || {};

    const decoratorsArray = Array.isArray(sharedPreview.decorators) ? sharedPreview.decorators : [];
    const customDecoratorsArray = Array.isArray(customConfig.decorators)
        ? customConfig.decorators
        : [];

    return {
        ...sharedPreview,
        ...customConfig,
        parameters: {
            ...defaultParameters,
            ...customParameters,
            controls: {
                ...(defaultParameters.controls || {}),
                ...(customParameters.controls || {}),
            },
            docs: {
                ...(defaultParameters.docs || {}),
                ...(customParameters.docs || {}),
            },
            viewport: {
                ...(defaultParameters.viewport || {}),
                ...(customParameters.viewport || {}),
            },
            backgrounds: {
                ...(defaultParameters.backgrounds || {}),
                ...(customParameters.backgrounds || {}),
            },
        },
        decorators: [...decoratorsArray, ...customDecoratorsArray],
        argTypes: {
            ...(sharedPreview.argTypes || {}),
            ...(customConfig.argTypes || {}),
        },
    };
}
