'use client';

import React from 'react';
import Image from 'next/image';
import { CartItem } from '@/types';
import { QuantitySelector } from '@/components/ui';

interface CartItemCardProps {
    item: CartItem;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

export function CartItemCard({
    item,
    onUpdateQuantity,
    onRemove
}: CartItemCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    return (
        <div className="card p-4">
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
                            onClick={() => onRemove(item.id)}
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
                            onChange={(qty) => onUpdateQuantity(item.id, qty)}
                            min={1}
                            max={10}
                        />
                        <span className="price text-sm font-bold">
                            {formatPrice(item.totalPrice)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
