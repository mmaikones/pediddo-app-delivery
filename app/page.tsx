'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header, BottomNavigation } from '@/components/layout';
import { CategoryTabs, ProductCard } from '@/components/product';
import { Card, Skeleton, FireIcon } from '@/components/ui';
import { useCart } from '@/contexts';
import { getProductRepository } from '@/repositories';
import { Product, Category, formatCentsToBRL } from '@/types';

export default function HomePage() {
  const { itemCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const repo = getProductRepository();
      const [productsData, categoriesData] = await Promise.all([
        repo.getProducts(),
        repo.getCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Filtra apenas produtos ativos
  const activeProducts = useMemo(() => {
    return products.filter(p => p.isActive);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!selectedCategoryId) return activeProducts;
    return activeProducts.filter(p => p.categoryId === selectedCategoryId);
  }, [activeProducts, selectedCategoryId]);

  const popularProducts = useMemo(() => {
    return activeProducts.filter(p => p.isPopular).slice(0, 5);
  }, [activeProducts]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-bold">
              <span className="text-red-500">Pedid</span>
              <span className="text-orange-500">do</span>
            </span>
          </Link>
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 bg-gray-100 rounded-full transition-colors"
          >
            Admin
          </Link>
        </div>
      </header>

      <main className="safe-bottom">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-8 text-white">
          <h1 className="text-2xl font-bold mb-1">
            O que você quer<br />comer hoje?
          </h1>
          <p className="text-white/80 text-sm mb-4">
            Entrega em 30-50 min
          </p>

          {/* Search Link */}
          <Link href="/search" className="block">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center gap-3">
              <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-white/70">Buscar hambúrguer, pizza...</span>
            </div>
          </Link>
        </div>

        {/* Categories */}
        <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
          <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategoryId(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategoryId === null
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Todos
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategoryId === cat.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="p-4 pb-24">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-56 rounded-xl" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Popular Section (only on "Todos") */}
              {selectedCategoryId === null && popularProducts.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FireIcon className="w-5 h-5 text-orange-500" /> Mais Pedidos
                  </h2>
                  <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
                    <div className="flex gap-4" style={{ width: 'max-content' }}>
                      {popularProducts.map(product => (
                        <Link key={product.id} href={`/product/${product.id}`}>
                          <div className="w-44 bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-32">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                sizes="176px"
                              />
                              <span className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                Popular
                              </span>
                            </div>
                            <div className="p-3">
                              <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                              <p className="text-xs text-gray-500 line-clamp-1 mt-1">{product.description}</p>
                              <p className="font-bold text-red-500 mt-2">{formatCentsToBRL(product.priceCents)}</p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* All Products */}
              <div>
                <h2 className="text-lg font-bold mb-4">
                  {selectedCategoryId
                    ? categories.find(c => c.id === selectedCategoryId)?.name
                    : 'Cardápio'}
                </h2>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 mx-auto mb-2 text-gray-300"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>
                    <p className="text-gray-500">Nenhum produto encontrado</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {filteredProducts.map(product => (
                      <Link key={product.id} href={`/product/${product.id}`}>
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full">
                          <div className="relative h-32">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 200px"
                            />
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1 h-8">{product.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold text-red-500">{formatCentsToBRL(product.priceCents)}</span>
                              {product.preparationTime > 0 && (
                                <span className="text-xs text-gray-400">{product.preparationTime}min</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <BottomNavigation cartItemCount={itemCount} />
    </div>
  );
}
