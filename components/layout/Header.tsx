'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
    title?: string;
    showBack?: boolean;
    rightAction?: React.ReactNode;
}

export function Header({ title, showBack, rightAction }: HeaderProps) {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <Link
                            href="/"
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                    )}

                    {title ? (
                        <h1 className="text-lg font-bold">{title}</h1>
                    ) : (
                        <Link href="/" className="flex items-center gap-1">
                            <span className="text-xl font-bold">
                                <span className="text-red-500">Pedid</span>
                                <span className="text-orange-500">do</span>
                            </span>
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {rightAction}
                </div>
            </div>
        </header>
    );
}
