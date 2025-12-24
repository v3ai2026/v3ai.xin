/**
 * @buildingai/nuxt - Nuxt configuration utilities
 *
 * This package provides utilities for configuring Nuxt applications with
 * presets, modules, plugins, and other common configurations.
 */

export type { ExtendedNuxtConfig } from "./nuxt.config";
export { defineBuildingAIConfig, defineBuildingAIExtensionConfig } from "./nuxt.config";

// Re-export Nuxt types for convenience
export type { NuxtConfig } from "nuxt/schema";
export type { AppConfig } from "nuxt/schema";
export type { RouterConfig } from "nuxt/schema";

// Router utilities are exported from "./router" to avoid importing nuxt.config.ts in Vue context
// Use: import { defineRoutesConfig } from "@buildingai/nuxt/router"

// Middleware utilities are exported from "./middleware" to avoid importing nuxt.config.ts in Vue context
// Use: import { defineBuildingAIRouteMiddleware } from "@buildingai/nuxt/middleware"
