'use client';

import React from 'react';
import { OptionGroup, ProductOption, CartItemOption } from '@/types';

interface OptionGroupSelectorProps {
    group: OptionGroup;
    selectedOptions: CartItemOption[];
    onToggleOption: (option: ProductOption) => void;
}

export function OptionGroupSelector({
    group,
    selectedOptions,
    onToggleOption
}: OptionGroupSelectorProps) {
    const activeOptions = group.options.filter(opt => opt.isActive);
    const selectedCount = selectedOptions.filter(
        so => activeOptions.some(ao => ao.id === so.optionId)
    ).length;

    const isOptionSelected = (optionId: string) =>
        selectedOptions.some(so => so.optionId === optionId);

    const formatPrice = (price: number) => {
        if (price === 0) return '';
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(price);
    };

    const canSelectMore = selectedCount < group.maxSelections;
    const isRadio = group.maxSelections === 1;

    if (activeOptions.length === 0) return null;

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h4 className="font-semibold">{group.name}</h4>
                    <p className="text-xs text-gray-500">
                        {group.isRequired ? 'Obrigatório' : 'Opcional'} •
                        {group.minSelections > 0 && ` Mín: ${group.minSelections}`}
                        {group.maxSelections > 1 && ` Máx: ${group.maxSelections}`}
                    </p>
                </div>
                {group.isRequired && selectedCount < group.minSelections && (
                    <span className="badge badge-warning text-xs">Selecione {group.minSelections - selectedCount}</span>
                )}
            </div>

            <div className="space-y-2">
                {activeOptions.map((option) => {
                    const isSelected = isOptionSelected(option.id);
                    const isDisabled = !isSelected && !canSelectMore;

                    return (
                        <button
                            key={option.id}
                            type="button"
                            onClick={() => !isDisabled && onToggleOption(option)}
                            disabled={isDisabled}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${isSelected
                                    ? 'border-red-500 bg-red-50'
                                    : isDisabled
                                        ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-5 h-5 rounded-${isRadio ? 'full' : 'md'} border-2 flex items-center justify-center transition-all ${isSelected
                                            ? 'border-red-500 bg-red-500'
                                            : 'border-gray-300'
                                        }`}
                                >
                                    {isSelected && (
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <span className={`font-medium ${isSelected ? 'text-red-600' : ''}`}>
                                    {option.name}
                                </span>
                            </div>
                            {option.extraPrice > 0 && (
                                <span className={`text-sm ${isSelected ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                                    +{formatPrice(option.extraPrice)}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
