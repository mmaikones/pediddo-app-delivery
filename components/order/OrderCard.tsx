'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Order, OrderStatus } from '@/types';
import { Badge } from '@/components/ui';

interface OrderCardProps {
    order: Order;
    isAdmin?: boolean;
}

const statusLabels: Record<OrderStatus, string> = {
    pending: 'Pendente',
    received: 'Recebido',
    preparing: 'Preparando',
    out_for_delivery: 'Saiu para entrega',
    delivered: 'Entregue',
    canceled: 'Cancelado'
};

const statusVariants: Record<OrderStatus, 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'warning',
    received: 'info',
    preparing: 'primary',
    out_for_delivery: 'info',
    delivered: 'success',
    canceled: 'error'
};

export function OrderCard({ order, isAdmin = false }: OrderCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const href = isAdmin ? `/admin/orders/${order.id}` : `/orders/${order.id}`;

    return (
        <Link href={href}>
            <div className="card p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">
                        #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <Badge variant={statusVariants[order.status]}>
                        {statusLabels[order.status]}
                    </Badge>
                </div>

                {isAdmin && (
                    <div className="mb-3 pb-3 border-b border-gray-100">
                        <p className="font-medium text-sm">{order.customerName}</p>
                        <p className="text-xs text-gray-500">{order.customerPhone}</p>
                    </div>
                )}

                <div className="flex gap-3">
                    <div className="flex -space-x-2">
                        {order.items.slice(0, 3).map((item, index) => (
                            <div
                                key={item.id}
                                className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white"
                                style={{ zIndex: 3 - index }}
                            >
                                <Image
                                    src={item.productImage}
                                    alt={item.productName}
                                    fill
                                    className="object-cover"
                                    sizes="40px"
                                />
                            </div>
                        ))}
                        {order.items.length > 3 && (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                                +{order.items.length - 3}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-600 line-clamp-1">
                            {order.items.map(item => `${item.quantity}x ${item.productName}`).join(', ')}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="font-bold text-red-500">{formatPrice(order.total)}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
