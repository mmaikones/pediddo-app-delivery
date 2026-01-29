// ===== VALIDATION SERVICE =====
// Validação de seleções de opções

import { OptionGroup, ProductOption } from '@/types';

export interface ValidationError {
    groupId: string;
    groupName: string;
    message: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
}

/**
 * Valida seleções de opções de um produto
 */
export function validateSelections(
    optionGroups: OptionGroup[],
    selectedOptionsByGroup: Map<string, string[]>
): ValidationResult {
    const errors: ValidationError[] = [];

    for (const group of optionGroups) {
        const selectedIds = selectedOptionsByGroup.get(group.id) || [];
        const activeOptions = group.options.filter(opt => opt.isActive);

        // Filtra apenas opções ativas selecionadas
        const validSelectedIds = selectedIds.filter(id =>
            activeOptions.some(opt => opt.id === id)
        );

        const selectedCount = validSelectedIds.length;

        // Verifica obrigatoriedade
        if (group.isRequired && selectedCount === 0) {
            errors.push({
                groupId: group.id,
                groupName: group.name,
                message: `Selecione pelo menos uma opção em "${group.name}"`
            });
            continue;
        }

        // Verifica mínimo
        if (selectedCount < group.minSelections) {
            errors.push({
                groupId: group.id,
                groupName: group.name,
                message: `Selecione pelo menos ${group.minSelections} opção(ões) em "${group.name}"`
            });
            continue;
        }

        // Verifica máximo
        if (selectedCount > group.maxSelections) {
            errors.push({
                groupId: group.id,
                groupName: group.name,
                message: `Selecione no máximo ${group.maxSelections} opção(ões) em "${group.name}"`
            });
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Verifica se uma opção pode ser selecionada
 */
export function canSelectOption(
    group: OptionGroup,
    currentSelectedIds: string[],
    optionId: string
): boolean {
    const option = group.options.find(o => o.id === optionId);

    // Não pode selecionar opção inativa
    if (!option || !option.isActive) return false;

    // Se já está selecionada, pode desselecionar
    if (currentSelectedIds.includes(optionId)) return true;

    // Verifica se pode adicionar mais
    return currentSelectedIds.length < group.maxSelections;
}

/**
 * Obtém opções selecionadas formatadas para o carrinho/pedido
 */
export function getSelectedOptionsForCart(
    optionGroups: OptionGroup[],
    selectedOptionsByGroup: Map<string, string[]>
): { groupId: string; optionId: string; name: string; extraPriceCents: number }[] {
    const result: { groupId: string; optionId: string; name: string; extraPriceCents: number }[] = [];

    for (const group of optionGroups) {
        const selectedIds = selectedOptionsByGroup.get(group.id) || [];

        for (const optionId of selectedIds) {
            const option = group.options.find(o => o.id === optionId && o.isActive);
            if (option) {
                result.push({
                    groupId: group.id,
                    optionId: option.id,
                    name: option.name,
                    extraPriceCents: option.extraPriceCents
                });
            }
        }
    }

    return result;
}
