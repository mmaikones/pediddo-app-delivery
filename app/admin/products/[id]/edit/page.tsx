'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { getProductRepository } from '@/repositories';
import { Skeleton } from '@/components/ui';

export default function EditProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                const repo = getProductRepository();
                const [prod, cats] = await Promise.all([
                    repo.getProductById(params.id),
                    repo.getCategories()
                ]);

                if (!prod) {
                    alert('Produto não encontrado');
                    router.push('/admin/products');
                    return;
                }

                setProduct(prod);
                setCategories(cats);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [params.id, router]);

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto p-4">
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <Skeleton className="h-8 w-64 rounded" />
                </div>
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold">Editar Produto: {product.name}</h1>
            </div>

            <ProductForm initialData={product} categories={categories} />
        </div>
    );
}
