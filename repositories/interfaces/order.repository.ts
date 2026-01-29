import { Order, OrderStatus, OrderItem } from '@/types';

// ========================
// ORDER REPOSITORY INTERFACE
// Prepared for Supabase integration
// ========================
export interface CreateOrderData {
    customerId: string;
    customerName: string;
    customerPhone: string;
    items: Omit<OrderItem, 'id'>[];
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: 'pix' | 'cash' | 'credit_card' | 'debit_card';
    deliveryAddress: Order['deliveryAddress'];
    notes?: string;
}

export interface IOrderRepository {
    // Client operations
    createOrder(data: CreateOrderData): Promise<Order>;
    getOrderById(id: string): Promise<Order | null>;
    getOrdersByCustomer(customerId: string): Promise<Order[]>;

    // Admin operations
    getAllOrders(): Promise<Order[]>;
    getOrdersByStatus(status: OrderStatus): Promise<Order[]>;
    getOrdersToday(): Promise<Order[]>;
    updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order>;
    cancelOrder(id: string, reason?: string): Promise<Order>;

    // Stats
    getTodayStats(): Promise<{
        ordersCount: number;
        revenue: number;
        pendingCount: number;
        preparingCount: number;
        deliveredCount: number;
        canceledCount: number;
    }>;
}
