'use client';

import React from 'react';
import Link from 'next/link';
import { Header, BottomNavigation } from '@/components/layout';
import { Card, Button } from '@/components/ui';
import { useCart } from '@/contexts';

// Ícones SVG para os passos
function SearchStepIcon({ className = 'w-8 h-8' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );
}

function CartStepIcon({ className = 'w-8 h-8' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    );
}

function PaymentStepIcon({ className = 'w-8 h-8' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    );
}

function DeliveryStepIcon({ className = 'w-8 h-8' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
    );
}

function EnjoyStepIcon({ className = 'w-8 h-8' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

const steps = [
    {
        number: 1,
        title: 'Escolha seus Favoritos',
        description: 'Navegue pelo nosso cardápio e escolha os itens que mais te deixam com água na boca. Temos hambúrgueres artesanais, pizzas, bebidas e sobremesas!',
        Icon: SearchStepIcon,
        color: 'from-red-500 to-red-600'
    },
    {
        number: 2,
        title: 'Monte seu Pedido',
        description: 'Adicione os itens ao carrinho, personalize com adicionais e escolha a quantidade. Revise tudo antes de finalizar.',
        Icon: CartStepIcon,
        color: 'from-orange-500 to-orange-600'
    },
    {
        number: 3,
        title: 'Escolha como Pagar',
        description: 'Pague pelo PIX (envie o comprovante por WhatsApp), ou escolha pagar na entrega com cartão de crédito/débito ou dinheiro.',
        Icon: PaymentStepIcon,
        color: 'from-yellow-500 to-yellow-600'
    },
    {
        number: 4,
        title: 'Acompanhe a Entrega',
        description: 'Seu pedido é enviado para nosso WhatsApp e você pode acompanhar cada etapa. Preparamos tudo com carinho e enviamos até você!',
        Icon: DeliveryStepIcon,
        color: 'from-green-500 to-green-600'
    },
    {
        number: 5,
        title: 'Aproveite!',
        description: 'Receba seu pedido quentinho e fresquinho na sua porta. Bom apetite!',
        Icon: EnjoyStepIcon,
        color: 'from-blue-500 to-blue-600'
    }
];

const paymentMethods = [
    {
        name: 'PIX',
        description: 'Pagamento instantâneo. Após confirmar, envie o comprovante pelo WhatsApp.',
        icon: '💎'
    },
    {
        name: 'Cartão na Entrega',
        description: 'Crédito ou débito na maquininha do entregador.',
        icon: '💳'
    },
    {
        name: 'Dinheiro',
        description: 'Pague em dinheiro. Informe se precisa de troco.',
        icon: '💵'
    }
];

export default function HowItWorksPage() {
    const { itemCount } = useCart();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBack title="Como Funciona" />

            <main className="p-4 pb-24 space-y-8">
                {/* Hero Section */}
                <div className="text-center py-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Pedir é <span className="text-red-500">super fácil!</span>
                    </h1>
                    <p className="text-gray-500">
                        Siga os passos abaixo e receba seu pedido rapidinho
                    </p>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    {steps.map((step, index) => {
                        const Icon = step.Icon;
                        return (
                            <Card key={step.number} className="overflow-hidden">
                                <div className="flex gap-4 p-4">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-gray-400">PASSO {step.number}</span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-1">{step.title}</h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex justify-center pb-2">
                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Payment Methods */}
                <div>
                    <h2 className="text-lg font-bold mb-4 text-center">Formas de Pagamento</h2>
                    <div className="grid grid-cols-1 gap-3">
                        {paymentMethods.map((method) => (
                            <Card key={method.name} className="p-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl">{method.icon}</span>
                                    <div>
                                        <h3 className="font-semibold">{method.name}</h3>
                                        <p className="text-sm text-gray-500">{method.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Delivery Info */}
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-100">
                    <div className="p-6 text-center">
                        <DeliveryStepIcon className="w-12 h-12 mx-auto mb-3 text-red-500" />
                        <h3 className="font-bold text-lg mb-2">Entrega Rápida</h3>
                        <p className="text-gray-600 mb-2">
                            <span className="font-semibold text-red-500">30-50 minutos</span> em média
                        </p>
                        <p className="text-sm text-gray-500">
                            Taxa de entrega: <span className="font-medium">R$ 5,99</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Frete grátis acima de R$ 80,00
                        </p>
                    </div>
                </Card>

                {/* CTA */}
                <div className="text-center space-y-3">
                    <Link href="/">
                        <Button variant="primary" size="lg" fullWidth>
                            Ver Cardápio
                        </Button>
                    </Link>
                    <Link href="/help" className="block text-sm text-gray-500 hover:text-red-500">
                        Ainda tem dúvidas? Veja nosso FAQ
                    </Link>
                </div>
            </main>

            <BottomNavigation cartItemCount={itemCount} />
        </div>
    );
}
