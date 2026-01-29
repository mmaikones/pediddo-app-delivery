'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header, BottomNavigation } from '@/components/layout';
import { Card, Button, Input } from '@/components/ui';
import { useCart, useCustomer } from '@/contexts';

export default function NewAddressPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnUrl = searchParams.get('returnUrl');

    const { itemCount } = useCart();
    const { addAddress } = useCustomer();

    const [isLoading, setIsLoading] = useState(false);
    const [isSearchingCep, setIsSearchingCep] = useState(false);

    const [formData, setFormData] = useState({
        label: 'Casa',
        zipCode: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // Máscara de CEP (XXXXX-XXX)
        if (name === 'zipCode') {
            const numbers = value.replace(/\D/g, '');
            const masked = numbers.replace(/^(\d{5})(\d)/, '$1-$2').substr(0, 9);
            setFormData(prev => ({ ...prev, [name]: masked }));

            // Busca CEP quando completa 8 dígitos
            if (numbers.length === 8) {
                fetchAddressByCep(numbers);
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Limpa erro ao digitar
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const fetchAddressByCep = async (cep: string) => {
        setIsSearchingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setFormData(prev => ({
                    ...prev,
                    street: data.logradouro,
                    neighborhood: data.bairro,
                    city: data.localidade,
                    state: data.uf
                }));
                // Foca no número
                document.getElementById('number')?.focus();
            } else {
                setErrors(prev => ({ ...prev, zipCode: 'CEP não encontrado' }));
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            setErrors(prev => ({ ...prev, zipCode: 'Erro ao buscar CEP' }));
        } finally {
            setIsSearchingCep(false);
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.label) newErrors.label = 'Nome do local é obrigatório';
        if (!formData.zipCode || formData.zipCode.length < 9) newErrors.zipCode = 'CEP inválido';
        if (!formData.street) newErrors.street = 'Rua é obrigatória';
        if (!formData.number) newErrors.number = 'Número é obrigatório';
        if (!formData.neighborhood) newErrors.neighborhood = 'Bairro é obrigatório';
        if (!formData.city) newErrors.city = 'Cidade é obrigatória';
        if (!formData.state) newErrors.state = 'Estado é obrigatório';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsLoading(true);

        try {
            await addAddress({
                label: formData.label,
                street: formData.street,
                number: formData.number,
                complement: formData.complement,
                neighborhood: formData.neighborhood,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode,
                isDefault: false // O contexto já define se for o primeiro
            });

            if (returnUrl) {
                router.push(returnUrl);
            } else {
                router.push('/profile/addresses');
            }
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBack title="Novo Endereço" />

            <main className="p-4 pb-24">
                <Card className="p-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nome do Local */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do local</label>
                            <div className="flex gap-2 mb-2">
                                {['Casa', 'Trabalho', 'Outro'].map((label) => (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, label }))}
                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${formData.label === label
                                            ? 'bg-red-50 border-red-500 text-red-500'
                                            : 'bg-white border-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <Input
                                name="label"
                                placeholder="Ex: Minha Casa, Escritório"
                                value={formData.label}
                                onChange={handleInputChange}
                                error={errors.label}
                            />
                        </div>

                        {/* CEP */}
                        <div className="relative">
                            <Input
                                name="zipCode"
                                label="CEP"
                                placeholder="00000-000"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                error={errors.zipCode}
                                maxLength={9}
                            />
                            {isSearchingCep && (
                                <div className="absolute right-3 top-9">
                                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <Input
                                    name="street"
                                    label="Rua"
                                    placeholder="Nome da rua"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    error={errors.street}
                                    readOnly={isSearchingCep}
                                />
                            </div>
                            <div>
                                <Input
                                    id="number"
                                    name="number"
                                    label="Número"
                                    placeholder="123"
                                    value={formData.number}
                                    onChange={handleInputChange}
                                    error={errors.number}
                                />
                            </div>
                        </div>

                        <Input
                            name="complement"
                            label="Complemento (opcional)"
                            placeholder="Apto, Bloco, Referência"
                            value={formData.complement}
                            onChange={handleInputChange}
                        />

                        <Input
                            name="neighborhood"
                            label="Bairro"
                            placeholder="Bairro"
                            value={formData.neighborhood}
                            onChange={handleInputChange}
                            error={errors.neighborhood}
                            readOnly={isSearchingCep}
                        />

                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <Input
                                    name="city"
                                    label="Cidade"
                                    placeholder="Cidade"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    error={errors.city}
                                    readOnly={isSearchingCep}
                                />
                            </div>
                            <div>
                                <Input
                                    name="state"
                                    label="UF"
                                    placeholder="SP"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    error={errors.state}
                                    readOnly={isSearchingCep}
                                    maxLength={2}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Salvando...' : 'Salvar Endereço'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </main>

            <BottomNavigation cartItemCount={itemCount} />
        </div>
    );
}
