'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category, OptionGroup, ProductOption } from '@/types';
import { Button, Input, Card } from '@/components/ui';
import { getProductRepository } from '@/repositories';
import { useRouter } from 'next/navigation';

interface ProductFormProps {
    initialData?: Product;
    categories: Category[];
    onSave?: (product: Product) => void;
}

export function ProductForm({ initialData, categories, onSave }: ProductFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Form States
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [price, setPrice] = useState(initialData?.priceCents ? (initialData.priceCents / 100).toFixed(2) : '');
    const [categoryId, setCategoryId] = useState(initialData?.categoryId || categories[0]?.id || '');
    const [image, setImage] = useState(initialData?.image || '');
    const [prepTime, setPrepTime] = useState(initialData?.preparationTime?.toString() || '20');
    const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
    const [isPopular, setIsPopular] = useState(initialData?.isPopular ?? false);

    // Option Groups State (complex)
    const [optionGroups, setOptionGroups] = useState<OptionGroup[]>(initialData?.optionGroups || []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const priceCents = Math.round(parseFloat(price.replace(',', '.')) * 100);

            const productData: Partial<Product> = {
                name,
                description,
                priceCents,
                categoryId,
                image,
                isActive,
                isPopular,
                preparationTime: parseInt(prepTime),
                optionGroups // In a real backend, these would be saved separately
            };

            const repo = getProductRepository();

            if (initialData?.id) {
                await repo.updateProduct(initialData.id, productData);
                // Also update option groups manually for mock
                // In real app, this logic would be in backend
                for (const group of optionGroups) {
                    if (group.id.startsWith('new-')) {
                        // Create group
                        // This part is tricky with mock repo pattern without full backend
                        // We will rely on the repo's updateProduct handling it or ignore for now
                    }
                }
            } else {
                await repo.createProduct(productData as any);
            }

            if (onSave) {
                // onSave not really needed if we redirect
            }
            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Erro ao salvar produto');
        } finally {
            setIsLoading(false);
        }
    };

    // Option Groups Management
    const addGroup = () => {
        const newGroup: OptionGroup = {
            id: `new-${Date.now()}`,
            productId: initialData?.id || '',
            name: 'Novo Grupo',
            isRequired: false,
            minSelections: 0,
            maxSelections: 1,
            sortOrder: optionGroups.length,
            options: []
        };
        setOptionGroups([...optionGroups, newGroup]);
    };

    const removeGroup = (groupId: string) => {
        setOptionGroups(optionGroups.filter(g => g.id !== groupId));
    };

    const updateGroup = (groupId: string, data: Partial<OptionGroup>) => {
        setOptionGroups(optionGroups.map(g => g.id === groupId ? { ...g, ...data } : g));
    };

    const addOption = (groupId: string) => {
        const group = optionGroups.find(g => g.id === groupId);
        if (!group) return;

        const newOption: ProductOption = {
            id: `new-opt-${Date.now()}`,
            groupId,
            name: 'Nova Opção',
            extraPriceCents: 0,
            isActive: true,
            sortOrder: group.options.length
        };

        const updatedGroup = {
            ...group,
            options: [...group.options, newOption]
        };

        setOptionGroups(optionGroups.map(g => g.id === groupId ? updatedGroup : g));
    };

    const removeOption = (groupId: string, optionId: string) => {
        const group = optionGroups.find(g => g.id === groupId);
        if (!group) return;

        const updatedGroup = {
            ...group,
            options: group.options.filter(o => o.id !== optionId)
        };

        setOptionGroups(optionGroups.map(g => g.id === groupId ? updatedGroup : g));
    };

    const updateOption = (groupId: string, optionId: string, data: Partial<ProductOption>) => {
        const group = optionGroups.find(g => g.id === groupId);
        if (!group) return;

        const updatedOptions = group.options.map(o => o.id === optionId ? { ...o, ...data } : o);
        const updatedGroup = { ...group, options: updatedOptions };

        setOptionGroups(optionGroups.map(g => g.id === groupId ? updatedGroup : g));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-20">
            <Card className="p-6 space-y-4">
                <h3 className="text-lg font-bold border-b pb-2 mb-4">Dados Básicos</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Nome do Produto" value={name} onChange={e => setName(e.target.value)} required />
                    <Input label="Preço (R$)" value={price} onChange={e => setPrice(e.target.value)} required placeholder="0.00" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <select
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                            value={categoryId}
                            onChange={e => setCategoryId(e.target.value)}
                        >
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <Input label="Tempo de Preparo (min)" type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} required />
                </div>

                <Input label="URL da Imagem" value={image} onChange={e => setImage(e.target.value)} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                    <textarea
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                        rows={3}
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>

                <div className="flex gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
                        <span className="font-medium">Produto Ativo</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={isPopular} onChange={e => setIsPopular(e.target.checked)} className="w-5 h-5 text-yellow-500 rounded focus:ring-yellow-500" />
                        <span className="font-medium">Produto Popular (Destaque)</span>
                    </label>
                </div>
            </Card>

            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Grupos de Adicionais/Opções</h3>
                <Button type="button" variant="outline" onClick={addGroup} size="sm">
                    + Adicionar Grupo
                </Button>
            </div>

            {optionGroups.map((group, gIndex) => (
                <Card key={group.id} className="p-6 border-l-4 border-l-red-500 bg-gray-50">
                    <div className="flex justify-between items-start mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 mr-4">
                            <Input
                                label="Nome do Grupo (ex: Tamanho, Molho)"
                                value={group.name}
                                onChange={e => updateGroup(group.id, { name: e.target.value })}
                            />
                            <div className="flex gap-2">
                                <Input
                                    label="Min"
                                    type="number"
                                    value={group.minSelections}
                                    onChange={e => {
                                        const val = parseInt(e.target.value);
                                        updateGroup(group.id, { minSelections: isNaN(val) ? 0 : val });
                                    }}
                                />
                                <Input
                                    label="Max"
                                    type="number"
                                    value={group.maxSelections}
                                    onChange={e => {
                                        const val = parseInt(e.target.value);
                                        updateGroup(group.id, { maxSelections: isNaN(val) ? 0 : val });
                                    }}
                                />
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={group.isRequired}
                                        onChange={e => updateGroup(group.id, { isRequired: e.target.checked })}
                                        className="w-4 h-4 text-red-600 rounded"
                                    />
                                    <span className="text-sm font-medium">Obrigatório</span>
                                </label>
                            </div>
                        </div>
                        <button type="button" onClick={() => removeGroup(group.id)} className="text-red-500 hover:text-red-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>

                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                        {group.options.map((option) => (
                            <div key={option.id} className="flex gap-2 items-center bg-white p-2 rounded shadow-sm">
                                <input
                                    className="flex-1 border-gray-200 rounded text-sm"
                                    placeholder="Nome da opção"
                                    value={option.name}
                                    onChange={e => updateOption(group.id, option.id, { name: e.target.value })}
                                />
                                <div className="w-32 flex items-center gap-1">
                                    <span className="text-sm text-gray-500">R$</span>
                                    <input
                                        className="w-full border-gray-200 rounded text-sm"
                                        type="number"
                                        placeholder="0.00"
                                        value={isNaN(option.extraPriceCents) ? '' : (option.extraPriceCents / 100).toFixed(2)}
                                        onChange={e => {
                                            const val = parseFloat(e.target.value);
                                            updateOption(group.id, option.id, { extraPriceCents: isNaN(val) ? 0 : Math.round(val * 100) });
                                        }}
                                    />
                                </div>
                                <button type="button" onClick={() => removeOption(group.id, option.id)} className="text-gray-400 hover:text-red-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        ))}
                        <Button type="button" variant="ghost" size="sm" onClick={() => addOption(group.id)} className="mt-2 text-sm text-gray-500">
                            + Adicionar Opção
                        </Button>
                    </div>

                </Card>
            ))}

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-end gap-4 z-40 lg:pl-64">
                <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
                <Button type="submit" variant="primary" disabled={isLoading}>
                    {isLoading ? 'Salvando...' : 'Salvar Produto'}
                </Button>
            </div>
        </form>
    );
}
