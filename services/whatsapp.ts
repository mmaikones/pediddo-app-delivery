import { Order, formatCentsToBRL } from '@/types';

// Configuração do WhatsApp da empresa
export const WHATSAPP_CONFIG = {
    // Número do WhatsApp da empresa (formato: código país + DDD + número)
    phoneNumber: '5511999999999', // TODO: Substituir pelo número real

    // Horário de atendimento
    businessHours: 'Seg-Dom, 11h às 23h'
};

// Formata o pedido para enviar via WhatsApp
export function formatOrderForWhatsApp(order: Order, customerName: string): string {
    const paymentLabels: Record<string, string> = {
        'PIX': 'PIX',
        'CASH': 'Dinheiro',
        'CREDIT': 'Cartão de Crédito',
        'DEBIT': 'Cartão de Débito'
    };

    const itemsList = order.items
        .map(item => {
            let line = `• ${item.quantity}x ${item.productName} - ${formatCentsToBRL(item.lineTotalCents)}`;
            if (item.selectedOptions.length > 0) {
                line += `\n   _${item.selectedOptions.map(o => o.name).join(', ')}_`;
            }
            if (item.notes) {
                line += `\n   _Obs: ${item.notes}_`;
            }
            return line;
        })
        .join('\n');

    const address = order.addressSnapshot;
    const addressText = `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''}\n${address.neighborhood}`;

    const paymentText = paymentLabels[order.paymentSnapshot.type] || order.paymentSnapshot.type;
    const changeText = order.paymentSnapshot.changeForCents
        ? `\n💵 Troco para: ${formatCentsToBRL(order.paymentSnapshot.changeForCents)}`
        : '';

    const message = `
🍔 *NOVO PEDIDO - ${order.displayCode}*

👤 *Cliente:* ${customerName}

📦 *Itens:*
${itemsList}

📍 *Endereço:*
${addressText}

💳 *Pagamento:* ${paymentText}${changeText}

💰 *Subtotal:* ${formatCentsToBRL(order.subtotalCents)}
🛵 *Entrega:* ${formatCentsToBRL(order.deliveryFeeCents)}
*TOTAL: ${formatCentsToBRL(order.totalCents)}*

${order.notes ? `📝 *Observações:* ${order.notes}` : ''}
`.trim();

    return message;
}

// Gera a URL do WhatsApp com a mensagem do pedido
export function getWhatsAppOrderUrl(order: Order, customerName: string): string {
    const message = formatOrderForWhatsApp(order, customerName);
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
}

// Mensagem genérica de contato
export function getWhatsAppContactUrl(message: string = 'Olá! Gostaria de informações.'): string {
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
}

// Mensagem para PIX
export function getWhatsAppPixUrl(orderCode: string, total: number): string {
    const message = `Olá! Segue o comprovante do PIX para o pedido *${orderCode}* no valor de *${formatCentsToBRL(total)}*.`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
}
