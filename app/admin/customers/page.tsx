'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, Input, Badge, Skeleton } from '@/components/ui';
import { getCustomerRepository, getOrderRepository } from '@/repositories';
import { Customer } from '@/types';

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            const repo = getCustomerRepository();
            const data = await repo.listAllCustomers();
            setCustomers(data);
            setIsLoading(false);
        };
        load();
    }, []);

    const filteredCustomers = useMemo(() => {
        if (!searchQuery) return customers;
        const query = searchQuery.toLowerCase();
        return customers.filter(c =>
            c.name.toLowerCase().includes(query) ||
            c.email?.toLowerCase().includes(query) ||
            c.phone.includes(query)
        );
    }, [customers, searchQuery]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">Clientes</h1>
                <p className="text-gray-500">Lista de clientes cadastrados</p>
            </div>

            {/* Search */}
            <div className="mb-6">
                <Input
                    placeholder="Buscar por nome, email ou telefone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="text-center">
                    <p className="text-3xl font-bold text-red-500">{customers.length}</p>
                    <p className="text-sm text-gray-500">Total de Clientes</p>
                </Card>
            </div>

            {/* Customers List */}
            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-20 rounded-xl" />
                    ))}
                </div>
            ) : filteredCustomers.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-4xl mb-3">👥</p>
                    <p className="text-gray-500">
                        {searchQuery ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
                    </p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredCustomers.map((customer) => (
                        <Card key={customer.id} className="hover:border-red-200 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-lg">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold">{customer.name}</h3>
                                    <p className="text-sm text-gray-500">{customer.email || 'Sem email'}</p>
                                    <p className="text-xs text-gray-400">{customer.phone || 'Sem telefone'}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant="info" size="sm">
                                        {customer.addresses.length} endereço{customer.addresses.length !== 1 ? 's' : ''}
                                    </Badge>
                                    <p className="text-xs text-gray-400 mt-1">
                                        Desde {formatDate(customer.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
