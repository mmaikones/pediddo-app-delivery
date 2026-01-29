'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Skeleton } from '@/components/ui';
import { useOrders } from '@/contexts';
import { getCustomerRepository } from '@/repositories';
import { Customer, Order, OrderStatus, formatCentsToBRL } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: 'primary' | 'info' | 'warning' | 'success' | 'error' }> = {
    PENDING: { label: 'Pendente', color: 'warning' },
    RECEIVED: { label: 'Recebido', color: 'info' },
    PREPARING: { label: 'Em preparo', color: 'primary' },
    OUT_FOR_DELIVERY: { label: 'A caminho', color: 'info' },
    DELIVERED: { label: 'Entregue', color: 'success' },
    CANCELED: { label: 'Cancelado', color: 'error' },
};

interface AdminCustomerDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function AdminCustomerDetailPage({ params }: AdminCustomerDetailPageProps) {
    const { id } = use(params);
    const { orders } = useOrders();

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            const repo = getCustomerRepository();
            const allCustomers = await repo.listAllCustomers();
            const found = allCustomers.find(c => c.id === id);
            setCustomer(found || null);
            setIsLoading(false);
        };
        loadData();
    }, [id]);

    const customerOrders = orders.filter(o => o.customerId === id);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const totalSpentCents = customerOrders
        .filter(o => o.status !== 'CANCELED')
        .reduce((sum, o) => sum + o.totalCents, 0);

    if (isLoading) {
        return (
            <div>
                <Skeleton className="w-48 h-8 mb-6" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl lg:col-span-2" />
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-16">
                <p className="text-6xl mb-4">😕</p>
                <p className="text-gray-500 mb-4">Cliente não encontrado</p>
                <Link href="/admin/customers">
                    <Button variant="primary">Voltar aos clientes</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/customers" className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">{customer.name}</h1>
                    <p className="text-gray-500">Cliente desde {formatDate(customer.createdAt)}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="space-y-6">
                    <Card>
                        <div className="text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-3xl">
                                    {customer.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <h2 className="font-bold text-lg">{customer.name}</h2>
                            <p className="text-gray-500 text-sm">{customer.email || 'Sem email'}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <span className="text-xl">📞</span>
                                <div>
                                    <p className="text-xs text-gray-500">Telefone</p>
                                    <p className="font-medium">{customer.phone || 'Não informado'}</p>
                                </div>
                            </div>
                            {customer.email && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    <span className="text-xl">📧</span>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium text-sm">{customer.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <h3 className="font-semibold mb-4">Estatísticas</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600">{customerOrders.length}</p>
                                <p className="text-xs text-blue-600">Pedidos</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                <p className="text-lg font-bold text-green-600">{formatCentsToBRL(totalSpentCents)}</p>
                                <p className="text-xs text-green-600">Total Gasto</p>
                            </div>
                        </div>
                    </Card>

                    {/* Addresses */}
                    <Card>
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span>📍</span> Endereços
                        </h3>
                        {customer.addresses.length === 0 ? (
                            <p className="text-gray-400 text-sm">Nenhum endereço cadastrado</p>
                        ) : (
                            <div className="space-y-3">
                                {customer.addresses.map((addr) => (
                                    <div key={addr.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-sm">{addr.label}</span>
                                            {addr.isDefault && (
                                                <Badge variant="primary" size="sm">Padrão</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600">
                                            {addr.street}, {addr.number}
                                            {addr.complement && ` - ${addr.complement}`}
                                        </p>
                                        <p className="text-xs text-gray-500">{addr.neighborhood}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Order History */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Histórico de Pedidos</h2>
                        <Badge variant="info">{customerOrders.length} pedido{customerOrders.length !== 1 ? 's' : ''}</Badge>
                    </div>

                    {customerOrders.length === 0 ? (
                        <Card className="text-center py-12">
                            <p className="text-4xl mb-3">📦</p>
                            <p className="text-gray-500">Nenhum pedido realizado</p>
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {customerOrders.map((order) => {
                                const status = statusConfig[order.status];
                                return (
                                    <Link key={order.id} href={`/admin/orders/${order.id}`}>
                                        <Card className="hover:border-red-200 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <span className="font-bold">{order.displayCode}</span>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(order.createdAtISO)}
                                                    </p>
                                                </div>
                                                <Badge variant={status.color}>{status.label}</Badge>
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
            </div>
        </div>
    );
}
