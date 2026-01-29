'use client';

import React from 'react';

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}

export function QuantitySelector({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false
}: QuantitySelectorProps) {
    const handleDecrement = () => {
        if (value > min && !disabled) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max && !disabled) {
            onChange(value + 1);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${disabled || value <= min
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                    }`}
                aria-label="Diminuir quantidade"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
            </button>

            <span className="w-8 text-center font-semibold tabular-nums">
                {value}
            </span>

            <button
                type="button"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${disabled || value >= max
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700'
                    }`}
                aria-label="Aumentar quantidade"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
    );
}
