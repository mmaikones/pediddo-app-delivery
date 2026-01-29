'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge, Input, Skeleton } from '@/components/ui';
import { getProductRepository } from '@/repositories';
import { Product, Category, formatCentsToBRL } from '@/types';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

    const loadProducts = async () => {
        const repo = getProductRepository();
        const [productsData, categoriesData] = await Promise.all([
            repo.getAllProducts(),
            repo.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await loadProducts();
            setIsLoading(false);
        };
        init();
    }, []);

    const handleToggleActive = async (productId: string, newActive: boolean) => {
        const repo = getProductRepository();
        await repo.toggleProductActive(productId, newActive);
        await loadProducts();
    };

    const filteredProducts = useMemo(() => {
        let result = products;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        if (categoryFilter) {
            result = result.filter(p => p.categoryId === categoryFilter);
        }

        if (statusFilter === 'ACTIVE') {
            result = result.filter(p => p.isActive);
        } else if (statusFilter === 'INACTIVE') {
            result = result.filter(p => !p.isActive);
        }

        return result;
    }, [products, searchQuery, categoryFilter, statusFilter]);

    return (
        <div>
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Produtos</h1>
                        <p className="text-gray-500">Gerencie os produtos do cardápio</p>
                    </div>
                    <Link href="/admin/products/new">
                        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Novo Produto
                        </button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="space-y-4 mb-6">
                <Input
                    placeholder="Buscar produto..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                />

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setCategoryFilter(null)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryFilter === null
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Todas
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setCategoryFilter(cat.id)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryFilter === cat.id
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cat.icon} {cat.name}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === status
                                ? 'bg-gray-800 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {status === 'ALL' ? 'Todos' : status === 'ACTIVE' ? 'Ativos' : 'Inativos'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products List */}
            {isLoading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                </div>
            ) : filteredProducts.length === 0 ? (
                <Card className="text-center py-12">
                    <p className="text-4xl mb-3">🍽️</p>
                    <p className="text-gray-500">Nenhum produto encontrado</p>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredProducts.map((product) => {
                        const category = categories.find(c => c.id === product.categoryId);

                        return (
                            <Card key={product.id} className={`${!product.isActive ? 'opacity-60' : ''}`}>
                                <div className="flex gap-4">
                                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <Link href={`/admin/products/${product.id}`}>
                                                    <h3 className="font-semibold hover:text-red-500 transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                {category && (
                                                    <span className="text-xs text-gray-500">{category.icon} {category.name}</span>
                                                )}
                                            </div>
                                            <Badge variant={product.isActive ? 'success' : 'error'} size="sm">
                                                {product.isActive ? 'Ativo' : 'Inativo'}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-red-500">
                                                {formatCentsToBRL(product.priceCents)}
                                            </span>

                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleToggleActive(product.id, !product.isActive);
                                                }}
                                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${product.isActive
                                                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    }`}
                                            >
                                                {product.isActive ? 'Desativar' : 'Ativar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
