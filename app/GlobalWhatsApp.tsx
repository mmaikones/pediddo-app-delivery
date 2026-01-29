'use client';

import { usePathname } from 'next/navigation';
import { WhatsAppButton } from '@/components/layout';

export function GlobalWhatsApp() {
    const pathname = usePathname();

    // Não mostra no admin
    if (pathname.startsWith('/admin')) return null;

    return <WhatsAppButton />;
}
