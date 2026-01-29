'use client';

import React from 'react';
import { Category } from '@/types';

interface CategoryTabsProps {
    categories: Category[];
    selectedCategory: string | null;
    onSelect: (categoryId: string | null) => void;
}

export function CategoryTabs({
    categories,
    selectedCategory,
    onSelect
}: CategoryTabsProps) {
    return (
        <div className="overflow-x-auto -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-2 py-2">
                <button
                    onClick={() => onSelect(null)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === null
                            ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    <span>✨</span>
                    <span>Todos</span>
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => onSelect(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category.id
                                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
