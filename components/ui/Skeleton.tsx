'use client';

import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
}

export function Skeleton({
    className = '',
    variant = 'rectangular',
    width,
    height
}: SkeletonProps) {
    const variantClasses = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg'
    };

    const style: React.CSSProperties = {};
    if (width) style.width = typeof width === 'number' ? `${width}px` : width;
    if (height) style.height = typeof height === 'number' ? `${height}px` : height;

    return (
        <div
            className={`skeleton ${variantClasses[variant]} ${className}`}
            style={style}
        />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="card p-0">
            <Skeleton className="w-full h-32" />
            <div className="p-3 space-y-2">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-full h-3" />
                <Skeleton variant="text" className="w-1/2" />
            </div>
        </div>
    );
}

export function OrderCardSkeleton() {
    return (
        <div className="card p-4 space-y-3">
            <div className="flex justify-between">
                <Skeleton variant="text" className="w-24" />
                <Skeleton variant="text" className="w-20" />
            </div>
            <Skeleton variant="text" className="w-full" />
            <div className="flex gap-3">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton variant="text" className="w-3/4" />
                    <Skeleton variant="text" className="w-1/2 h-3" />
                </div>
            </div>
        </div>
    );
}
