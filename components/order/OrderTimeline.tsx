'use client';

import React from 'react';
import { OrderStatusHistory, OrderStatus } from '@/types';

interface OrderTimelineProps {
    history: OrderStatusHistory[];
    currentStatus: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; icon: string; color: string }> = {
    pending: { label: 'Pedido Pendente', icon: '⏳', color: 'bg-yellow-500' },
    received: { label: 'Pedido Recebido', icon: '✅', color: 'bg-blue-500' },
    preparing: { label: 'Preparando', icon: '👨‍🍳', color: 'bg-purple-500' },
    out_for_delivery: { label: 'Saiu para Entrega', icon: '🛵', color: 'bg-cyan-500' },
    delivered: { label: 'Entregue', icon: '🎉', color: 'bg-green-500' },
    canceled: { label: 'Cancelado', icon: '❌', color: 'bg-red-500' }
};

const statusOrder: OrderStatus[] = [
    'pending',
    'received',
    'preparing',
    'out_for_delivery',
    'delivered'
];

export function OrderTimeline({ history, currentStatus }: OrderTimelineProps) {
    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit'
        });
    };

    const getHistoryEntry = (status: OrderStatus) => {
        return history.find(h => h.status === status);
    };

    const currentIndex = currentStatus === 'canceled'
        ? -1
        : statusOrder.indexOf(currentStatus);

    if (currentStatus === 'canceled') {
        return (
            <div className="bg-red-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                    <span className="text-2xl">❌</span>
                    <div>
                        <p className="font-semibold text-red-700">Pedido Cancelado</p>
                        {history.find(h => h.status === 'canceled')?.note && (
                            <p className="text-sm text-red-600">
                                {history.find(h => h.status === 'canceled')?.note}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {statusOrder.map((status, index) => {
                const entry = getHistoryEntry(status);
                const isPast = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const config = statusConfig[status];

                return (
                    <div key={status} className="flex items-start gap-3">
                        {/* Timeline indicator */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${isPast
                                        ? config.color + ' text-white'
                                        : 'bg-gray-200 text-gray-400'
                                    } ${isCurrent ? 'ring-4 ring-offset-2 ring-opacity-30 ' + config.color.replace('bg-', 'ring-') : ''}`}
                            >
                                {config.icon}
                            </div>
                            {index < statusOrder.length - 1 && (
                                <div
                                    className={`w-0.5 h-8 ${index < currentIndex ? config.color : 'bg-gray-200'
                                        }`}
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                            <p
                                className={`font-medium ${isPast ? 'text-gray-900' : 'text-gray-400'
                                    }`}
                            >
                                {config.label}
                            </p>
                            {entry && (
                                <p className="text-xs text-gray-500">
                                    {formatDate(entry.timestamp)} às {formatTime(entry.timestamp)}
                                </p>
                            )}
                            {entry?.note && (
                                <p className="text-xs text-gray-400 mt-1">{entry.note}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
