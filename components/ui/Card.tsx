'use client';

import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    flat?: boolean;
    padding?: boolean;
}

export function Card({
    children,
    className = '',
    onClick,
    flat = false,
    padding = true
}: CardProps) {
    return (
        <div
            className={`card ${flat ? 'card-flat' : ''} ${padding ? 'p-4' : ''} ${onClick ? 'cursor-pointer' : ''
                } ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}
