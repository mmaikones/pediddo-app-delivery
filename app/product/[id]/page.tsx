'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout';
import { Button, QuantitySelector, Skeleton } from '@/components/ui';
import { useCart } from '@/contexts';
import { getProductRepository } from '@/repositories';
import { validateSelections, getSelectedOptionsForCart } from '@/services/validation';
import { Product, OptionGroup, formatCentsToBRL } from '@/types';

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { addItem } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedByGroup, setSelectedByGroup] = useState<Map<string, string[]>>(new Map());
    const [notes, setNotes] = useState('');
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    useEffect(() => {
        const loadProduct = async () => {
            setIsLoading(true);
            const repo = getProductRepository();
            const data = await repo.getProductById(id);
            setProduct(data);
            setIsLoading(false);
        };
        loadProduct();
    }, [id]);

    const handleToggleOption = (group: OptionGroup, optionId: string) => {
        setSelectedByGroup(prev => {
            const newMap = new Map(prev);
            const currentSelected = prev.get(group.id) || [];

            if (group.maxSelections === 1) {
                // Radio behavior
                if (currentSelected.includes(optionId)) {
                    newMap.set(group.id, []);
                } else {
                    newMap.set(group.id, [optionId]);
                }
            } else {
                // Checkbox behavior
                if (currentSelected.includes(optionId)) {
                    newMap.set(group.id, currentSelected.filter(id => id !== optionId));
                } else if (currentSelected.length < group.maxSelections) {
                    newMap.set(group.id, [...currentSelected, optionId]);
                }
            }

            return newMap;
        });

        // Limpa erros ao selecionar
        setValidationErrors([]);
    };

    const calculateTotal = (): number => {
        if (!product) return 0;

        let total = product.priceCents;

        for (const group of product.optionGroups) {
            const selectedIds = selectedByGroup.get(group.id) || [];
            for (const optionId of selectedIds) {
                const option = group.options.find(o => o.id === optionId);
                if (option) {
                    total += option.extraPriceCents;
                }
            }
        }

        return total * quantity;
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Valida seleções
        const validation = validateSelections(product.optionGroups, selectedByGroup);

        if (!validation.isValid) {
            setValidationErrors(validation.errors.map(e => e.message));
            return;
        }

        setIsAddingToCart(true);

        // Monta opções selecionadas
        const selectedOptions = getSelectedOptionsForCart(product.optionGroups, selectedByGroup);

        // Adiciona ao carrinho
        addItem(product, quantity, selectedOptions, notes || undefined);

        setIsAddingToCart(false);
        setShowSuccess(true);

        setTimeout(() => {
            router.push('/cart');
        }, 500);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header showBack title="Carregando..." />
                <div className="p-4 space-y-4">
                    <Skeleton className="w-full h-64 rounded-xl" />
                    <Skeleton variant="text" className="w-3/4 h-6" />
                    <Skeleton variant="text" className="w-full h-4" />
                    <Skeleton variant="text" className="w-1/2 h-8" />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header showBack title="Produto não encontrado" />
                <div className="flex flex-col items-center justify-center h-[60vh]">
                    <p className="text-6xl mb-4">😕</p>
                    <p className="text-gray-500 mb-4">Produto não encontrado</p>
                    <Link href="/">
                        <Button variant="primary">Voltar ao cardápio</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button Floating */}
            <Link
                href="/"
                className="fixed top-4 left-4 z-50 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </Link>

            {/* Product Image */}
            <div className="relative h-72 w-full">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {product.isPopular && (
                    <span className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
                        🔥 Popular
                    </span>
                )}
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-t-3xl -mt-6 relative z-10 pb-32">
                <div className="p-4">
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-2xl font-bold text-red-500">
                            {formatCentsToBRL(product.priceCents)}
                        </span>
                        {product.preparationTime > 0 && (
                            <span className="flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {product.preparationTime} min
                            </span>
                        )}
                    </div>

                    {/* Validation Errors */}
                    {validationErrors.length > 0 && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            {validationErrors.map((error, idx) => (
                                <p key={idx} className="text-sm text-red-600">{error}</p>
                            ))}
                        </div>
                    )}

                    {/* Option Groups */}
                    {product.optionGroups.map((group) => {
                        const activeOptions = group.options.filter(o => o.isActive);
                        const selectedIds = selectedByGroup.get(group.id) || [];

                        if (activeOptions.length === 0) return null;

                        return (
                            <div key={group.id} className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold">{group.name}</h3>
                                        <p className="text-xs text-gray-500">
                                            {group.isRequired ? 'Obrigatório' : 'Opcional'}
                                            {group.maxSelections > 1 && ` • Máx: ${group.maxSelections}`}
                                        </p>
                                    </div>
                                    {group.isRequired && selectedIds.length === 0 && (
                                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">
                                            Selecione {group.minSelections}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {activeOptions.map((option) => {
                                        const isSelected = selectedIds.includes(option.id);

                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => handleToggleOption(group, option.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${isSelected
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-red-500 bg-red-500' : 'border-gray-300'
                                                        }`}>
                                                        {isSelected && (
                                                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <span className={isSelected ? 'font-medium' : ''}>{option.name}</span>
                                                </div>
                                                {option.extraPriceCents > 0 && (
                                                    <span className={`text-sm ${isSelected ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                                        +{formatCentsToBRL(option.extraPriceCents)}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}

                    {/* Notes */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observações (opcional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Ex: Sem cebola, bem passado..."
                            className="input resize-none"
                            rows={3}
                        />
                    </div>
                </div>
            </div>

            {/* Fixed Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-40">
                <div className="flex items-center gap-4">
                    <QuantitySelector
                        value={quantity}
                        onChange={setQuantity}
                        min={1}
                        max={10}
                    />

                    <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        isLoading={isAddingToCart}
                    >
                        {showSuccess ? (
                            <>✓ Adicionado!</>
                        ) : (
                            <>Adicionar • {formatCentsToBRL(calculateTotal())}</>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
