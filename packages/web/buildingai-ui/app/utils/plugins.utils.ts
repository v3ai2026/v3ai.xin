// A performant, type-safe, and elegant runtime plugin system for Nuxt 3 / Vue 3
// - Dynamic slots (no hard-coded enums)
// - Strong types for plugins & contributions
// - Supports synchronous components, dynamic import functions, and defineAsyncComponent
// - Stable ordering with O(log n) insertion per slot (binary search)
// - Reactive consumers via shallowRef per slot
// - Safe de-duplication and replacement by (pluginId:contributionId)
// - Optional enable predicate for contextual filtering (without re-indexing)
// - Unregister support for HMR / runtime toggling

import { type Component, computed, defineAsyncComponent, type ShallowRef, shallowRef } from "vue";

/** A component-like input accepted by the registry. */
export type ComponentLike =
    | Component
    | (() => Promise<{ default: Component } | Component>)
    | ReturnType<typeof defineAsyncComponent>;

/** Optional context passed when evaluating whether a contribution should be enabled. */
export interface ContributionContext {
    // You can extend this interface in your app to include route, user, feature flags, etc.
    // e.g. route?: RouteLocationNormalizedLoaded; user?: { role: string };
    [key: string]: unknown;
}

/**
 * A single contribution to a slot.
 * Meta is generic so each slot can define its own shape (labels, icons, etc.).
 */
export interface PluginContribution<Meta = Record<string, unknown>> {
    /** Unique within a plugin. Combined with pluginId to form a global key. */
    id: string;
    /** The slot name this contribution goes to. (e.g. "ai-agent:publish:tabs") */
    slot: string;
    /** Vue component: sync, async (dynamic import), or defineAsyncComponent result. */
    component?: ComponentLike;
    /** Arbitrary metadata; define your own per-slot contract via generics. */
    meta?: Meta;
    /** Optional props to pass when rendering this component. */
    props?: Record<string, unknown>;
    /** Sort order within the slot. Smaller first. Defaults to 0. */
    order?: number;
    /**
     * Optional predicate to decide if this contribution is currently enabled.
     * Use this for feature flags, permissions, route checks, etc.
     * Returning false keeps the item indexed but filtered at read time — cheap and reactive.
     */
    enabled?: (ctx?: ContributionContext) => boolean;
}

/** A plugin groups multiple contributions. */
export interface Plugin<Meta = Record<string, unknown>> {
    id: string; // globally unique
    contributions: Array<PluginContribution<Meta>>;
    meta?: Record<string, unknown>;
}

/** Internal normalized entry stored in the registry. */
interface NormalizedEntry {
    key: string; // `${pluginId}:${contribution.id}`
    pluginId: string;
    id: string;
    slot: string;
    order: number;
    component: ReturnType<typeof normalizeComponent>;
    meta?: Record<string, unknown>;
    props?: Record<string, unknown>;
    enabled?: (ctx?: ContributionContext) => boolean;
}

// ---- Utilities -------------------------------------------------------------

function normalizeComponent(c: ComponentLike) {
    if (typeof c === "function") {
        // Treat function as a dynamic import factory and wrap with defineAsyncComponent
        return defineAsyncComponent(c as () => Promise<{ default: Component } | Component>);
    }
    // Either a plain component or already an async component
    return c as Component;
}

function binarySearchByOrder(arr: NormalizedEntry[], order: number): number {
    let lo = 0,
        hi = arr.length;
    while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if ((arr[mid]?.order ?? 0) <= (order ?? 0)) lo = mid + 1;
        else hi = mid;
    }
    return lo;
}

// ---- Registry --------------------------------------------------------------

class PluginRegistry {
    /** All plugins by id. */
    private plugins = new Map<string, Plugin>();
    /** Per-slot ordered entries. */
    private slotIndex = new Map<string, NormalizedEntry[]>();
    /** Per-slot reactive views. */
    private slotSignals = new Map<string, ShallowRef<readonly NormalizedEntry[]>>();
    /** Quick lookup by global key to allow replace & unregister. */
    private keyToSlot = new Map<string, string>();

    /** Register an entire plugin (idempotent). */
    register(plugin: Plugin) {
        if (this.plugins.has(plugin.id)) return; // prevent duplicate plugin install
        this.plugins.set(plugin.id, plugin);
        for (const c of plugin.contributions) this.registerContribution(plugin.id, c);

        console.log(this.plugins);
    }

    /** Register or replace a single contribution (used by plugins or direct). */
    registerContribution(pluginId: string, c: PluginContribution) {
        const key = `${pluginId}:${c.id}`;
        const entry: NormalizedEntry = {
            key,
            pluginId,
            id: c.id,
            slot: c.slot,
            order: c.order ?? 0,
            component: normalizeComponent(c.component as ComponentLike),
            meta: c.meta as Record<string, unknown>,
            props: c.props,
            enabled: c.enabled,
        };

        // If already exists, remove first (replacement)
        const existingSlotName = this.keyToSlot.get(key);
        if (existingSlotName) this.removeFromSlot(existingSlotName, key);

        this.keyToSlot.set(key, entry.slot);
        const arr = this.slotIndex.get(entry.slot) ?? [];
        const idx = binarySearchByOrder(arr, entry.order);
        arr.splice(idx, 0, entry);
        this.slotIndex.set(entry.slot, arr);
        this.bumpSignal(entry.slot, arr);
    }

