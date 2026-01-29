import { Order, OrderStatus } from '@/types';
import { IOrderRepository, CreateOrderData } from '../interfaces/order.repository';
import { mockOrders } from '@/data/mock-data';

// ========================
// MOCK ORDER REPOSITORY
// Replace with Supabase implementation later
// ========================

const STORAGE_KEY = 'ifome_orders';

export class MockOrderRepository implements IOrderRepository {
    private orders: Order[] = [];

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.orders = JSON.parse(stored);
            } else {
                this.orders = [...mockOrders];
                this.saveToStorage();
            }
        } else {
            this.orders = [...mockOrders];
        }
    }

    private saveToStorage(): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders));
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private generateId(): string {
        return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    async createOrder(data: CreateOrderData): Promise<Order> {
        await this.delay(200);

        const now = new Date().toISOString();
        const newOrder: Order = {
            id: this.generateId(),
            ...data,
            items: data.items.map((item, index) => ({
                ...item,
                id: `oi-${Date.now()}-${index}`
            })),
            status: 'pending',
            statusHistory: [{ status: 'pending', timestamp: now }],
            createdAt: now,
            updatedAt: now
        };

        this.orders.unshift(newOrder);
        this.saveToStorage();

        // Auto-update to received after 2 seconds (simulates real flow)
        setTimeout(() => {
            this.updateOrderStatusInternal(newOrder.id, 'received');
        }, 2000);

        return { ...newOrder };
    }

    private updateOrderStatusInternal(id: string, status: OrderStatus): void {
        const index = this.orders.findIndex(o => o.id === id);
        if (index !== -1) {
            const now = new Date().toISOString();
            this.orders[index].status = status;
            this.orders[index].statusHistory.push({ status, timestamp: now });
            this.orders[index].updatedAt = now;
            this.saveToStorage();
        }
    }

    async getOrderById(id: string): Promise<Order | null> {
        await this.delay(50);
        const order = this.orders.find(o => o.id === id);
        return order ? { ...order } : null;
    }

    async getOrdersByCustomer(customerId: string): Promise<Order[]> {
        await this.delay(100);
        return this.orders
            .filter(o => o.customerId === customerId)
            .map(o => ({ ...o }));
    }

    async getAllOrders(): Promise<Order[]> {
        await this.delay(100);
        return this.orders.map(o => ({ ...o }));
    }

    async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
        await this.delay(100);
        return this.orders
            .filter(o => o.status === status)
            .map(o => ({ ...o }));
    }

    async getOrdersToday(): Promise<Order[]> {
        await this.delay(100);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.orders
            .filter(o => new Date(o.createdAt) >= today)
            .map(o => ({ ...o }));
    }

    async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
        await this.delay(100);

        const index = this.orders.findIndex(o => o.id === id);
        if (index === -1) throw new Error('Order not found');

        const now = new Date().toISOString();
        this.orders[index].status = status;
        this.orders[index].statusHistory.push({ status, timestamp: now, note });
        this.orders[index].updatedAt = now;

        this.saveToStorage();
        return { ...this.orders[index] };
    }

    async cancelOrder(id: string, reason?: string): Promise<Order> {
        return this.updateOrderStatus(id, 'canceled', reason);
    }

    async getTodayStats(): Promise<{
        ordersCount: number;
        revenue: number;
        pendingCount: number;
        preparingCount: number;
        deliveredCount: number;
        canceledCount: number;
    }> {
        await this.delay(100);

        const todayOrders = await this.getOrdersToday();

        return {
            ordersCount: todayOrders.length,
            revenue: todayOrders
                .filter(o => o.status !== 'canceled')
                .reduce((sum, o) => sum + o.total, 0),
            pendingCount: todayOrders.filter(o => o.status === 'pending' || o.status === 'received').length,
            preparingCount: todayOrders.filter(o => o.status === 'preparing').length,
            deliveredCount: todayOrders.filter(o => o.status === 'delivered').length,
            canceledCount: todayOrders.filter(o => o.status === 'canceled').length
        };
    }
}
