'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header, BottomNavigation } from '@/components/layout';
import { Card, Badge, Skeleton, EmptyState, PackageIcon } from '@/components/ui';
import { useCart, useOrders, useCustomer } from '@/contexts';
import { Order, OrderStatus, formatCentsToBRL } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: 'primary' | 'info' | 'warning' | 'success' | 'error' }> = {
    PENDING: { label: 'Pendente', color: 'warning' },
    RECEIVED: { label: 'Recebido', color: 'info' },
    PREPARING: { label: 'Em preparo', color: 'primary' },
    OUT_FOR_DELIVERY: { label: 'Saiu para entrega', color: 'info' },
    DELIVERED: { label: 'Entregue', color: 'success' },
    CANCELED: { label: 'Cancelado', color: 'error' },
};

export default function OrdersPage() {
    const { itemCount } = useCart();
    const { orders, isLoading } = useOrders();
    const { customer } = useCustomer();

    // Filtra pedidos do customer atual
    const myOrders = useMemo(() => {
        return orders.filter(o => o.customerId === customer.id);
    }, [orders, customer.id]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Meus Pedidos" />

            <main className="p-4 pb-24">
                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-32 rounded-xl" />
                        ))}
                    </div>
                ) : myOrders.length === 0 ? (
                    <EmptyState
                        icon={<PackageIcon className="w-16 h-16 text-gray-300" />}
                        title="Nenhum pedido ainda"
                        description="Seus pedidos aparecerão aqui"
                        action={
                            <Link href="/">
                                <button className="btn btn-primary">Fazer pedido</button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {myOrders.map((order) => {
                            const status = statusConfig[order.status];

                            return (
                                <Link key={order.id} href={`/orders/${order.id}`}>
                                    <Card className="hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-bold text-lg">{order.displayCode}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {formatDate(order.createdAtISO)}
                                                </p>
                                            </div>
                                            <Badge variant={status.color}>
                                                {status.label}
                                            </Badge>
                                        </div>

                                        <div className="text-sm text-gray-600 mb-3">
                                            {order.items.slice(0, 2).map((item, i) => (
                                                <span key={i}>
                                                    {item.quantity}x {item.productName}
                                                    {i < Math.min(order.items.length - 1, 1) ? ', ' : ''}
                                                </span>
                                            ))}
                                            {order.items.length > 2 && (
                                                <span className="text-gray-400"> +{order.items.length - 2} mais</span>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                            <span className="text-sm text-gray-500">Total</span>
                                            <span className="font-bold text-red-500">
                                                {formatCentsToBRL(order.totalCents)}
                                            </span>
                                        </div>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>

            <BottomNavigation cartItemCount={itemCount} />
        </div>
    );
}
