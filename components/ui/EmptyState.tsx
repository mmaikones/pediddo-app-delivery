'use client';

import React from 'react';

interface EmptyStateProps {
    icon?: string | React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {icon && (
                <div className="mb-4">
                    {typeof icon === 'string' ? (
                        <span className="text-6xl">{icon}</span>
                    ) : (
                        icon
                    )}
                </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
            {description && (
                <p className="text-gray-500 mb-6 max-w-xs">{description}</p>
            )}
            {action}
        </div>
    );
}
