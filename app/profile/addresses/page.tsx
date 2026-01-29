'use client';

import React from 'react';
import Link from 'next/link';
import { Header, BottomNavigation } from '@/components/layout';
import { Card, Button, LocationIcon, TrashIcon, EditIcon, CheckCircleIcon } from '@/components/ui';
import { useCart, useCustomer } from '@/contexts';
import { CustomerAddress } from '@/types';

// Ícone de Plus para o botão de adicionar
function PlusIcon({ className = 'w-6 h-6' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );
}

export default function AddressesPage() {
    const { itemCount } = useCart();
    const { customer, deleteAddress, setDefaultAddress } = useCustomer();

    const handleDelete = (id: string) => {
        if (confirm('Tem certeza que deseja excluir este endereço?')) {
            deleteAddress(id);
        }
    };

    const handleSetDefault = (id: string) => {
        setDefaultAddress(id);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBack title="Meus Endereços" />

            <main className="p-4 pb-24 space-y-4">
                {/* Add New Button */}
                <Link href="/profile/addresses/new">
                    <Button variant="outline" fullWidth className="h-14 border-dashed border-2 flex items-center justify-center gap-2 text-gray-500 hover:text-red-500 hover:border-red-500 hover:bg-red-50">
                        <PlusIcon className="w-5 h-5" />
                        Adicionar novo endereço
                    </Button>
                </Link>

                {/* Address List */}
                <div className="space-y-4">
                    {customer.addresses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                <LocationIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Sem endereços</h3>
                            <p className="text-gray-500">Cadastre um endereço para entrega.</p>
                        </div>
                    ) : (
                        customer.addresses.map((addr) => (
                            <Card key={addr.id} className={`relative overflow-hidden ${addr.isDefault ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10' : ''}`}>
                                {addr.isDefault && (
                                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium flex items-center gap-1">
                                        <CheckCircleIcon className="w-3 h-3" />
                                        Padrão
                                    </div>
                                )}

                                <div className="p-4">
                                    <div className="flex items-start gap-3 mb-3">
                                        <LocationIcon className={`w-5 h-5 mt-0.5 ${addr.isDefault ? 'text-red-500' : 'text-gray-400'}`} />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800">{addr.label}</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {addr.street}, {addr.number}
                                                {addr.complement && ` - ${addr.complement}`}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {addr.neighborhood} - {addr.city}/{addr.state}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">CEP: {addr.zipCode}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                                        {!addr.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(addr.id)}
                                                className="text-xs text-gray-500 hover:text-red-500 mr-auto transition-colors"
                                            >
                                                Definir como padrão
                                            </button>
                                        )}

                                        {/* TODO: Implement Edit */}
                                        {/* <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                                            <EditIcon className="w-5 h-5" />
                                        </button> */}

                                        <button
                                            onClick={() => handleDelete(addr.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Excluir endereço"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </main>

            <BottomNavigation cartItemCount={itemCount} />
        </div>
    );
}
