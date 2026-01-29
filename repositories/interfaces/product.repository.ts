import { Product, Category, OptionGroup, ProductOption } from '@/types';

// ========================
// PRODUCT REPOSITORY INTERFACE
// Prepared for Supabase integration
// ========================
export interface IProductRepository {
    // Categories
    getCategories(): Promise<Category[]>;
    getCategoryById(id: string): Promise<Category | null>;

    // Products
    getAllProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product | null>;
    getProductsByCategory(categoryId: string): Promise<Product[]>;
    getPopularProducts(): Promise<Product[]>;
    searchProducts(query: string): Promise<Product[]>;
    createProduct(data: Omit<Product, 'id' | 'optionGroups'>): Promise<Product>;
    updateProduct(id: string, data: Partial<Product>): Promise<Product>;
    toggleProductActive(id: string, isActive: boolean): Promise<Product>;
    deleteProduct(id: string): Promise<void>;

    // Option Groups
    getOptionGroupsByProduct(productId: string): Promise<OptionGroup[]>;
    createOptionGroup(data: Omit<OptionGroup, 'id' | 'options'>): Promise<OptionGroup>;
    updateOptionGroup(id: string, data: Partial<OptionGroup>): Promise<OptionGroup>;
    deleteOptionGroup(id: string): Promise<void>;

    // Options
    createOption(data: Omit<ProductOption, 'id'>): Promise<ProductOption>;
    updateOption(id: string, data: Partial<ProductOption>): Promise<ProductOption>;
    toggleOptionActive(id: string, isActive: boolean): Promise<ProductOption>;
    deleteOption(id: string): Promise<void>;
}
