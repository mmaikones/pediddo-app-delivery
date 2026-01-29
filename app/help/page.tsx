'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header, BottomNavigation } from '@/components/layout';
import { Card } from '@/components/ui';
import { useCart } from '@/contexts';

interface FAQItem {
    question: string;
    answer: string;
}

const faqItems: FAQItem[] = [
    {
        question: 'Qual o tempo de entrega?',
        answer: 'O tempo médio de entrega é de 30 a 50 minutos, dependendo da sua localização e do horário do pedido. Em horários de pico, pode haver um pequeno atraso.'
    },
    {
        question: 'Qual a taxa de entrega?',
        answer: 'A taxa de entrega é de R$ 5,99 para toda a região atendida. Pedidos acima de R$ 80,00 têm frete grátis!'
    },
    {
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos PIX (pagamento online), cartão de crédito e débito (na maquininha do entregador) e dinheiro (com opção de troco).'
    },
    {
        question: 'Como faço para pagar com PIX?',
        answer: 'Ao escolher PIX como forma de pagamento, você receberá as instruções após confirmar o pedido. Faça o pagamento e envie o comprovante pelo WhatsApp para agilizar a confirmação.'
    },
    {
        question: 'Posso cancelar meu pedido?',
        answer: 'Sim, você pode cancelar seu pedido antes que ele entre em preparo. Entre em contato pelo WhatsApp para solicitar o cancelamento.'
    },
    {
        question: 'Como acompanho meu pedido?',
        answer: 'Após realizar o pedido, você pode acompanhar o status em tempo real na seção "Meus Pedidos". Também enviamos atualizações pelo WhatsApp.'
    },
    {
        question: 'Vocês entregam na minha região?',
        answer: 'Atendemos toda a região central e bairros próximos. Se tiver dúvida sobre sua localização, entre em contato pelo WhatsApp.'
    },
    {
        question: 'Posso fazer alterações no meu pedido?',
        answer: 'Alterações podem ser feitas até o momento em que o pedido entra em preparo. Nesses casos, entre em contato rapidamente pelo WhatsApp.'
    },
    {
        question: 'Os ingredientes são frescos?',
        answer: 'Sim! Trabalhamos apenas com ingredientes selecionados e preparamos tudo na hora do pedido para garantir a melhor qualidade.'
    },
    {
        question: 'Vocês têm opções vegetarianas?',
        answer: 'Sim, temos opções vegetarianas no cardápio. Confira a categoria "Saudáveis" ou pergunte ao atendente pelo WhatsApp.'
    }
];

// Ícone de seta
function ChevronIcon({ isOpen, className = 'w-5 h-5' }: { isOpen: boolean; className?: string }) {
    return (
        <svg
            className={`${className} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    );
}

function QuestionIcon({ className = 'w-6 h-6' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

export default function HelpPage() {
    const { itemCount } = useCart();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const whatsappNumber = '5511999999999'; // Substituir pelo número real
    const whatsappMessage = encodeURIComponent('Olá! Tenho uma dúvida sobre o Pediddo.');

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBack title="Ajuda" />

            <main className="p-4 pb-24 space-y-6">
                {/* Header Section */}
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <QuestionIcon className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">Como podemos ajudar?</h1>
                    <p className="text-sm text-gray-500 mt-1">Encontre respostas para suas dúvidas</p>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 gap-3">
                    <Link href="/how-it-works">
                        <Card className="p-4 text-center hover:shadow-md transition-shadow">
                            <svg className="w-8 h-8 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-medium text-sm">Como Funciona</p>
                        </Card>
                    </Link>
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-gradient-to-br from-green-500 to-green-600 text-white">
                            <WhatsAppIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="font-medium text-sm">Falar no WhatsApp</p>
                        </Card>
                    </a>
                </div>

                {/* FAQ Section */}
                <div>
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <QuestionIcon className="w-5 h-5 text-red-500" />
                        Perguntas Frequentes
                    </h2>

                    <div className="space-y-2">
                        {faqItems.map((item, index) => (
                            <Card key={index} className="overflow-hidden">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full p-4 flex items-center justify-between text-left"
                                >
                                    <span className="font-medium text-sm pr-4">{item.question}</span>
                                    <ChevronIcon isOpen={openIndex === index} className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                </button>
                                {openIndex === index && (
                                    <div className="px-4 pb-4 pt-0">
                                        <p className="text-sm text-gray-600 leading-relaxed">{item.answer}</p>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Contact Section */}
                <Card className="text-center p-6">
                    <h3 className="font-semibold mb-2">Ainda tem dúvidas?</h3>
                    <p className="text-sm text-gray-500 mb-4">
                        Nossa equipe está pronta para ajudar você
                    </p>
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                    >
                        <WhatsAppIcon className="w-5 h-5" />
                        Falar com Atendente
                    </a>
                    <p className="text-xs text-gray-400 mt-3">
                        Atendimento: Seg-Dom, 11h às 23h
                    </p>
                </Card>
            </main>

            <BottomNavigation cartItemCount={itemCount} />
        </div>
    );
}
