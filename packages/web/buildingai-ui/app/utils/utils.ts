/**
 * @fileoverview Utility functions for common operations
 * @description Collection of helper functions for object manipulation, string conversion, and value comparison
 *
 * @author BuildingAI Teams
 */

/**
 * Convert key-value string format to object
 * @description Parses strings in 'key=value' format (one per line or comma-separated)
 * @param str Input string in 'key=value' format, one per line
 * @returns Object with key-value pairs
 * @example
 *   const str = "name=John\nage=25\ncity=NYC"
 *   console.log(convertToObject(str)) // { name: "John", age: "25", city: "NYC" }
 */
export function convertToObject(str: string): Record<string, string> {
    if (!str || !str.trim() || str === "") return {};
    const obj: Record<string, string> = {};

    // Split by lines
    const lines = str.split("\n");

    for (const line of lines) {
        // Each line may contain multiple key=value pairs (separated by commas)
        const pairs = line.split(",");

        for (const pair of pairs) {
            const [key, value] = pair.split("=").map((item) => item.trim());
            if (key && value !== undefined) {
                obj[key] = value;
            }
        }
    }

    return obj;
}

/**
 * Convert object to key-value string format
 * @description Converts an object to 'key=value' string format
 * @param obj Object to convert
 * @returns String in 'key=value' format, one per line
 * @example
 *   const obj = { name: "John", age: "25", city: "NYC" }
 *   console.log(objectToKvString(obj)) // "name=John\nage=25\ncity=NYC"
 */
export function objectToKvString(obj: Record<string, string>): string {
    return Object.entries(obj)
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");
}

/** Utility type to extract values from an object type */
export type ObjectValues<T> = T[keyof T];

/**
 * Pick specified keys from an object and return a new object
 * @description Creates a new object containing only the specified keys from the source object
 * @param data Source object
 * @param keys Array of keys to extract
 * @returns New object containing only the specified keys
 * @example
 *   const user = { name: 'Alice', age: 25, city: 'NYC' }
 *   console.log(pick(user, ['name', 'city'])) // { name: 'Alice', city: 'NYC' }
 */
export function pick<Data extends object, Keys extends keyof Data>(
    data: Data,
    keys: Keys[],
): Pick<Data, Keys> {
    const result = {} as Pick<Data, Keys>;

    for (const key of keys) {
        result[key] = data[key];
    }

    return result;
}

/**
 * Omit specified keys from an object and return a new object
 * @description Creates a new object excluding the specified keys from the source object
 * @param data Source object
 * @param keys Array of keys to exclude
 * @returns New object without the specified keys
 * @example
 *   const user = { name: 'Alice', age: 25, city: 'NYC' }
 *   console.log(omit(user, ['age'])) // { name: 'Alice', city: 'NYC' }
 */
export function omit<Data extends object, Keys extends keyof Data>(
    data: Data,
    keys: Keys[],
): Omit<Data, Keys> {
    const result = { ...data };

    for (const key of keys) {
        delete result[key];
    }

    return result as Omit<Data, Keys>;
}

/**
 * Get value from object by path
 * @description Retrieves a value from an object using a dot-notation path or array of keys
 * @param object Target object
 * @param path Property path, can be a string or array
 * @param defaultValue Default value if path doesn't exist
 * @returns Target value or default value
 * @example
 *   const user = { address: { city: 'NYC' } }
 *   console.log(get(user, 'address.city', 'Unknown')) // 'NYC'
 *   console.log(get(user, 'address.country', 'Unknown')) // 'Unknown'
 */
export function get(
    object: Record<string, unknown> | undefined,
    path: (string | number)[] | string,
    defaultValue?: unknown,
): unknown {
    if (typeof path === "string") {
        path = path.split(".").map((key) => {
            const numKey = Number(key);
            return Number.isNaN(numKey) ? key : numKey;
        });
    }

    let result: unknown = object;

    for (const key of path) {
        if (result === undefined || result === null) {
            return defaultValue;
        }

        result = (result as Record<string | number, unknown>)[key];
    }

    return result !== undefined ? result : defaultValue;
}

/**
 * Set value in object by path
 * @description Sets a value in an object using a dot-notation path or array of keys
 * @param object Target object
 * @param path Property path, can be a string or array
 * @param value Value to set
 * @example
 *   const newUser = { name: 'Alice', address: {} }
 *   set(newUser, 'address.city', 'NYC')
 *   console.log(newUser) // { name: 'Alice', address: { city: 'NYC' } }
 */
export function set(
    object: Record<string, unknown>,
    path: (string | number)[] | string,
    value: unknown,
): void {
    if (typeof path === "string") {
        path = path.split(".").map((key) => {
            const numKey = Number(key);
            return Number.isNaN(numKey) ? key : numKey;
        });
    }

    path.reduce((acc: Record<string | number, unknown>, key, i) => {
        if (acc[key] === undefined) acc[key] = {};
        if (i === path.length - 1) acc[key] = value;
        return acc[key] as Record<string | number, unknown>;
    }, object);
}

/**
 * Attempt to convert value to number
 * @description Tries to parse a value as a number, returns original value if parsing fails
 * @param val Input value
 * @returns Converted number or original value
 * @example
 *   console.log(looseToNumber('42.5')) // 42.5
 *   console.log(looseToNumber('abc')) // "abc"
 *   console.log(looseToNumber(123)) // 123
 */
export function looseToNumber(val: unknown): unknown {
    const n = Number.parseFloat(String(val));
    return Number.isNaN(n) ? val : n;
}

/**
 * Compare two values for equality
 * @description Compares two values using various comparison strategies
 * @param value First value
 * @param currentValue Second value
 * @param comparator Comparison method, can be a string path or custom comparison function
 * @returns Whether the values are equal
 * @example
 *   console.log(compare('hello', 'hello')) // true
 *   console.log(compare({ name: 'Alice' }, { name: 'Alice' })) // true
 *   console.log(compare({ user: { id: 1 } }, { user: { id: 1 } }, 'user.id')) // true
 *   console.log(compare(1, 2, (a, b) => a > b)) // false
 */
export function compare<T>(
    value?: T,
    currentValue?: T,
    comparator?: string | ((a: T, b: T) => boolean),
) {
    if (value === undefined || currentValue === undefined) {
        return false;
    }

    if (typeof value === "string") {
        return value === currentValue;
    }

    if (typeof comparator === "function") {
        return comparator(value, currentValue);
    }

    if (typeof comparator === "string") {
        return (
            get(value as Record<string, unknown>, comparator) ===
            get(currentValue as Record<string, unknown>, comparator)
        );
    }

    return JSON.stringify(value) === JSON.stringify(currentValue);
}
