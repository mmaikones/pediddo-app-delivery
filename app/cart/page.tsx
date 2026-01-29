'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header, BottomNavigation } from '@/components/layout';
import { Button, EmptyState, QuantitySelector, Card, CartIcon } from '@/components/ui';
import { useCart } from '@/contexts';
import { formatCentsToBRL } from '@/types';

export default function CartPage() {
    const { cart, itemCount, isEmpty, updateItemQuantity, removeItem, isLoaded } = useCart();

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header showBack title="Carrinho" />
                <div className="flex items-center justify-center h-[60vh]">
                    <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBack title={`Carrinho ${itemCount > 0 ? `(${itemCount})` : ''}`} />

            <main className="safe-bottom">
                {isEmpty ? (
                    <EmptyState
                        icon={<CartIcon className="w-16 h-16 text-gray-300" />}
                        title="Seu carrinho está vazio"
                        description="Adicione itens deliciosos ao seu carrinho para continuar"
                        action={
                            <Link href="/">
                                <Button variant="primary">Ver cardápio</Button>
                            </Link>
                        }
                    />
                ) : (
                    <div className="p-4 pb-40 space-y-4">
                        {/* Cart Items */}
                        <div className="space-y-3">
                            {cart.items.map((item) => (
                                <Card key={item.id} className="p-4">
                                    <div className="flex gap-3">
                                        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.productImage}
                                                alt={item.productName}
                                                fill
                                                className="object-cover"
                                                sizes="80px"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-semibold text-sm line-clamp-1">
                                                    {item.productName}
                                                </h3>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    aria-label="Remover item"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {item.selectedOptions.length > 0 && (
                                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                    {item.selectedOptions.map(opt => opt.name).join(', ')}
                                                </p>
                                            )}

                                            {item.notes && (
                                                <p className="text-xs text-gray-400 italic mt-1 line-clamp-1">
                                                    Obs: {item.notes}
                                                </p>
                                            )}

                                            <div className="flex items-center justify-between mt-3">
                                                <QuantitySelector
                                                    value={item.quantity}
                                                    onChange={(qty) => updateItemQuantity(item.id, qty)}
                                                    min={1}
                                                    max={10}
                                                />
                                                <span className="text-sm font-bold text-red-500">
                                                    {formatCentsToBRL(item.lineTotalCents)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Add more items */}
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 py-3 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Adicionar mais itens
                        </Link>

                        {/* Summary */}
                        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span>{formatCentsToBRL(cart.subtotalCents)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Taxa de entrega</span>
                                <span>{formatCentsToBRL(cart.deliveryFeeCents)}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                                <span>Total</span>
                                <span className="text-lg text-red-500">{formatCentsToBRL(cart.totalCents)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Fixed Checkout Button */}
            {!isEmpty && (
                <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-100 p-4 z-30">
                    <Link href="/checkout" className="block">
                        <Button variant="primary" size="lg" fullWidth>
                            Finalizar pedido • {formatCentsToBRL(cart.totalCents)}
                        </Button>
                    </Link>
                </div>
            )}

            <BottomNavigation cartItemCount={itemCount} />
        </div>
    );
}
