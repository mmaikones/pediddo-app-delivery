import { Cart, CartItem, CartItemOption, Product } from '@/types';

// ========================
// CART SERVICE
// Pure business logic for cart operations
// ========================

const CART_STORAGE_KEY = 'ifome_cart';

export interface AddToCartParams {
    product: Product;
    quantity: number;
    selectedOptions: CartItemOption[];
    notes?: string;
}

export class CartService {
    private cart: Cart = {
        items: [],
        subtotal: 0,
        deliveryFee: 5.99,
        total: 0
    };

    constructor() {
        this.loadCart();
    }

    private loadCart(): void {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                this.cart = JSON.parse(stored);
            }
        }
    }

    private saveCart(): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.cart));
        }
    }

    private calculateItemTotal(basePrice: number, quantity: number, options: CartItemOption[]): number {
        const optionsTotal = options.reduce((sum, opt) => sum + opt.extraPrice, 0);
        return (basePrice + optionsTotal) * quantity;
    }

    private recalculateTotals(): void {
        this.cart.subtotal = this.cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
        this.cart.total = this.cart.subtotal + this.cart.deliveryFee;
        this.saveCart();
    }

    private generateId(): string {
        return `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    getCart(): Cart {
        return { ...this.cart, items: [...this.cart.items] };
    }

    getItemCount(): number {
        return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    addItem(params: AddToCartParams): Cart {
        const { product, quantity, selectedOptions, notes } = params;

        const totalPrice = this.calculateItemTotal(product.price, quantity, selectedOptions);

        const newItem: CartItem = {
            id: this.generateId(),
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            basePrice: product.price,
            quantity,
            selectedOptions,
            totalPrice,
            notes
        };

        this.cart.items.push(newItem);
        this.recalculateTotals();

        return this.getCart();
    }

    updateItemQuantity(itemId: string, quantity: number): Cart {
        const itemIndex = this.cart.items.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            throw new Error('Item not found in cart');
        }

        if (quantity <= 0) {
            return this.removeItem(itemId);
        }

        const item = this.cart.items[itemIndex];
        item.quantity = quantity;
        item.totalPrice = this.calculateItemTotal(item.basePrice, quantity, item.selectedOptions);

        this.recalculateTotals();

        return this.getCart();
    }

    removeItem(itemId: string): Cart {
        this.cart.items = this.cart.items.filter(item => item.id !== itemId);
        this.recalculateTotals();

        return this.getCart();
    }

    clearCart(): Cart {
        this.cart = {
            items: [],
            subtotal: 0,
            deliveryFee: 5.99,
            total: 0
        };
        this.saveCart();

        return this.getCart();
    }

    setDeliveryFee(fee: number): Cart {
        this.cart.deliveryFee = fee;
        this.recalculateTotals();

        return this.getCart();
    }

    isEmpty(): boolean {
        return this.cart.items.length === 0;
    }
}

// Singleton instance
let cartServiceInstance: CartService | null = null;

export function getCartService(): CartService {
    if (!cartServiceInstance) {
        cartServiceInstance = new CartService();
    }
    return cartServiceInstance;
}
