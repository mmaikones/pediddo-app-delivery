'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { ProductForm } from '@/components/admin/ProductForm';
import { getProductRepository } from '@/repositories';
import { Skeleton } from '@/components/ui';

export default function NewProductPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadData = async () => {
            try {
                const repo = getProductRepository();
                const cats = await repo.getCategories();
                setCategories(cats);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="space-y-6 max-w-4xl mx-auto p-4">
                <Skeleton className="h-8 w-64 rounded mb-8" />
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold">Novo Produto</h1>
            </div>

            <ProductForm categories={categories} />
        </div>
    );
}
