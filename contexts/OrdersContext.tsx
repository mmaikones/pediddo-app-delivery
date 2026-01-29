'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Order, OrderStatus, Cart, CustomerAddress, PaymentMethod, Customer } from '@/types';
import { getOrderRepository, getCustomerRepository } from '@/repositories';
import { createOrderFromCart } from '@/services/orderFactory';

interface OrdersContextType {
    orders: Order[];
    isLoading: boolean;
    isLoaded: boolean;
    getOrderById: (id: string) => Promise<Order | null>;
    createOrder: (cart: Cart, address: CustomerAddress, payment: PaymentMethod, notes?: string) => Promise<Order>;
    updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
    refreshOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    const refreshOrders = useCallback(async () => {
        setIsLoading(true);
        try {
            const repo = getOrderRepository();
            const allOrders = await repo.listAll();
            setOrders(allOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setIsLoading(false);
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        refreshOrders();
    }, [refreshOrders]);

    const getOrderById = useCallback(async (id: string): Promise<Order | null> => {
        const repo = getOrderRepository();
        return repo.getById(id);
    }, []);

    const createOrder = useCallback(async (
        cart: Cart,
        address: CustomerAddress,
        payment: PaymentMethod,
        notes?: string
    ): Promise<Order> => {
        const customerRepo = getCustomerRepository();
        const customer = customerRepo.getCurrentCustomer();

        const order = createOrderFromCart({
            cart,
            customer,
            address,
            payment,
            notes
        });

        const repo = getOrderRepository();
        await repo.create(order);
        await refreshOrders();

        return order;
    }, [refreshOrders]);

    const updateOrderStatus = useCallback(async (
        orderId: string,
        status: OrderStatus,
        note?: string
    ) => {
        const repo = getOrderRepository();
        await repo.updateStatus(orderId, status, note);
        await refreshOrders();
    }, [refreshOrders]);

    return (
        <OrdersContext.Provider value={{
            orders,
            isLoading,
            isLoaded,
            getOrderById,
            createOrder,
            updateOrderStatus,
            refreshOrders
        }}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders(): OrdersContextType {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrdersProvider');
    }
    return context;
}
