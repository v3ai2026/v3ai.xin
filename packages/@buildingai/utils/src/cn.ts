import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function for merging class names
 * Combines clsx and tailwind-merge for optimal class name handling
 *
 * @param inputs - Class values to merge
 * @returns Merged class string
 *
 * @example
 * ```typescript
 * cn("px-2 py-1", "px-4") // "py-1 px-4" (px-2 is overridden by px-4)
 * cn("bg-red-500", { "text-white": true }) // "bg-red-500 text-white"
 * ```
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
