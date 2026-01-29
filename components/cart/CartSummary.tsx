'use client';

import React from 'react';
import { Cart } from '@/types';

interface CartSummaryProps {
    cart: Cart;
}

export function CartSummary({ cart }: CartSummaryProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    return (
        <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxa de entrega</span>
                <span>{formatPrice(cart.deliveryFee)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-lg text-red-500">{formatPrice(cart.total)}</span>
            </div>
        </div>
    );
}
