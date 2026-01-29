// ===== ORDER REPOSITORY =====
// Interface e implementação mock para pedidos

import { Order, OrderStatus } from '@/types';
import { storage, STORAGE_KEYS } from '@/services/storage';
import { addStatusEvent } from '@/services/orderFactory';

// ===== INTERFACE =====
export interface IOrderRepository {
    listAll(): Promise<Order[]>;
    listByCustomer(customerId: string): Promise<Order[]>;
    getById(orderId: string): Promise<Order | null>;
    create(order: Order): Promise<Order>;
    updateStatus(orderId: string, newStatus: OrderStatus, note?: string): Promise<Order | null>;
}

// ===== MOCK IMPLEMENTATION =====
export class MockOrderRepository implements IOrderRepository {
    private getStoredOrders(): Order[] {
        return storage.load<Order[]>(STORAGE_KEYS.ORDERS, []);
    }

    private saveOrders(orders: Order[]): void {
        storage.save(STORAGE_KEYS.ORDERS, orders);
    }

    async listAll(): Promise<Order[]> {
        await this.simulateDelay();
        return this.getStoredOrders().sort(
            (a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime()
        );
    }

    async listByCustomer(customerId: string): Promise<Order[]> {
        await this.simulateDelay();
        const orders = this.getStoredOrders();
        return orders
            .filter(o => o.customerId === customerId)
            .sort((a, b) => new Date(b.createdAtISO).getTime() - new Date(a.createdAtISO).getTime());
    }

    async getById(orderId: string): Promise<Order | null> {
        await this.simulateDelay();
        const orders = this.getStoredOrders();
        return orders.find(o => o.id === orderId) || null;
    }

    async create(order: Order): Promise<Order> {
        await this.simulateDelay();
        const orders = this.getStoredOrders();
        orders.push(order);
        this.saveOrders(orders);
        return order;
    }

    async updateStatus(orderId: string, newStatus: OrderStatus, note?: string): Promise<Order | null> {
        await this.simulateDelay();
        const orders = this.getStoredOrders();
        const index = orders.findIndex(o => o.id === orderId);

        if (index === -1) return null;

        const updatedOrder = addStatusEvent(orders[index], newStatus, note);
        orders[index] = updatedOrder;
        this.saveOrders(orders);

        return updatedOrder;
    }

    private simulateDelay(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Singleton
let orderRepository: IOrderRepository | null = null;

export function getOrderRepository(): IOrderRepository {
    if (!orderRepository) {
        orderRepository = new MockOrderRepository();
    }
    return orderRepository;
}
