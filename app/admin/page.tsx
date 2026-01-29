'use client';

import React, { useMemo } from 'react';
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

export default function AdminDashboardPage() {
    const { orders, isLoading } = useOrders();

    // Stats calculadas dos pedidos reais
    const stats = useMemo(() => {
        const today = new Date().toDateString();
        const todayOrders = orders.filter(o =>
            new Date(o.createdAtISO).toDateString() === today
        );

        const pendingOrders = orders.filter(o => o.status === 'PENDING');
        const preparingOrders = orders.filter(o => o.status === 'PREPARING');
        const todayRevenue = todayOrders
            .filter(o => o.status !== 'CANCELED')
            .reduce((sum, o) => sum + o.totalCents, 0);

        return {
            ordersToday: todayOrders.length,
            revenueTodayCents: todayRevenue,
            pendingCount: pendingOrders.length,
            preparingCount: preparingOrders.length
        };
    }, [orders]);

    const recentOrders = useMemo(() => {
        return orders.slice(0, 5);
    }, [orders]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div>
                <Skeleton className="w-48 h-8 mb-6" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Pediddo Admin</h1>
                <p className="text-gray-500">Visão geral do seu restaurante</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <p className="text-3xl mb-1">📦</p>
                    <p className="text-3xl font-bold">{stats.ordersToday}</p>
                    <p className="text-sm text-white/80">Pedidos Hoje</p>
                </Card>

                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <p className="text-3xl mb-1">💰</p>
                    <p className="text-2xl font-bold">{formatCentsToBRL(stats.revenueTodayCents)}</p>
                    <p className="text-sm text-white/80">Receita Hoje</p>
                </Card>

                <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <p className="text-3xl mb-1">⏳</p>
                    <p className="text-3xl font-bold">{stats.pendingCount}</p>
                    <p className="text-sm text-white/80">Pendentes</p>
                </Card>

                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <p className="text-3xl mb-1">👨‍🍳</p>
                    <p className="text-3xl font-bold">{stats.preparingCount}</p>
                    <p className="text-sm text-white/80">Em Preparo</p>
                </Card>
            </div>

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Pedidos Recentes</h2>
                    <Link href="/admin/orders" className="text-red-500 text-sm font-medium hover:underline">
                        Ver todos
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <Card className="text-center py-12">
                        <p className="text-4xl mb-3">📭</p>
                        <p className="text-gray-500">Nenhum pedido hoje</p>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order) => {
                            const status = statusConfig[order.status];

                            return (
                                <Link key={order.id} href={`/admin/orders/${order.id}`}>
                                    <Card className="hover:border-red-200 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">{order.displayCode}</span>
                                                    <Badge variant={status.color} size="sm">
                                                        {status.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {order.customerName} • {formatDate(order.createdAtISO)}
                                                </p>
                                            </div>
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
        </div>
    );
}
