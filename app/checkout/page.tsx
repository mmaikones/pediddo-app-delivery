'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Button, Input, Card, UserIcon, LocationIcon, CreditCardIcon, CashIcon, PhoneIcon, NotesIcon, CartIcon, QRCodeIcon, DeliveryIcon } from '@/components/ui';
import { useCart, useOrders, useCustomer } from '@/contexts';
import { CustomerAddress, PaymentMethodType, formatCentsToBRL } from '@/types';

// Plus Icon wrapper
function PlusIcon({ className = 'w-6 h-6' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, isEmpty, clearCart, itemCount } = useCart();
    const { createOrder } = useOrders();
    const { customer, updateCustomerInfo, getDefaultAddress } = useCustomer();

    // Customer info
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');

    // Address
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

    // Payment
    const [paymentType, setPaymentType] = useState<PaymentMethodType>('PIX');
    const [changeFor, setChangeFor] = useState('');

    // Notes
    const [notes, setNotes] = useState('');

    // State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Inicializa com dados do customer
    useEffect(() => {
        if (customer.name) setCustomerName(customer.name);
        if (customer.phone) setCustomerPhone(customer.phone);

        const defaultAddr = getDefaultAddress();
        if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
        } else if (customer.addresses.length > 0) {
            setSelectedAddressId(customer.addresses[0].id);
        }
    }, [customer, getDefaultAddress]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!customerName.trim()) newErrors.customerName = 'Nome é obrigatório';
        if (!customerPhone.trim()) newErrors.customerPhone = 'Telefone é obrigatório';

        if (customer.addresses.length === 0) {
            newErrors.address = 'Cadastre um endereço de entrega';
        } else if (!selectedAddressId) {
            newErrors.address = 'Selecione um endereço';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate() || isEmpty) return;

        setIsSubmitting(true);

        try {
            // Atualiza dados do customer
            updateCustomerInfo(customerName, customerPhone);

            // Obtém endereço selecionado
            const address = customer.addresses.find(a => a.id === selectedAddressId);
            if (!address) throw new Error('Endereço não encontrado');

            // Monta payment method
            const payment = {
                type: paymentType,
                changeForCents: paymentType === 'CASH' && changeFor
                    ? Math.round(parseFloat(changeFor.replace(',', '.')) * 100)
                    : undefined
            };

            // Cria pedido
            const order = await createOrder(cart, address, payment, notes || undefined);

            // Limpa carrinho
            clearCart();

            // Redireciona para pedido
            router.push(`/orders/${order.id}?success=true`);
        } catch (error) {
            console.error(error);
            setIsSubmitting(false);
        }
    };

    if (isEmpty) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header title="Finalizar Pedido" showBack />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <CartIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Carrinho vazio</h2>
                        <p className="text-gray-500 mb-6">Adicione itens antes de finalizar.</p>
                        <Link href="/">
                            <Button variant="primary">Ver Cardápio</Button>
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const selectedAddress = customer.addresses.find(a => a.id === selectedAddressId);

    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <Header showBack title="Finalizar Pedido" />

            <main className="p-4 space-y-6">
                {/* 1. Dados Pessoais */}
                <section>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-red-500" /> Seus dados
                    </h3>
                    <Card className="p-4 space-y-4">
                        <Input
                            label="Nome completo"
                            placeholder="Seu nome"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            error={errors.customerName}
                        />
                        <Input
                            label="Telefone / WhatsApp"
                            placeholder="(00) 90000-0000"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            error={errors.customerPhone}
                            type="tel"
                        />
                    </Card>
                </section>

                {/* 2. Endereço de Entrega */}
                <section>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <LocationIcon className="w-5 h-5 text-red-500" /> Endereço de entrega
                    </h3>

                    {customer.addresses.length === 0 ? (
                        <Card className="p-6 text-center border-dashed border-2 border-gray-200">
                            <p className="text-gray-500 mb-4">Você ainda não tem endereços cadastrados.</p>
                            <Link href="/profile/addresses/new?returnUrl=/checkout">
                                <Button variant="outline" fullWidth className="flex items-center justify-center gap-2">
                                    <PlusIcon className="w-5 h-5" />
                                    Cadastrar Endereço
                                </Button>
                            </Link>
                            {errors.address && <p className="text-red-500 text-sm mt-2">{errors.address}</p>}
                        </Card>
                    ) : (
                        <div className="space-y-3">
                            {/* Lista de Endereços Simplificada (apenas select) */}
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {customer.addresses.map((addr) => (
                                    <button
                                        key={addr.id}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                        className={`flex-shrink-0 w-64 p-3 rounded-xl border text-left transition-all ${selectedAddressId === addr.id
                                            ? 'bg-red-50 border-red-500 ring-1 ring-red-500'
                                            : 'bg-white border-gray-200 hover:border-red-200'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm block truncate">{addr.label}</span>
                                            {selectedAddressId === addr.id && (
                                                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-600 truncate">{addr.street}, {addr.number}</p>
                                        <p className="text-xs text-gray-500 truncate">{addr.neighborhood}</p>
                                    </button>
                                ))}

                                <Link href="/profile/addresses/new?returnUrl=/checkout" className="flex-shrink-0">
                                    <button className="h-full px-4 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500 hover:bg-red-50 transition-colors min-w-[100px]">
                                        <PlusIcon className="w-6 h-6 mb-1" />
                                        <span className="text-xs font-medium">Novo</span>
                                    </button>
                                </Link>
                            </div>

                            {/* Detalhes do Endereço Selecionado */}
                            {selectedAddress && (
                                <Card className="p-4 bg-gray-50 border-none">
                                    <p className="font-medium text-gray-900">
                                        Entregar em: {selectedAddress.street}, {selectedAddress.number}
                                    </p>
                                    {selectedAddress.complement && (
                                        <p className="text-sm text-gray-600">Complemento: {selectedAddress.complement}</p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        {selectedAddress.neighborhood} - {selectedAddress.city}/{selectedAddress.state}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">CEP: {selectedAddress.zipCode}</p>
                                </Card>
                            )}
                        </div>
                    )}
                </section>

                {/* 3. Pagamento */}
                <section>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <CreditCardIcon className="w-5 h-5 text-red-500" /> Forma de pagamento
                    </h3>

                    <div className="space-y-3">
                        {/* Opções de Pagamento */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setPaymentType('PIX')}
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentType === 'PIX'
                                    ? 'bg-red-50 border-red-500 text-red-600 ring-1 ring-red-500'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <QRCodeIcon className="w-6 h-6" />
                                <span className="text-sm font-medium">PIX (Online)</span>
                            </button>

                            <button
                                onClick={() => setPaymentType('CREDIT')} // Default para entrega
                                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentType !== 'PIX'
                                    ? 'bg-red-50 border-red-500 text-red-600 ring-1 ring-red-500'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <DeliveryIcon className="w-6 h-6" />
                                <span className="text-sm font-medium">Na Entrega</span>
                            </button>
                        </div>

                        {/* Detalhes do Pagamento */}
                        <Card className="p-4 bg-gray-50 border-none animate-fade-in">
                            {paymentType === 'PIX' ? (
                                <div className="text-center py-2">
                                    <p className="text-sm font-medium text-gray-800 mb-1">Pagamento via PIX</p>
                                    <p className="text-xs text-gray-500">
                                        Use o código QR ou Copia e Cola após finalizar o pedido.
                                        Envie o comprovante pelo WhatsApp.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-gray-800">Escolha como pagar na entrega:</p>

                                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="deliveryPayment"
                                            className="w-4 h-4 text-red-500 focus:ring-red-500"
                                            checked={paymentType === 'CASH'}
                                            onChange={() => setPaymentType('CASH')}
                                        />
                                        <div className="flex-1 flex items-center justify-between">
                                            <span className="flex items-center gap-2 text-sm">
                                                <CashIcon className="w-5 h-5 text-green-600" /> Dinheiro
                                            </span>
                                        </div>
                                    </label>

                                    {paymentType === 'CASH' && (
                                        <div className="pl-8">
                                            <Input
                                                label="Precisa de troco para quanto?"
                                                placeholder="R$ 0,00"
                                                value={changeFor}
                                                onChange={(e) => setChangeFor(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="deliveryPayment"
                                            className="w-4 h-4 text-red-500 focus:ring-red-500"
                                            checked={paymentType === 'CREDIT'}
                                            onChange={() => setPaymentType('CREDIT')}
                                        />
                                        <div className="flex-1">
                                            <span className="flex items-center gap-2 text-sm">
                                                <CreditCardIcon className="w-5 h-5 text-blue-600" /> Cartão de Crédito
                                            </span>
                                        </div>
                                    </label>

                                    <label className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="deliveryPayment"
                                            className="w-4 h-4 text-red-500 focus:ring-red-500"
                                            checked={paymentType === 'DEBIT'}
                                            onChange={() => setPaymentType('DEBIT')}
                                        />
                                        <div className="flex-1">
                                            <span className="flex items-center gap-2 text-sm">
                                                <CreditCardIcon className="w-5 h-5 text-orange-600" /> Cartão de Débito
                                            </span>
                                        </div>
                                    </label>
                                </div>
                            )}
                        </Card>
                    </div>
                </section>

                {/* 4. Observações */}
                <section>
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <NotesIcon className="w-5 h-5 text-red-500" /> Observações
                    </h3>
                    <Card className="p-4">
                        <textarea
                            className="w-full text-sm border-gray-200 rounded-lg focus:ring-red-500 focus:border-red-500"
                            rows={3}
                            placeholder="Alguma observação sobre o pedido ou entrega? (Ex: campainha quebrada, deixar na portaria)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                    </Card>
                </section>

                {/* Resumo de Valores */}
                <Card className="bg-gray-50 border-none p-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatCentsToBRL(cart.subtotalCents)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Taxa de entrega</span>
                            <span>{formatCentsToBRL(cart.deliveryFeeCents)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-red-500">{formatCentsToBRL(cart.totalCents)}</span>
                        </div>
                    </div>
                </Card>
            </main>

            {/* Confirm Button Fixed Bottom */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-30 pb-safe">
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="shadow-lg shadow-red-500/30"
                >
                    {isSubmitting ? 'Processando...' : 'Confirmar Pedido'}
                </Button>
            </div>

        </div>
    );
}
