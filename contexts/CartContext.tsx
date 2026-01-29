'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Cart, CartItem, Product, SelectedOption, generateUUID } from '@/types';
import { getCartRepository } from '@/repositories';
import { calcCartItemTotals, DEFAULT_DELIVERY_FEE_CENTS } from '@/services/pricing';

interface CartContextType {
    cart: Cart;
    itemCount: number;
    isEmpty: boolean;
    isLoaded: boolean;
    addItem: (product: Product, quantity: number, selectedOptions: SelectedOption[], notes?: string) => void;
    updateItemQuantity: (itemId: string, quantity: number) => void;
    removeItem: (itemId: string) => void;
    clearCart: () => void;
    refreshCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function createEmptyCart(): Cart {
    return {
        items: [],
        subtotalCents: 0,
        deliveryFeeCents: DEFAULT_DELIVERY_FEE_CENTS,
        totalCents: DEFAULT_DELIVERY_FEE_CENTS
    };
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>(createEmptyCart());
    const [isLoaded, setIsLoaded] = useState(false);

    const refreshCart = useCallback(() => {
        const repo = getCartRepository();
        setCart(repo.getCart());
    }, []);

    // Carrega carrinho do localStorage na montagem
    useEffect(() => {
        refreshCart();
        setIsLoaded(true);
    }, [refreshCart]);

    const addItem = useCallback((
        product: Product,
        quantity: number,
        selectedOptions: SelectedOption[],
        notes?: string
    ) => {
        const { unitTotalCents, lineTotalCents } = calcCartItemTotals(
            product.priceCents,
            selectedOptions,
            quantity
        );

        const newItem: CartItem = {
            id: generateUUID(),
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            quantity,
            basePriceCents: product.priceCents,
            selectedOptions,
            notes,
            unitTotalCents,
            lineTotalCents
        };

        const repo = getCartRepository();
        const updatedCart = repo.addItem(newItem);
        setCart(updatedCart);
    }, []);

    const updateItemQuantity = useCallback((itemId: string, quantity: number) => {
        const repo = getCartRepository();
        const updatedCart = repo.updateItemQuantity(itemId, quantity);
        setCart(updatedCart);
    }, []);

    const removeItem = useCallback((itemId: string) => {
        const repo = getCartRepository();
        const updatedCart = repo.removeItem(itemId);
        setCart(updatedCart);
    }, []);

    const clearCart = useCallback(() => {
        const repo = getCartRepository();
        const emptyCart = repo.clearCart();
        setCart(emptyCart);
    }, []);

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const isEmpty = cart.items.length === 0;

    return (
        <CartContext.Provider value={{
            cart,
            itemCount,
            isEmpty,
            isLoaded,
            addItem,
            updateItemQuantity,
            removeItem,
            clearCart,
            refreshCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
