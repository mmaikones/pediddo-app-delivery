'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Header, BottomNavigation } from '@/components/layout';
import { Card, Badge, Button, Skeleton, LocationIcon, CreditCardIcon, CheckCircleIcon, SadIcon } from '@/components/ui';
import { useCart, useOrders, useCustomer } from '@/contexts';
import { Order, OrderStatus, formatCentsToBRL } from '@/types';
import { getWhatsAppOrderUrl, getWhatsAppPixUrl } from '@/services';

// Ícones SVG para status
function PendingIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function ReceivedIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function PreparingIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );
}

function DeliveryIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
    );
}

function DeliveredIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );
}

function CanceledIcon({ className = 'w-4 h-4' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

const statusConfig: Record<OrderStatus, { label: string; color: 'primary' | 'info' | 'warning' | 'success' | 'error'; Icon: React.FC<{ className?: string }> }> = {
    PENDING: { label: 'Pendente', color: 'warning', Icon: PendingIcon },
    RECEIVED: { label: 'Recebido', color: 'info', Icon: ReceivedIcon },
    PREPARING: { label: 'Em preparo', color: 'primary', Icon: PreparingIcon },
    OUT_FOR_DELIVERY: { label: 'Saiu para entrega', color: 'info', Icon: DeliveryIcon },
    DELIVERED: { label: 'Entregue', color: 'success', Icon: DeliveredIcon },
    CANCELED: { label: 'Cancelado', color: 'error', Icon: CanceledIcon },
};

const getPaymentLabel = (type: string) => {
    switch (type) {
        case 'PIX': return 'PIX';
        case 'CASH': return 'Dinheiro';
        case 'CREDIT': return 'Cartão de Crédito';
        case 'DEBIT': return 'Cartão de Débito';
        default: return type;
    }
};

interface OrderDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
    const { id } = use(params);
    const searchParams = useSearchParams();
    const isNewOrder = searchParams.get('success') === 'true';

    const { itemCount } = useCart();
    const { getOrderById, refreshOrders } = useOrders();
    const { customer } = useCustomer();

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadOrder = async () => {
            setIsLoading(true);
            await refreshOrders();
            const data = await getOrderById(id);
            setOrder(data);
            setIsLoading(false);
        };
        loadOrder();
    }, [id, getOrderById, refreshOrders]);

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header showBack title="Carregando..." />
                <div className="p-4 space-y-4">
                    <Skeleton className="h-32 rounded-xl" />
                    <Skeleton className="h-48 rounded-xl" />
                    <Skeleton className="h-32 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header showBack title="Pedido não encontrado" />
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <SadIcon className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 mb-4">Pedido não encontrado</p>
                    <Link href="/orders">
                        <Button variant="primary">Ver meus pedidos</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const currentStatus = statusConfig[order.status];
    const CurrentStatusIcon = currentStatus.Icon;
    const whatsappOrderUrl = getWhatsAppOrderUrl(order, customer.name || 'Cliente');
    const whatsappPixUrl = getWhatsAppPixUrl(order.displayCode, order.totalCents);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBack title={`Pedido ${order.displayCode}`} />

            <main className="p-4 pb-24 space-y-4">
                {/* Success Banner com WhatsApp */}
                {isNewOrder && (
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-5 text-center">
                        <CheckCircleIcon className="w-10 h-10 mx-auto mb-3" />
                        <p className="font-bold text-lg">Pedido realizado!</p>
                        <p className="text-sm opacity-90 mb-4">Envie o pedido para nosso WhatsApp para confirmação</p>

                        <a
                            href={whatsappOrderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                        >
                            <WhatsAppIcon className="w-5 h-5" />
                            Enviar Pedido no WhatsApp
                        </a>
                    </div>
                )}

                {/* PIX Payment Instructions */}
                {order.paymentSnapshot.type === 'PIX' && order.status === 'PENDING' && (
                    <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
                        <div className="p-4 text-center">
                            <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-cyan-800 mb-2">Pagamento PIX</h3>
                            <p className="text-sm text-cyan-700 mb-4">
                                Após realizar o pagamento, envie o comprovante pelo WhatsApp para agilizar a confirmação.
                            </p>
                            <div className="bg-white rounded-lg p-4 mb-4">
                                <p className="text-xs text-gray-500 mb-1">Chave PIX (CNPJ)</p>
                                <p className="font-mono font-bold text-lg">12.345.678/0001-99</p>
                                <p className="text-xs text-gray-500 mt-2">Valor</p>
                                <p className="font-bold text-2xl text-cyan-600">{formatCentsToBRL(order.totalCents)}</p>
                            </div>
                            <a
                                href={whatsappPixUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-green-600 transition-colors"
                            >
                                <WhatsAppIcon className="w-5 h-5" />
                                Enviar Comprovante
                            </a>
                        </div>
                    </Card>
                )}

                {/* Status Banner */}
                <Card className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                        <CurrentStatusIcon className="w-6 h-6" />
                    </div>
                    <Badge variant={currentStatus.color} size="lg">
                        {currentStatus.label}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-2">
                        Pedido realizado em {formatDate(order.createdAtISO)}
                    </p>

                    {/* Botão WhatsApp secundário */}
                    {!isNewOrder && (
                        <a
                            href={whatsappOrderUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-green-600 text-sm mt-3 hover:text-green-700"
                        >
                            <WhatsAppIcon className="w-4 h-4" />
                            Reenviar pedido via WhatsApp
                        </a>
                    )}
                </Card>

                {/* Timeline */}
                <Card>
                    <h3 className="font-semibold mb-4">Acompanhe seu pedido</h3>
                    <div className="space-y-4">
                        {order.timeline.map((event, index) => {
                            const eventStatus = statusConfig[event.status];
                            const EventIcon = eventStatus.Icon;
                            const isLast = index === order.timeline.length - 1;

                            return (
                                <div key={index} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isLast ? 'bg-red-500 text-white' : 'bg-gray-200'
                                            }`}>
                                            <EventIcon className="w-4 h-4" />
                                        </div>
                                        {index < order.timeline.length - 1 && (
                                            <div className="w-0.5 h-8 bg-gray-200 mt-1" />
                                        )}
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className={`font-medium ${isLast ? 'text-red-600' : 'text-gray-600'}`}>
                                            {eventStatus.label}
                                        </p>
                                        <p className="text-xs text-gray-500">{formatTime(event.atISO)}</p>
                                        {event.note && (
                                            <p className="text-xs text-gray-400 mt-1">{event.note}</p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Items */}
                <Card>
                    <h3 className="font-semibold mb-4">Itens do pedido</h3>
                    <div className="space-y-3">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex gap-3">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={item.productImage}
                                        alt={item.productName}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm">{item.quantity}x {item.productName}</p>
                                    {item.selectedOptions.length > 0 && (
                                        <p className="text-xs text-gray-500">
                                            {item.selectedOptions.map(o => o.name).join(', ')}
                                        </p>
                                    )}
                                    {item.notes && (
                                        <p className="text-xs text-gray-400 italic">Obs: {item.notes}</p>
                                    )}
                                    <p className="text-sm font-medium text-red-500 mt-1">
                                        {formatCentsToBRL(item.lineTotalCents)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Address */}
                <Card>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <LocationIcon className="w-5 h-5 text-red-500" /> Endereço de entrega
                    </h3>
                    <p className="text-sm text-gray-600">
                        {order.addressSnapshot.street}, {order.addressSnapshot.number}
                        {order.addressSnapshot.complement && ` - ${order.addressSnapshot.complement}`}
                    </p>
                    <p className="text-xs text-gray-500">
                        {order.addressSnapshot.neighborhood}
                    </p>
                </Card>

                {/* Payment */}
                <Card>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CreditCardIcon className="w-5 h-5 text-red-500" /> Pagamento
                    </h3>
                    <p className="text-sm text-gray-600">
                        {getPaymentLabel(order.paymentSnapshot.type)}
                        {order.paymentSnapshot.changeForCents && (
                            <span className="text-gray-500">
                                {' '}(troco para {formatCentsToBRL(order.paymentSnapshot.changeForCents)})
                            </span>
                        )}
                    </p>
                </Card>

                {/* Summary */}
                <Card>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatCentsToBRL(order.subtotalCents)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Taxa de entrega</span>
                            <span>{formatCentsToBRL(order.deliveryFeeCents)}</span>
                        </div>
                        <div className="border-t border-gray-100 pt-2 flex justify-between font-bold">
                            <span>Total</span>
                            <span className="text-red-500">{formatCentsToBRL(order.totalCents)}</span>
                        </div>
                    </div>
                </Card>

                {/* Notes */}
                {order.notes && (
                    <Card>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Observações
                        </h3>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                    </Card>
                )}
            </main>

            <BottomNavigation cartItemCount={itemCount} />
        </div>
    );
}
