/**
 * Merge form data
 * @description Merges form data from source into target
 * @param target Target object
 * @param source Source object
 * @returns Merged object
 */

export function useFormData<T extends Record<string, any>, U extends Partial<T>>(
    target: T,
    source: U,
): T {
    Object.keys(target).forEach((key) => {
        const typedKey = key as keyof T;
        const value = source[typedKey];

        if (value !== undefined) {
            if (typeof value === "object" && value !== null) {
                if (Object.keys(value).length > 0) {
                    target[typedKey] = value as T[keyof T];
                }
            } else {
                target[typedKey] = value as T[keyof T];
            }
        }
    });
    return target;
}
