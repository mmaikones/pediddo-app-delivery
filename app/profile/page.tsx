'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, BottomNavigation } from '@/components/layout';
import { Card, Button, LocationIcon, CreditCardIcon, UserIcon, PackageIcon } from '@/components/ui';
import { useCart, useAuth } from '@/contexts';

// Ícones SVG locais
function HelpIcon({ className = 'w-6 h-6' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function SettingsIcon({ className = 'w-6 h-6' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function LogoutIcon({ className = 'w-6 h-6' }: { className?: string }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );
}

export default function ProfilePage() {
    const { itemCount } = useCart();
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();

    const menuItems = [
        { Icon: PackageIcon, label: 'Meus Pedidos', href: '/orders', disabled: false },
        { Icon: LocationIcon, label: 'Meus endereços', href: '/profile/addresses', disabled: false },
        { Icon: CreditCardIcon, label: 'Formas de pagamento', href: '/profile/payments', disabled: true },
        { Icon: HelpIcon, label: 'Ajuda e FAQ', href: '/help', disabled: false },
    ];

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center mb-8">
                    <UserIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900">Você não está logado</h2>
                    <p className="text-gray-500">Entre para ver seu perfil e pedidos</p>
                </div>
                <div className="w-full max-w-xs space-y-3">
                    <Link href="/login" className="block">
                        <Button variant="primary" fullWidth size="lg">Entrar</Button>
                    </Link>
                    <Link href="/register" className="block">
                        <Button variant="outline" fullWidth size="lg">Criar conta</Button>
                    </Link>
                </div>
                <BottomNavigation cartItemCount={itemCount} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Perfil" />

            <main className="p-4 pb-24">
                {/* User Info */}
                <Card className="mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-2xl">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="text-lg font-bold truncate">
                                {user?.name}
                            </h2>
                            <p className="text-sm text-gray-500 truncate">
                                {user?.phone}
                            </p>
                            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                        </div>
                    </div>
                </Card>

                {/* Menu Items */}
                <div className="space-y-2 mb-6">
                    {menuItems.map((item) => {
                        const Icon = item.Icon;
                        return item.disabled ? (
                            <div key={item.label} className="opacity-50 cursor-not-allowed">
                                <Card className="flex items-center gap-4 p-4">
                                    <Icon className="w-6 h-6 text-gray-400" />
                                    <span className="flex-1 font-medium">{item.label}</span>
                                    <span className="text-xs text-gray-400">Em breve</span>
                                </Card>
                            </div>
                        ) : (
                            <Link key={item.label} href={item.href}>
                                <Card className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                                    <Icon className="w-6 h-6 text-red-500" />
                                    <span className="flex-1 font-medium">{item.label}</span>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Card>
                            </Link>
                        );
                    })}
                </div>

                {/* How It Works Link */}
                <Link href="/how-it-works" className="block mb-2">
                    <Card className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1 font-medium">Como Funciona</span>
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Card>
                </Link>

                {/* Admin Link (Only for admins) */}
                {user?.role === 'admin' && (
                    <Link href="/admin">
                        <Card className="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 hover:shadow-md transition-shadow mb-2">
                            <SettingsIcon className="w-6 h-6 text-red-500" />
                            <div className="flex-1">
                                <span className="font-medium text-red-600">Painel Administrativo</span>
                                <p className="text-xs text-gray-500">Gerenciar pedidos e produtos</p>
                            </div>
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Card>
                    </Link>
                )}

                {/* Logout Button */}
                <button onClick={logout} className="w-full text-left">
                    <Card className="flex items-center gap-4 p-4 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100 group">
                        <LogoutIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
                        <span className="flex-1 font-medium text-gray-600 group-hover:text-red-600">Sair da conta</span>
                    </Card>
                </button>

                {/* Version */}
                <p className="text-center text-xs text-gray-400 mt-8">
                    Pediddo v1.0.0 - MVP
                </p>
            </main>

            <BottomNavigation cartItemCount={itemCount} />
        </div>
    );
}
