'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, Badge, Skeleton } from '@/components/ui';
import { useOrders } from '@/contexts';
import { OrderStatus, formatCentsToBRL } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: 'primary' | 'info' | 'warning' | 'success' | 'error' }> = {
    PENDING: { label: 'Pendente', color: 'warning' },
    RECEIVED: { label: 'Recebido', color: 'info' },
    PREPARING: { label: 'Em preparo', color: 'primary' },
    OUT_FOR_DELIVERY: { label: 'A caminho', color: 'info' },
    DELIVERED: { label: 'Entregue', color: 'success' },
    CANCELED: { label: 'Cancelado', color: 'error' },
};

const statusFilters: (OrderStatus | 'ALL')[] = ['ALL', 'PENDING', 'RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED'];

export default function AdminOrdersPage() {
    const { orders, isLoading } = useOrders();
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

    const filteredOrders = useMemo(() => {
        if (statusFilter === 'ALL') return orders;
        return orders.filter(o => o.status === statusFilter);
    }, [orders, statusFilter]);

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
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Pedidos</h1>
                <p className="text-gray-500">Gerencie os pedidos do restaurante</p>
            </div>

            {/* Filtros */}
            <div className="mb-6 overflow-x-auto scrollbar-hide">
                <div className="flex gap-2">
                    {statusFilters.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === filter
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {filter === 'ALL' ? 'Todos' : statusConfig[filter].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Lista */}
            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-xl" />
                    ))}
                </div>
            ) : filteredOrders.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="text-gray-500">
                        {statusFilter === 'ALL'
                            ? 'Nenhum pedido registrado'
                            : `Nenhum pedido ${statusConfig[statusFilter].label.toLowerCase()}`}
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredOrders.map((order) => {
                        const status = statusConfig[order.status];

                        return (
                            <Link key={order.id} href={`/admin/orders/${order.id}`}>
                                <Card className="hover:border-red-200 transition-colors">
                                    <div className="flex items-start justify-between mb-2">
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

                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-gray-600">{order.customerName}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-500">{order.customerPhone}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span className="text-sm text-gray-500">
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </span>
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
        </div>
    );
}
