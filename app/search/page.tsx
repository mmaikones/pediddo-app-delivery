'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header, BottomNavigation } from '@/components/layout';
import { Input, Card } from '@/components/ui';
import { useCart } from '@/contexts';
import { getProductRepository } from '@/repositories';
import { Product, formatCentsToBRL } from '@/types';

export default function SearchPage() {
    const { itemCount } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const repo = getProductRepository();
            const data = await repo.getProducts();
            setProducts(data.filter(p => p.isActive));
            setIsLoading(false);
        };
        load();
    }, []);

    const results = useMemo(() => {
        if (!query.trim()) return [];

        const q = query.toLowerCase();
        return products.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        );
    }, [products, query]);

    const suggestions = useMemo(() => {
        if (query.trim()) return [];
        return products.filter(p => p.isPopular).slice(0, 4);
    }, [products, query]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Buscar" />

            <main className="p-4 pb-24">
                <Input
                    placeholder="Buscar hambúrguer, pizza..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                    rightIcon={query ? (
                        <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : undefined}
                />

                {/* Loading */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full" />
                    </div>
                )}

                {/* Suggestions */}
                {!isLoading && suggestions.length > 0 && (
                    <div className="mt-6">
                        <h2 className="text-sm font-semibold text-gray-500 mb-3">🔥 Populares</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {suggestions.map(product => (
                                <Link key={product.id} href={`/product/${product.id}`}>
                                    <Card className="flex items-center gap-3 p-3">
                                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="48px"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                                            <p className="text-xs text-red-500 font-semibold">
                                                {formatCentsToBRL(product.priceCents)}
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results */}
                {!isLoading && query && (
                    <div className="mt-6">
                        <p className="text-sm text-gray-500 mb-3">
                            {results.length} resultado{results.length !== 1 ? 's' : ''} para "{query}"
                        </p>

                        {results.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-4xl mb-2">🔍</p>
                                <p className="text-gray-500">Nenhum produto encontrado</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {results.map(product => (
                                    <Link key={product.id} href={`/product/${product.id}`}>
                                        <Card className="flex gap-4 hover:shadow-md transition-shadow">
                                            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="96px"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0 py-1">
                                                <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                                                    {product.description}
                                                </p>
                                                <p className="font-bold text-red-500 mt-2">
                                                    {formatCentsToBRL(product.priceCents)}
                                                </p>
                                            </div>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <BottomNavigation cartItemCount={itemCount} />
        </div>
    );
}
