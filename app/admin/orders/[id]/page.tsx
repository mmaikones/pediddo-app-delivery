'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge, Button, Skeleton } from '@/components/ui';
import { useOrders } from '@/contexts';
import { Order, OrderStatus, formatCentsToBRL } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: 'primary' | 'info' | 'warning' | 'success' | 'error'; icon: string }> = {
    PENDING: { label: 'Pendente', color: 'warning', icon: '⏳' },
    RECEIVED: { label: 'Recebido', color: 'info', icon: '✅' },
    PREPARING: { label: 'Em preparo', color: 'primary', icon: '👨‍🍳' },
    OUT_FOR_DELIVERY: { label: 'Saiu para entrega', color: 'info', icon: '🛵' },
    DELIVERED: { label: 'Entregue', color: 'success', icon: '🎉' },
    CANCELED: { label: 'Cancelado', color: 'error', icon: '❌' },
};

// Fluxo de status permitido
const nextStatusMap: Partial<Record<OrderStatus, OrderStatus[]>> = {
    PENDING: ['RECEIVED', 'CANCELED'],
    RECEIVED: ['PREPARING', 'CANCELED'],
    PREPARING: ['OUT_FOR_DELIVERY', 'CANCELED'],
    OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELED'],
};

interface AdminOrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
    const { id } = use(params);
    const { getOrderById, updateOrderStatus, refreshOrders } = useOrders();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const loadOrder = async () => {
            setIsLoading(true);
            await refreshOrders();
            const data = await getOrderById(id);
            setOrder(data);
            setIsLoading(false);
        };
        loadOrder();
    }, [id, getOrderById, refreshOrders]);

    const handleStatusChange = async (newStatus: OrderStatus) => {
        if (!order || isUpdating) return;

        setIsUpdating(true);
        try {
            await updateOrderStatus(order.id, newStatus);
            const updated = await getOrderById(id);
            setOrder(updated);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (isoString: string) => {
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
                <div className="grid lg:grid-cols-3 gap-6">
                    <Skeleton className="h-64 rounded-xl lg:col-span-2" />
                    <Skeleton className="h-64 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-16">
                <p className="text-6xl mb-4">😕</p>
                <p className="text-gray-500 mb-4">Pedido não encontrado</p>
                <Link href="/admin/orders">
                    <Button variant="primary">Voltar aos pedidos</Button>
                </Link>
            </div>
        );
    }

    const currentStatus = statusConfig[order.status];
    const availableNextStatuses = nextStatusMap[order.status] || [];

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{order.displayCode}</h1>
                    <p className="text-gray-500">{formatDate(order.createdAtISO)}</p>
                </div>
                <Badge variant={currentStatus.color} size="lg">
                    {currentStatus.icon} {currentStatus.label}
                </Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Actions */}
                    {availableNextStatuses.length > 0 && (
                        <Card>
                            <h3 className="font-semibold mb-4">Ações</h3>
                            <div className="flex flex-wrap gap-3">
                                {availableNextStatuses.map((nextStatus) => {
                                    const nextConfig = statusConfig[nextStatus];
                                    const isCancel = nextStatus === 'CANCELED';

                                    return (
                                        <Button
                                            key={nextStatus}
                                            variant={isCancel ? 'outline' : 'primary'}
                                            size="sm"
                                            onClick={() => handleStatusChange(nextStatus)}
                                            disabled={isUpdating}
                                            isLoading={isUpdating}
                                        >
                                            {nextConfig.icon} {isCancel ? 'Cancelar' : `Mover para ${nextConfig.label}`}
                                        </Button>
                                    );
                                })}
                            </div>
                        </Card>
                    )}

                    {/* Items */}
                    <Card>
                        <h3 className="font-semibold mb-4">Itens do pedido</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.productImage}
                                            alt={item.productName}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-medium">{item.quantity}x {item.productName}</p>
                                                {item.selectedOptions.length > 0 && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {item.selectedOptions.map(o => o.name).join(', ')}
                                                    </p>
                                                )}
                                                {item.notes && (
                                                    <p className="text-xs text-orange-600 mt-1 font-medium">
                                                        📝 {item.notes}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="font-medium text-red-500">
                                                {formatCentsToBRL(item.lineTotalCents)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{formatCentsToBRL(order.subtotalCents)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Taxa de entrega</span>
                                <span>{formatCentsToBRL(order.deliveryFeeCents)}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2">
                                <span>Total</span>
                                <span className="text-red-500">{formatCentsToBRL(order.totalCents)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <h3 className="font-semibold mb-4">Histórico</h3>
                        <div className="space-y-4">
                            {order.timeline.map((event, index) => {
                                const eventStatus = statusConfig[event.status];
                                const isLast = index === order.timeline.length - 1;

                                return (
                                    <div key={index} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isLast ? 'bg-red-500 text-white' : 'bg-gray-200'
                                                }`}>
                                                {eventStatus.icon}
                                            </div>
                                            {index < order.timeline.length - 1 && (
                                                <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className={`font-medium ${isLast ? 'text-red-600' : 'text-gray-600'}`}>
                                                {eventStatus.label}
                                            </p>
                                            <p className="text-xs text-gray-500">{formatDate(event.atISO)}</p>
                                            {event.note && (
                                                <p className="text-xs text-gray-400 mt-1">{event.note}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span>👤</span> Cliente
                        </h3>
                        <div className="space-y-2">
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-600">{order.customerPhone}</p>
                        </div>
                    </Card>

                    {/* Address */}
                    <Card>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span>📍</span> Endereço
                        </h3>
                        <p className="text-sm">
                            {order.addressSnapshot.street}, {order.addressSnapshot.number}
                            {order.addressSnapshot.complement && ` - ${order.addressSnapshot.complement}`}
                        </p>
                        <p className="text-sm text-gray-500">{order.addressSnapshot.neighborhood}</p>
                        <p className="text-xs text-gray-400">
                            {order.addressSnapshot.city} - {order.addressSnapshot.state}
                        </p>
                    </Card>

                    {/* Payment */}
                    <Card>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span>💳</span> Pagamento
                        </h3>
                        <p className="font-medium">
                            {order.paymentSnapshot.type === 'PIX' ? '💎 PIX' : '💵 Dinheiro'}
                        </p>
                        {order.paymentSnapshot.changeForCents && (
                            <p className="text-sm text-gray-600">
                                Troco para: {formatCentsToBRL(order.paymentSnapshot.changeForCents)}
                            </p>
                        )}
                    </Card>

                    {/* Notes */}
                    {order.notes && (
                        <Card>
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <span>📝</span> Observações
                            </h3>
                            <p className="text-sm text-gray-600">{order.notes}</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
