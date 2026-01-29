// ===== ORDER FACTORY SERVICE =====
// Criação de pedidos a partir do carrinho

import {
    Cart,
    Customer,
    CustomerAddress,
    PaymentMethod,
    Order,
    OrderItem,
    OrderStatusEvent,
    generateUUID
} from '@/types';
import { storage, STORAGE_KEYS } from './storage';

/**
 * Gera o próximo displayCode (ex: ER-001, ER-002...)
 */
function getNextDisplayCode(): string {
    const counter = storage.load<number>(STORAGE_KEYS.ORDER_COUNTER, 0) + 1;
    storage.save(STORAGE_KEYS.ORDER_COUNTER, counter);
    return `ER-${String(counter).padStart(3, '0')}`;
}

export interface CreateOrderParams {
    cart: Cart;
    customer: Customer;
    address: CustomerAddress;
    payment: PaymentMethod;
    notes?: string;
}

/**
 * Cria um pedido a partir do carrinho
 */
export function createOrderFromCart(params: CreateOrderParams): Order {
    const { cart, customer, address, payment, notes } = params;
    const now = new Date().toISOString();

    // Converte itens do carrinho para itens do pedido
    const orderItems: OrderItem[] = cart.items.map(item => ({
        id: generateUUID(),
        productId: item.productId,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        unitPriceCents: item.unitTotalCents,
        selectedOptions: item.selectedOptions,
        notes: item.notes,
        lineTotalCents: item.lineTotalCents
    }));

    // Evento inicial do timeline
    const initialEvent: OrderStatusEvent = {
        status: 'PENDING',
        atISO: now
    };

    const order: Order = {
        id: generateUUID(),
        displayCode: getNextDisplayCode(),
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        addressSnapshot: { ...address },
        paymentSnapshot: { ...payment },
        items: orderItems,
        subtotalCents: cart.subtotalCents,
        deliveryFeeCents: cart.deliveryFeeCents,
        totalCents: cart.totalCents,
        status: 'PENDING',
        timeline: [initialEvent],
        notes,
        createdAtISO: now,
        updatedAtISO: now
    };

    return order;
}

/**
 * Adiciona um evento de status ao pedido
 */
export function addStatusEvent(
    order: Order,
    newStatus: Order['status'],
    note?: string
): Order {
    const now = new Date().toISOString();

    const event: OrderStatusEvent = {
        status: newStatus,
        atISO: now,
        note
    };

    return {
        ...order,
        status: newStatus,
        timeline: [...order.timeline, event],
        updatedAtISO: now
    };
}
