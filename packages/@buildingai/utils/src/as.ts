/**
 * as.ts
 * Universal type conversion utilities (TypeScript + runtime safety)
 * Pure ES2015 module syntax without namespace
 */

/** Ensure return value is an array */
export function asArray<T>(value: T | T[] | undefined | null): T[] {
    if (value == null) return [];
    return Array.isArray(value) ? value : [value];
}

/** Ensure return value is a string */
export function asString(value: any, fallback = ""): string {
    if (typeof value === "string") return value;
    if (value == null) return fallback;
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

/** Ensure return value is a number */
export function asNumber(value: any, fallback = 0): number {
    if (typeof value === "number" && !isNaN(value)) return value;
    const num = Number(value);
    return isNaN(num) ? fallback : num;
}

/** Ensure return value is a boolean */
export function asBoolean(value: any, truthyValues: any[] = ["true", "1", 1, true]): boolean {
    return truthyValues.includes(value);
}

/** Ensure return value is an object */
export function asObject<T extends object>(value: any, fallback: T = {} as T): T {
    if (value && typeof value === "object" && !Array.isArray(value)) return value;
    return fallback;
}

/** Ensure return value is a Date */
export function asDate(value: any, fallback: Date = new Date(0)): Date {
    const d = new Date(value);
    return isNaN(d.getTime()) ? fallback : d;
}

/** Attempt JSON parsing */
export function asJson<T = any>(value: any, fallback: T = {} as T): T {
    if (typeof value === "object" && value !== null) return value as T;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

/** Ensure return value is a function */
export function asFunc<T extends (...args: any[]) => any>(value: any, fallback: T): T {
    return typeof value === "function" ? value : fallback;
}

/** Ensure value is non-null */
export function asDefined<T>(
    value: T | undefined | null,
    fallback: NonNullable<T>,
): NonNullable<T> {
    return value == null ? fallback : (value as NonNullable<T>);
}

/** If value is a Promise, await result; otherwise return directly */
export async function asResolved<T>(value: T | Promise<T>): Promise<T> {
    return await Promise.resolve(value);
}

/** Ensure return value is a Map */
export function asMap<K, V>(value: any, fallback = new Map<K, V>()): Map<K, V> {
    return value instanceof Map ? value : fallback;
}

/** Ensure return value is a Set */
export function asSet<T>(value: any, fallback = new Set<T>()): Set<T> {
    return value instanceof Set ? value : fallback;
}

/** Convert any value to an Error object */
export function asError(value: any): Error {
    if (value instanceof Error) return value;
    if (typeof value === "string") return new Error(value);
    try {
        return new Error(JSON.stringify(value));
    } catch {
        return new Error(String(value));
    }
}

/** Ensure value is a plain object (not array or function) */
export function asPlainObject(value: any): Record<string, any> {
    if (Object.prototype.toString.call(value) === "[object Object]") return value;
    return {};
}

/** Convert to Record type */
export function asRecord<T = any>(value: any, fallback: Record<string, T> = {}): Record<string, T> {
    return typeof value === "object" && !Array.isArray(value) && value !== null
        ? (value as Record<string, T>)
        : fallback;
}

/** Ensure value is in enum (or specified collection) */
export function asOneOf<T>(value: any, options: readonly T[], fallback: T): T {
    return options.includes(value) ? value : fallback;
}

/** Null-safe access */
export function asSafe<T, R>(value: T | undefined | null, fn: (v: T) => R, fallback: R): R {
    try {
        return value != null ? fn(value) : fallback;
    } catch {
        return fallback;
    }
}

/** Type guard: is callable */
export function isCallable(value: any): value is (...args: any[]) => any {
    return typeof value === "function";
}

/** Type guard: is Promise */
export function isPromise<T = any>(value: any): value is Promise<T> {
    return !!value && typeof value.then === "function";
}
