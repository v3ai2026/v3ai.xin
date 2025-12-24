import { computed, shallowReactive } from "vue";

interface ComponentConfigMap {
    [key: string]: ComponentMenuItem;
}

interface CategoryConfigMap {
    [key: string]: ComponentCategory;
}

interface ConfigModule {
    [key: string]: ComponentMenuItem | ComponentCategory | unknown;
}

/**
 * Component configuration mapping (reactive)
 */
const componentConfigMap = shallowReactive<ComponentConfigMap>({});
const categoryConfigMap = shallowReactive<CategoryConfigMap>({});

/**
 * Dynamically import component configurations
 * @param DEFAULT_DEVICE_TYPE - Device type (web/mobile)
 */
export async function importComponentConfigs(DEFAULT_DEVICE_TYPE: DecorateScene) {
    // Reset component configuration data
    Object.keys(componentConfigMap).forEach((key) => delete componentConfigMap[key]);
    Object.keys(categoryConfigMap).forEach((key) => delete categoryConfigMap[key]);

    // Dynamically import PC component configurations
    const webConfigs = import.meta.glob<ConfigModule>("../components/widgets/web/*/config.ts", {
        eager: false,
    });

    // Dynamically import Mobile component configurations
    const mobileConfigs = import.meta.glob<ConfigModule>(
        "../components/widgets/mobile/*/config.ts",
        { eager: false },
    );

    // Select configurations to process based on device type
    const configsToProcess = DEFAULT_DEVICE_TYPE === "web" ? [webConfigs] : [mobileConfigs];

    // Process each configuration collection
    for (const configs of configsToProcess) {
        for (const [path, loader] of Object.entries(configs)) {
            const match = path.match(/\/(web|mobile)\/([^/]+)\/config\.ts$/);
            if (!match) continue;

            const componentType = match[2];
            const mod = (await (loader as () => Promise<ConfigModule>)()) as ConfigModule;
            const config = Object.values(mod).find(
                (item): item is ComponentMenuItem =>
                    item !== null &&
                    item !== undefined &&
                    typeof item === "object" &&
                    "type" in item &&
                    (item as ComponentMenuItem).type === componentType,
            ) as ComponentMenuItem | undefined;

            if (config && componentType) {
                componentConfigMap[componentType] = config;
                if (config.category?.id) {
                    categoryConfigMap[config.category.id] = config.category;
                }
            }
        }
    }
}

/**
 * Get valid category information
 * Only returns categories that contain available components, sorted by specified order
 */
export const getCategories = computed(() => {
    // Get category IDs of all loaded components
    const validCategoryIds = new Set(
        Object.values(componentConfigMap)
            .map((component) => component.category?.id)
            .filter(Boolean),
    );

    // Only return categories that contain available components
    const validCategories = Object.values(categoryConfigMap).filter((category) =>
        validCategoryIds.has(category.id),
    );

    // Define category priority order: basic components first, extension components second, other categories in original order
    const categoryOrder = ["basic", "extension"];

    return validCategories.sort((a, b) => {
        const indexA = categoryOrder.indexOf(a.id);
        const indexB = categoryOrder.indexOf(b.id);

        // If both are in the priority list, sort by priority
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }

        // If only a is in the priority list, a comes first
        if (indexA !== -1 && indexB === -1) {
            return -1;
        }

        // If only b is in the priority list, b comes first
        if (indexA === -1 && indexB !== -1) {
            return 1;
        }

        // If neither is in the priority list, maintain original order
        return 0;
    });
});

/**
 * Get component list under a category
 * Sort by component's order field, smaller order values come first
 * If no order field exists, default to last position
 */
export const getCategoryComponents = computed(
    () => (categoryId: string) =>
        Object.values(componentConfigMap)
            .filter(({ category }) => category?.id === categoryId)
            .sort((a, b) => {
                // If a has no order, it comes after
                if (a.order === undefined && b.order !== undefined) return 1;
                // If b has no order, it comes after
                if (a.order !== undefined && b.order === undefined) return -1;
                // If both have order, sort by order value in ascending order
                if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
                // If neither has order, maintain original order
                return 0;
            }),
);
