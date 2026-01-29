// ===== PRICING SERVICE =====
// Lógica de cálculo de preços em centavos

import { CartItem, SelectedOption, MoneyCents } from '@/types';

/**
 * Calcula o total unitário de um item (preço base + opções selecionadas)
 */
export function calcUnitTotalCents(
    basePriceCents: MoneyCents,
    selectedOptions: SelectedOption[]
): MoneyCents {
    const optionsTotal = selectedOptions.reduce(
        (sum, opt) => sum + opt.extraPriceCents,
        0
    );
    return basePriceCents + optionsTotal;
}

/**
 * Calcula o total da linha (unitTotal * quantidade)
 */
export function calcLineTotalCents(
    unitTotalCents: MoneyCents,
    quantity: number
): MoneyCents {
    return unitTotalCents * quantity;
}

/**
 * Calcula os totais completos de um item do carrinho
 */
export function calcCartItemTotals(
    basePriceCents: MoneyCents,
    selectedOptions: SelectedOption[],
    quantity: number
): { unitTotalCents: MoneyCents; lineTotalCents: MoneyCents } {
    const unitTotalCents = calcUnitTotalCents(basePriceCents, selectedOptions);
    const lineTotalCents = calcLineTotalCents(unitTotalCents, quantity);
    return { unitTotalCents, lineTotalCents };
}

/**
 * Calcula subtotal e total do carrinho
 */
export function calcCartTotals(
    items: CartItem[],
    deliveryFeeCents: MoneyCents
): { subtotalCents: MoneyCents; totalCents: MoneyCents } {
    const subtotalCents = items.reduce((sum, item) => sum + item.lineTotalCents, 0);
    const totalCents = subtotalCents + deliveryFeeCents;
    return { subtotalCents, totalCents };
}

/**
 * Recalcula todos os totais de um item
 */
export function recalculateCartItem(item: CartItem): CartItem {
    const { unitTotalCents, lineTotalCents } = calcCartItemTotals(
        item.basePriceCents,
        item.selectedOptions,
        item.quantity
    );
    return { ...item, unitTotalCents, lineTotalCents };
}

/**
 * Taxa de entrega padrão (599 centavos = R$ 5,99)
 */
export const DEFAULT_DELIVERY_FEE_CENTS: MoneyCents = 599;
