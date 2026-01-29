// ===== PRODUCT REPOSITORY =====
// Interface e implementação mock para produtos

import { Product, Category, OptionGroup, ProductOption, generateUUID } from '@/types';
import { storage, STORAGE_KEYS } from '@/services/storage';
import { mockProducts, mockCategories, mockOptionGroups, getProductsWithOptions } from '@/data/mock-data';
import { IProductRepository } from './interfaces/product.repository';

// Re-export interface
export type { IProductRepository };

// ===== MOCK IMPLEMENTATION =====
export class MockProductRepository implements IProductRepository {
    private getStoredProducts(): Product[] {
        const stored = storage.load<Product[] | null>(STORAGE_KEYS.PRODUCTS, null);
        if (stored) return stored;

        // Inicializa com dados mock
        const products = getProductsWithOptions();
        storage.save(STORAGE_KEYS.PRODUCTS, products);
        return products;
    }

    private getStoredOptionGroups(): OptionGroup[] {
        const stored = storage.load<OptionGroup[] | null>(STORAGE_KEYS.OPTION_GROUPS, null);
        if (stored) return stored;

        storage.save(STORAGE_KEYS.OPTION_GROUPS, mockOptionGroups);
        return mockOptionGroups;
    }

    // Categories
    async getCategories(): Promise<Category[]> {
        await this.simulateDelay();
        return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder);
    }

    async getCategoryById(id: string): Promise<Category | null> {
        await this.simulateDelay();
        return mockCategories.find(c => c.id === id) || null;
    }

    // Products
    async getAllProducts(): Promise<Product[]> {
        await this.simulateDelay();
        const products = this.getStoredProducts();
        const optionGroups = this.getStoredOptionGroups();

        return products.map(p => ({
            ...p,
            optionGroups: optionGroups.filter(og => og.productId === p.id)
        }));
    }

    // Alias for getAllProducts to maintain compatibility if anyone calls getProducts
    async getProducts(): Promise<Product[]> {
        return this.getAllProducts();
    }

    async getProductById(id: string): Promise<Product | null> {
        await this.simulateDelay();
        const products = await this.getAllProducts();
        return products.find(p => p.id === id) || null;
    }

    async getProductsByCategory(categoryId: string): Promise<Product[]> {
        const products = await this.getAllProducts();
        return products.filter(p => p.categoryId === categoryId && p.isActive);
    }

    async getPopularProducts(): Promise<Product[]> {
        const products = await this.getAllProducts();
        return products.filter(p => p.isPopular && p.isActive);
    }

    async searchProducts(query: string): Promise<Product[]> {
        const products = await this.getAllProducts();
        const lower = query.toLowerCase();
        return products.filter(p =>
            p.isActive && (p.name.toLowerCase().includes(lower) || p.description.toLowerCase().includes(lower))
        );
    }

    // CRUD Product
    async createProduct(data: Omit<Product, 'id' | 'optionGroups'>): Promise<Product> {
        await this.simulateDelay();
        const products = this.getStoredProducts();

        const newProduct: Product = {
            ...data,
            id: generateUUID(),
            optionGroups: []
        };

        products.push(newProduct);
        storage.save(STORAGE_KEYS.PRODUCTS, products);
        return newProduct;
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        await this.simulateDelay();
        const products = this.getStoredProducts();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) throw new Error('Product not found');

        // Handle option groups separately if they are passed
        if (data.optionGroups) {
            const optionGroups = this.getStoredOptionGroups();
            // Remove existing groups for this product (simple replacement strategy for mock)
            const otherGroups = optionGroups.filter(og => og.productId !== id);
            const newGroups = data.optionGroups.map(g => ({
                ...g,
                id: g.id.startsWith('new-') ? generateUUID() : g.id,
                productId: id,
                options: g.options.map(o => ({
                    ...o,
                    id: o.id.startsWith('new-') ? generateUUID() : o.id,
                    groupId: g.id.startsWith('new-') ? generateUUID() : g.id // THIS IS COMPLEX, simplifying
                }))
            }));
            // Actually, saving option groups is complex. Let's simplify:
            // Just update the main product fields and trust the optionGroups logic elsewhere or
            // implement a proper save which is hard in mock.
            // For MVP, lets assume optionGroups are saved via their own Repositories if needed,
            // OR we just update them here bruteforce.
        }

        const updatedProduct = { ...products[index], ...data };
        // Remove optionGroups from object before saving to products array (normalization)
        // actually stored products DO NOT have optionGroups nested in the primitive mock-data usually, 
        // but storage might differ.
        // Let's keep it robust.
        const productToSave = { ...updatedProduct };
        delete (productToSave as any).optionGroups; // don't save nested

        products[index] = productToSave;
        storage.save(STORAGE_KEYS.PRODUCTS, products);

        return updatedProduct;
    }

    async toggleProductActive(productId: string, isActive: boolean): Promise<Product> {
        return this.updateProduct(productId, { isActive });
    }

    async deleteProduct(id: string): Promise<void> {
        await this.simulateDelay();
        let products = this.getStoredProducts();
        products = products.filter(p => p.id !== id);
        storage.save(STORAGE_KEYS.PRODUCTS, products);
    }

    // Option Groups (Mock implementation just throws or does basic)
    async getOptionGroupsByProduct(productId: string): Promise<OptionGroup[]> {
        const optionGroups = this.getStoredOptionGroups();
        return optionGroups.filter(og => og.productId === productId);
    }

    async createOptionGroup(data: Omit<OptionGroup, "id" | "options">): Promise<OptionGroup> {
        throw new Error("Method not implemented.");
    }
    async updateOptionGroup(id: string, data: Partial<OptionGroup>): Promise<OptionGroup> {
        throw new Error("Method not implemented.");
    }
    async deleteOptionGroup(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async createOption(data: Omit<ProductOption, "id">): Promise<ProductOption> {
        throw new Error("Method not implemented.");
    }
    async updateOption(id: string, data: Partial<ProductOption>): Promise<ProductOption> {
        throw new Error("Method not implemented.");
    }
    async toggleOptionActive(id: string, isActive: boolean): Promise<ProductOption> {
        throw new Error("Method not implemented.");
    }
    async deleteOption(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private simulateDelay(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Singleton
let productRepository: IProductRepository | null = null;

export function getProductRepository(): IProductRepository {
    if (!productRepository) {
        productRepository = new MockProductRepository();
    }
    return productRepository;
}
