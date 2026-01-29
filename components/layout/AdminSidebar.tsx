'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/orders', label: 'Pedidos', icon: '📋' },
    { href: '/admin/products', label: 'Produtos', icon: '🍔' },
    { href: '/admin/customers', label: 'Clientes', icon: '👥' },
];

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                <div className="p-4 border-b border-gray-100">
                    <Link href="/admin" className="flex items-center gap-2" onClick={onClose}>
                        <span className="text-xl font-bold">
                            <span className="text-red-500">Pedid</span>
                            <span className="text-orange-500">do</span>
                        </span>
                        <span className="text-sm text-gray-500">Admin</span>
                    </Link>
                </div>

                <nav className="p-4">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href !== '/admin' && pathname.startsWith(item.href));

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                      ${isActive
                                                ? 'bg-red-50 text-red-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        <span className="text-xl">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                        <span className="text-xl">🏪</span>
                        <span>Ver Loja</span>
                    </Link>
                </div>
            </aside>
        </>
    );
}
