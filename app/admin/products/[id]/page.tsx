'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge, Button, Skeleton } from '@/components/ui';
import { getProductRepository } from '@/repositories';
import { Product, OptionGroup, formatCentsToBRL } from '@/types';

interface AdminProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function AdminProductDetailPage({ params }: AdminProductDetailPageProps) {
    const { id } = use(params);

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const loadProduct = async () => {
        const repo = getProductRepository();
        const data = await repo.getProductById(id);
        setProduct(data);
    };

    useEffect(() => {
        const init = async () => {
            setIsLoading(true);
            await loadProduct();
            setIsLoading(false);
        };
        init();
    }, [id]);

    const handleToggleProductActive = async () => {
        if (!product || isUpdating) return;
        setIsUpdating(true);

        const repo = getProductRepository();
        await repo.toggleProductActive(product.id, !product.isActive);
        await loadProduct();

        setIsUpdating(false);
    };

    const handleToggleOptionActive = async (optionId: string, currentActive: boolean) => {
        if (isUpdating) return;
        setIsUpdating(true);

        const repo = getProductRepository();
        await repo.toggleOptionActive(optionId, !currentActive);
        await loadProduct();

        setIsUpdating(false);
    };

    if (isLoading) {
        return (
            <div>
                <Skeleton className="w-48 h-8 mb-6" />
                <div className="grid lg:grid-cols-3 gap-6">
                    <Skeleton className="h-64 rounded-xl" />
                    <Skeleton className="h-64 rounded-xl lg:col-span-2" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="text-center py-16">
                <p className="text-6xl mb-4">😕</p>
                <p className="text-gray-500 mb-4">Produto não encontrado</p>
                <Link href="/admin/products">
                    <Button variant="primary">Voltar aos produtos</Button>
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <p className="text-gray-500">{formatCentsToBRL(product.priceCents)}</p>
                </div>
                <Badge variant={product.isActive ? 'success' : 'error'} size="lg">
                    {product.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Product Info */}
                <div className="space-y-6">
                    <Card>
                        <div className="relative h-48 rounded-xl overflow-hidden mb-4">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="300px"
                            />
                            {product.isPopular && (
                                <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                    🔥 Popular
                                </span>
                            )}
                        </div>

                        <h3 className="font-semibold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-600 mt-2">{product.description}</p>

                        <div className="flex items-center gap-4 mt-4">
                            <span className="text-xl font-bold text-red-500">
                                {formatCentsToBRL(product.priceCents)}
                            </span>
                            {product.preparationTime > 0 && (
                                <span className="text-sm text-gray-500">
                                    ⏱️ {product.preparationTime} min
                                </span>
                            )}
                        </div>
                    </Card>

                    <Card>
                        <h3 className="font-semibold mb-4">Ações</h3>
                        <Link href={`/admin/products/${product.id}/edit`} className="block mb-3">
                            <Button
                                variant="outline"
                                fullWidth
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                ✏️ Editar Dados
                            </Button>
                        </Link>

                        <Button
                            variant={product.isActive ? 'outline' : 'primary'}
                            fullWidth
                            onClick={handleToggleProductActive}
                            disabled={isUpdating}
                            isLoading={isUpdating}
                        >
                            {product.isActive ? '⏸️ Desativar Produto' : '▶️ Ativar Produto'}
                        </Button>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            {product.isActive
                                ? 'O produto está visível no cardápio'
                                : 'O produto não aparece no cardápio'}
                        </p>
                    </Card>
                </div>

                {/* Option Groups */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold mb-4">Grupos de Opções</h2>

                    {product.optionGroups.length === 0 ? (
                        <Card className="text-center py-12">
                            <p className="text-4xl mb-3">⚙️</p>
                            <p className="text-gray-500">Nenhum grupo de opções</p>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {product.optionGroups.map((group) => (
                                <Card key={group.id}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="font-semibold">{group.name}</h3>
                                            <p className="text-xs text-gray-500">
                                                {group.isRequired ? 'Obrigatório' : 'Opcional'}
                                                {' • '}
                                                Mín: {group.minSelections} / Máx: {group.maxSelections}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {group.options.map((option) => (
                                            <div
                                                key={option.id}
                                                className={`flex items-center justify-between p-3 rounded-xl border ${option.isActive
                                                    ? 'border-gray-200 bg-white'
                                                    : 'border-red-200 bg-red-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${option.isActive ? 'bg-green-500' : 'bg-red-500'
                                                        }`} />
                                                    <div>
                                                        <span className={option.isActive ? '' : 'text-gray-400 line-through'}>
                                                            {option.name}
                                                        </span>
                                                        {option.extraPriceCents > 0 && (
                                                            <span className="text-sm text-gray-500 ml-2">
                                                                +{formatCentsToBRL(option.extraPriceCents)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => handleToggleOptionActive(option.id, option.isActive)}
                                                    disabled={isUpdating}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${option.isActive
                                                        ? 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                                                        }`}
                                                >
                                                    {option.isActive ? '⏸️ Pausar' : '▶️ Ativar'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
