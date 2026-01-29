'use client';

import { CartProvider, OrdersProvider, CustomerProvider, AuthProvider } from '@/contexts';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CustomerProvider>
                <CartProvider>
                    <OrdersProvider>
                        {children}
                    </OrdersProvider>
                </CartProvider>
            </CustomerProvider>
        </AuthProvider>
    );
}
