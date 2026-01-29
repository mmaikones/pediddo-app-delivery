// ===== CART REPOSITORY =====
// Interface e implementação mock para carrinho

import { Cart, CartItem } from '@/types';
import { storage, STORAGE_KEYS } from '@/services/storage';
import { calcCartTotals, recalculateCartItem, DEFAULT_DELIVERY_FEE_CENTS } from '@/services/pricing';

// ===== INTERFACE =====
export interface ICartRepository {
    getCart(): Cart;
    saveCart(cart: Cart): void;
    addItem(item: CartItem): Cart;
    updateItemQuantity(itemId: string, quantity: number): Cart;
    removeItem(itemId: string): Cart;
    clearCart(): Cart;
}

function createEmptyCart(): Cart {
    return {
        items: [],
        subtotalCents: 0,
        deliveryFeeCents: DEFAULT_DELIVERY_FEE_CENTS,
        totalCents: DEFAULT_DELIVERY_FEE_CENTS
    };
}

// ===== MOCK IMPLEMENTATION =====
export class MockCartRepository implements ICartRepository {
    getCart(): Cart {
        const cart = storage.load<Cart>(STORAGE_KEYS.CART, createEmptyCart());
        // Recalcula totais para garantir consistência
        const { subtotalCents, totalCents } = calcCartTotals(cart.items, cart.deliveryFeeCents);
        return { ...cart, subtotalCents, totalCents };
    }

    saveCart(cart: Cart): void {
        storage.save(STORAGE_KEYS.CART, cart);
    }

    addItem(item: CartItem): Cart {
        const cart = this.getCart();
        const newItems = [...cart.items, item];
        const { subtotalCents, totalCents } = calcCartTotals(newItems, cart.deliveryFeeCents);

        const updatedCart: Cart = {
            ...cart,
            items: newItems,
            subtotalCents,
            totalCents
        };

        this.saveCart(updatedCart);
        return updatedCart;
    }

    updateItemQuantity(itemId: string, quantity: number): Cart {
        const cart = this.getCart();

        if (quantity <= 0) {
            return this.removeItem(itemId);
        }

        const newItems = cart.items.map(item => {
            if (item.id === itemId) {
                const updated = { ...item, quantity };
                return recalculateCartItem(updated);
            }
            return item;
        });

        const { subtotalCents, totalCents } = calcCartTotals(newItems, cart.deliveryFeeCents);

        const updatedCart: Cart = {
            ...cart,
            items: newItems,
            subtotalCents,
            totalCents
        };

        this.saveCart(updatedCart);
        return updatedCart;
    }

    removeItem(itemId: string): Cart {
        const cart = this.getCart();
        const newItems = cart.items.filter(item => item.id !== itemId);
        const { subtotalCents, totalCents } = calcCartTotals(newItems, cart.deliveryFeeCents);

        const updatedCart: Cart = {
            ...cart,
            items: newItems,
            subtotalCents,
            totalCents
        };

        this.saveCart(updatedCart);
        return updatedCart;
    }

    clearCart(): Cart {
        const emptyCart = createEmptyCart();
        this.saveCart(emptyCart);
        return emptyCart;
    }
}

// Singleton
let cartRepository: ICartRepository | null = null;

export function getCartRepository(): ICartRepository {
    if (!cartRepository) {
        cartRepository = new MockCartRepository();
    }
    return cartRepository;
}
