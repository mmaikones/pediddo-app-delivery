import { Product, Category, OptionGroup, ProductOption } from '@/types';
import { IProductRepository } from '../interfaces/product.repository';
import { mockCategories, mockProducts, mockOptionGroups } from '@/data/mock-data';

// ========================
// MOCK PRODUCT REPOSITORY
// Replace with Supabase implementation later
// ========================

const STORAGE_KEY_PRODUCTS = 'ifome_products';
const STORAGE_KEY_OPTION_GROUPS = 'ifome_option_groups';

export class MockProductRepository implements IProductRepository {
    private categories: Category[] = [...mockCategories];
    private products: Product[] = [];
    private optionGroups: OptionGroup[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        if (typeof window !== 'undefined') {
            const storedProducts = localStorage.getItem(STORAGE_KEY_PRODUCTS);
            const storedOptionGroups = localStorage.getItem(STORAGE_KEY_OPTION_GROUPS);

            if (storedProducts) {
                this.products = JSON.parse(storedProducts);
            } else {
                this.products = [...mockProducts];
            }

            if (storedOptionGroups) {
                this.optionGroups = JSON.parse(storedOptionGroups);
            } else {
                this.optionGroups = [...mockOptionGroups];
            }
        } else {
            this.products = [...mockProducts];
            this.optionGroups = [...mockOptionGroups];
        }
    }

    private saveToStorage(): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
            localStorage.setItem(STORAGE_KEY_OPTION_GROUPS, JSON.stringify(this.optionGroups));
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Categories
    async getCategories(): Promise<Category[]> {
        await this.delay(50);
        return [...this.categories];
    }

    async getCategoryById(id: string): Promise<Category | null> {
        await this.delay(50);
        return this.categories.find(c => c.id === id) || null;
    }

    // Products
    async getAllProducts(): Promise<Product[]> {
        await this.delay(100);
        return this.products.map(p => ({
            ...p,
            optionGroups: this.optionGroups.filter(og => og.productId === p.id)
        }));
    }

    async getProductById(id: string): Promise<Product | null> {
        await this.delay(50);
        const product = this.products.find(p => p.id === id);
        if (!product) return null;

        return {
            ...product,
            optionGroups: this.optionGroups.filter(og => og.productId === id)
        };
    }

    async getProductsByCategory(categoryId: string): Promise<Product[]> {
        await this.delay(100);
        return this.products
            .filter(p => p.categoryId === categoryId && p.isActive)
            .map(p => ({
                ...p,
                optionGroups: this.optionGroups.filter(og => og.productId === p.id)
            }));
    }

    async getPopularProducts(): Promise<Product[]> {
        await this.delay(100);
        return this.products
            .filter(p => p.isPopular && p.isActive)
            .map(p => ({
                ...p,
                optionGroups: this.optionGroups.filter(og => og.productId === p.id)
            }));
    }

    async searchProducts(query: string): Promise<Product[]> {
        await this.delay(100);
        const lowerQuery = query.toLowerCase();
        return this.products
            .filter(p =>
                p.isActive &&
                (p.name.toLowerCase().includes(lowerQuery) ||
                    p.description.toLowerCase().includes(lowerQuery))
            )
            .map(p => ({
                ...p,
                optionGroups: this.optionGroups.filter(og => og.productId === p.id)
            }));
    }

    async createProduct(data: Omit<Product, 'id' | 'optionGroups'>): Promise<Product> {
        await this.delay(100);
        const newProduct: Product = {
            ...data,
            id: `prod-${this.generateId()}`,
            optionGroups: []
        };
        this.products.push(newProduct);
        this.saveToStorage();
        return { ...newProduct };
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
        await this.delay(100);
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) throw new Error('Product not found');

        this.products[index] = { ...this.products[index], ...data };
        this.saveToStorage();

        return {
            ...this.products[index],
            optionGroups: this.optionGroups.filter(og => og.productId === id)
        };
    }

    async toggleProductActive(id: string, isActive: boolean): Promise<Product> {
        return this.updateProduct(id, { isActive });
    }

    async deleteProduct(id: string): Promise<void> {
        await this.delay(100);
        this.products = this.products.filter(p => p.id !== id);
        this.optionGroups = this.optionGroups.filter(og => og.productId !== id);
        this.saveToStorage();
    }

    // Option Groups
    async getOptionGroupsByProduct(productId: string): Promise<OptionGroup[]> {
        await this.delay(50);
        return this.optionGroups.filter(og => og.productId === productId);
    }

    async createOptionGroup(data: Omit<OptionGroup, 'id' | 'options'>): Promise<OptionGroup> {
        await this.delay(100);
        const newGroup: OptionGroup = {
            ...data,
            id: `og-${this.generateId()}`,
            options: []
        };
        this.optionGroups.push(newGroup);
        this.saveToStorage();
        return { ...newGroup };
    }

    async updateOptionGroup(id: string, data: Partial<OptionGroup>): Promise<OptionGroup> {
        await this.delay(100);
        const index = this.optionGroups.findIndex(og => og.id === id);
        if (index === -1) throw new Error('Option group not found');

        this.optionGroups[index] = { ...this.optionGroups[index], ...data };
        this.saveToStorage();
        return { ...this.optionGroups[index] };
    }

    async deleteOptionGroup(id: string): Promise<void> {
        await this.delay(100);
        this.optionGroups = this.optionGroups.filter(og => og.id !== id);
        this.saveToStorage();
    }

    // Options
    async createOption(data: Omit<ProductOption, 'id'>): Promise<ProductOption> {
        await this.delay(100);
        const newOption: ProductOption = {
            ...data,
            id: `opt-${this.generateId()}`
        };

        const groupIndex = this.optionGroups.findIndex(og => og.id === data.groupId);
        if (groupIndex === -1) throw new Error('Option group not found');

        this.optionGroups[groupIndex].options.push(newOption);
        this.saveToStorage();
        return { ...newOption };
    }

    async updateOption(id: string, data: Partial<ProductOption>): Promise<ProductOption> {
        await this.delay(100);

        for (const group of this.optionGroups) {
            const optIndex = group.options.findIndex(o => o.id === id);
            if (optIndex !== -1) {
                group.options[optIndex] = { ...group.options[optIndex], ...data };
                this.saveToStorage();
                return { ...group.options[optIndex] };
            }
        }

        throw new Error('Option not found');
    }

    async toggleOptionActive(id: string, isActive: boolean): Promise<ProductOption> {
        return this.updateOption(id, { isActive });
    }

    async deleteOption(id: string): Promise<void> {
        await this.delay(100);

        for (const group of this.optionGroups) {
            const optIndex = group.options.findIndex(o => o.id === id);
            if (optIndex !== -1) {
                group.options.splice(optIndex, 1);
                this.saveToStorage();
                return;
            }
        }
    }
}
