// ===== STORAGE SERVICE =====
// Módulo para persistência em localStorage

const PREFIX = 'ifome';

export const STORAGE_KEYS = {
    CART: `${PREFIX}.cart.v1`,
    ORDERS: `${PREFIX}.orders.v1`,
    CUSTOMER: `${PREFIX}.customer.v1`,
    PRODUCTS: `${PREFIX}.products.v1`,
    OPTION_GROUPS: `${PREFIX}.optionGroups.v1`,
    ORDER_COUNTER: `${PREFIX}.orderCounter.v1`,
} as const;

function isBrowser(): boolean {
    return typeof window !== 'undefined';
}

export function load<T>(key: string, fallback: T): T {
    if (!isBrowser()) return fallback;

    try {
        const stored = localStorage.getItem(key);
        if (!stored) return fallback;
        return JSON.parse(stored) as T;
    } catch (error) {
        console.error(`Error loading ${key}:`, error);
        return fallback;
    }
}

export function save<T>(key: string, value: T): void {
    if (!isBrowser()) return;

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key}:`, error);
    }
}

export function remove(key: string): void {
    if (!isBrowser()) return;

    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing ${key}:`, error);
    }
}

// Exporta tudo junto
export const storage = { load, save, remove, KEYS: STORAGE_KEYS };