    /** Unregister a plugin and all of its contributions. */
    unregister(pluginId: string) {
        const plugin = this.plugins.get(pluginId);
        if (!plugin) return;
        for (const c of plugin.contributions) {
            const key = `${pluginId}:${c.id}`;
            const slot = this.keyToSlot.get(key);
            if (slot) this.removeFromSlot(slot, key);
            this.keyToSlot.delete(key);
        }
        this.plugins.delete(pluginId);
    }

    /** Get a readonly reactive list for a slot (already ordered). */
    useSlot(slot: string) {
        if (!this.slotSignals.has(slot)) {
            const initial = this.slotIndex.get(slot) ?? [];
            this.slotSignals.set(slot, shallowRef<readonly NormalizedEntry[]>(initial));
        }
        const signal = this.slotSignals.get(slot);
        if (!signal) {
            throw new Error(`Unable to create signal for slot: ${slot}`);
        }
        return signal;
    }

    /** Non-reactive snapshot. */
    getSlot(slot: string): readonly NormalizedEntry[] {
        return this.slotIndex.get(slot) ?? [];
    }

    // -- helpers --
    private removeFromSlot(slot: string, key: string) {
        const arr = this.slotIndex.get(slot);
        if (!arr) return;
        const idx = arr.findIndex((e) => e.key === key);
        if (idx !== -1) {
            arr.splice(idx, 1);
            this.slotIndex.set(slot, arr);
            this.bumpSignal(slot, arr);
        }
    }

    private bumpSignal(slot: string, arr: NormalizedEntry[]) {
        const sig = this.slotSignals.get(slot);
        if (sig) {
            sig.value = arr.slice(); // new array reference to notify
        }
    }
}

export const pluginRegistry = new PluginRegistry();

// ---- Public API (semantic & ergonomic) -------------------------------------

/** Define and register a plugin. Return the same plugin for chaining/tests. */
export function definePlugin(plugin: Plugin) {
    console.log(plugin);
    pluginRegistry.register(plugin);
    return plugin;
}

/** Register a single contribution without declaring a full plugin object. */
export function registerPluginContribution(pluginId: string, c: PluginContribution) {
    pluginRegistry.registerContribution(pluginId, c);
}

/** Unregister a plugin at runtime (useful for HMR or toggling features). */
export function unregisterPlugin(pluginId: string) {
    pluginRegistry.unregister(pluginId);
}

/**
 * usePluginSlots: reactive consumer hook.
 * - Returns a computed list filtered by the optional `ctxProvider()` and `predicate`.
 * - Keeps fast O(1) reads thanks to pre-indexed & ordered arrays per slot.
 */
export function usePluginSlots<TMeta = Record<string, unknown>>(
    slot: string,
    options?: {
        /** Provide dynamic context for `enabled()` checks. */
        ctxProvider?: () => ContributionContext | undefined;
        /** Additional filter. Returning false hides an item. */
        predicate?: (e: Readonly<PluginView<TMeta>>) => boolean;
    },
) {
    const signal = pluginRegistry.useSlot(slot);
    console.log(signal.value);
    return computed(() => {
        const list = signal.value as NormalizedEntry[];
        const ctx = options?.ctxProvider?.();
        const out: PluginView<TMeta>[] = [];
        for (let i = 0; i < list.length; i++) {
            const e = list[i] as NormalizedEntry;
            if (e?.enabled && !e.enabled(ctx)) continue;
            const view: PluginView<TMeta> = {
                key: e.key,
                pluginId: e.pluginId,
                id: e.id,
                slot: e.slot,
                order: e.order,
                component: e.component,
                meta: e.meta as TMeta,
                props: e.props,
            };
            if (!options?.predicate || options.predicate(view)) out.push(view);
        }
        return out as readonly PluginView<TMeta>[];
    });
}

/** Public read-only shape exposed to views. */
export interface PluginView<TMeta = Record<string, unknown>> {
    readonly key: string;
    readonly pluginId: string;
    readonly id: string;
    readonly slot: string;
    readonly order: number;
    readonly component: Component;
    readonly meta?: TMeta;
    readonly props?: Record<string, unknown>;
}

// ---- Nuxt sugar ------------------------------------------------------------
// Optional: tiny helper to install a plugin via Nuxt's plugin system.
//
// Usage inside ./src/plugins/your-plugin.ts
// export default createNuxtPluginInstaller(definePlugin({ id: 'x', contributions: [...] }));

export function createNuxtPluginInstaller(p: Plugin) {
    return defineNuxtPlugin(() => {
        pluginRegistry.register(p);
    });
}

// ---- Example slot-specific meta typing (optional, for better DX) -----------
// Consumers can define their own meta contract per slot and reuse it app-wide.
// Example for a Tabs slot:
// export interface TabMeta { value: string; label: string; icon?: string }
// Then:
// const tabs = usePluginSlots<TabMeta>("ai-agent:publish:tabs");
// tabs.value.forEach(t => t.meta?.label)
