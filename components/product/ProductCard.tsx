'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    return (
        <Link href={`/product/${product.id}`}>
            <div className="card p-0 h-full group">
                <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    {product.isPopular && (
                        <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            🔥 Popular
                        </span>
                    )}
                    {!product.isActive && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-semibold">Indisponível</span>
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-[2rem]">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                        <span className="price text-sm">{formatPrice(product.price)}</span>
                        {product.preparationTime > 0 && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {product.preparationTime} min
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
