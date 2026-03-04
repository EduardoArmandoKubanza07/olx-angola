/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { Pencil, Trash2, Plus, MapPin, Check } from 'lucide-react';

interface Address {
	id: string;
	street: string;
	number: string;
	complement?: string;
	neighborhood: string;
	city: string;
	state: string;
	zipCode: string;
	isDefault: boolean;
}

export function AddressList() {
	const [addresses, setAddresses] = useState<Address[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState({
		street: '',
		number: '',
		complement: '',
		neighborhood: '',
		city: '',
		state: '',
		zipCode: '',
		isDefault: false,
	});
	const [submitting, setSubmitting] = useState(false);
	const { showToast } = useToast();

	const fetchAddresses = async () => {
		try {
			const res = await fetch('/api/addresses');
			if (!res.ok) throw new Error('Erro ao carregar');
			const data = await res.json();
			setAddresses(data);
		} catch (error) {
			showToast('Erro ao carregar endereços', 'error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAddresses();
	}, []);

	const handleEdit = (address: Address) => {
		setEditingId(address.id);
		setFormData({
			street: address.street,
			number: address.number,
			complement: address.complement || '',
			neighborhood: address.neighborhood,
			city: address.city,
			state: address.state,
			zipCode: address.zipCode,
			isDefault: address.isDefault,
		});
	};

	const handleDelete = async (id: string) => {
		if (!confirm('Tem certeza que deseja excluir este endereço?')) return;
		try {
			const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Erro ao excluir');
			setAddresses(addresses.filter((a) => a.id !== id));
			showToast('Endereço excluído!', 'success');
		} catch (error) {
			showToast('Erro ao excluir', 'error');
		}
	};

	const handleSetDefault = async (id: string) => {
		try {
			const res = await fetch(`/api/addresses/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					...addresses.find((a) => a.id === id),
					isDefault: true,
				}),
			});
			if (!res.ok) throw new Error('Erro ao definir padrão');
			fetchAddresses(); // recarrega
			showToast('Endereço padrão atualizado!', 'success');
		} catch (error) {
			showToast('Erro ao definir padrão', 'error');
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const res = await fetch(`/api/addresses/${editingId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			if (!res.ok) throw new Error('Erro ao salvar');
			fetchAddresses();
			setEditingId(null);
			showToast('Endereço atualizado!', 'success');
		} catch (error) {
			showToast('Erro ao salvar', 'error');
		} finally {
			setSubmitting(false);
		}
	};

	const handleNew = () => {
		setEditingId('new');
		setFormData({
			street: '',
			number: '',
			complement: '',
			neighborhood: '',
			city: '',
			state: '',
			zipCode: '',
			isDefault: false,
		});
	};

	const handleCancel = () => {
		setEditingId(null);
	};

	if (loading) {
		return <LoadingSpinner size='md' text='Carregando endereços...' />;
	}

	return (
		<div className='space-y-4'>
			{!editingId && (
				<Button onClick={handleNew} size='sm'>
					<Plus className='h-4 w-4 mr-1' />
					Novo Endereço
				</Button>
			)}

			{editingId === 'new' && (
				<AddressForm
					formData={formData}
					setFormData={setFormData}
					onSubmit={handleSubmit}
					onCancel={handleCancel}
					submitting={submitting}
					isNew
				/>
			)}

			{addresses.length === 0 && !editingId ? (
				<p className='text-gray-500 text-sm'>Nenhum endereço cadastrado.</p>
			) : (
				<div className='space-y-3'>
					{addresses.map((addr) => (
						<div key={addr.id} className='border rounded-md p-4 relative'>
							{editingId === addr.id ? (
								<AddressForm
									formData={formData}
									setFormData={setFormData}
									onSubmit={handleSubmit}
									onCancel={handleCancel}
									submitting={submitting}
								/>
							) : (
								<div className='flex justify-between items-start'>
									<div>
										<p className='font-medium'>
											{addr.street}, {addr.number}
											{addr.complement && ` - ${addr.complement}`}
										</p>
										<p className='text-sm text-gray-600'>
											{addr.neighborhood}, {addr.city} - {addr.state}
										</p>
										<p className='text-sm text-gray-600'>CEP: {addr.zipCode}</p>
										{addr.isDefault && (
											<span className='inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded mt-1'>
												<Check className='h-3 w-3' /> Padrão
											</span>
										)}
									</div>
									<div className='flex gap-2'>
										{!addr.isDefault && (
											<Button
												variant='ghost'
												size='sm'
												onClick={() => handleSetDefault(addr.id)}
												title='Definir como padrão'
											>
												<MapPin className='h-4 w-4' />
											</Button>
										)}
										<Button
											variant='ghost'
											size='sm'
											onClick={() => handleEdit(addr)}
										>
											<Pencil className='h-4 w-4' />
										</Button>
										{!addr.isDefault && (
											<Button
												variant='ghost'
												size='sm'
												onClick={() => handleDelete(addr.id)}
												className='text-red-600 hover:text-red-800'
											>
												<Trash2 className='h-4 w-4' />
											</Button>
										)}
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

interface AddressFormProps {
	formData: any;
	setFormData: any;
	onSubmit: (e: React.FormEvent) => void;
	onCancel: () => void;
	submitting: boolean;
	isNew?: boolean;
}

function AddressForm({
	formData,
	setFormData,
	onSubmit,
	onCancel,
	submitting,
	isNew,
}: AddressFormProps) {
	return (
		<form onSubmit={onSubmit} className='space-y-3'>
			<div className='grid grid-cols-2 gap-2'>
				<Input
					placeholder='Rua'
					value={formData.street}
					onChange={(e) => setFormData({ ...formData, street: e.target.value })}
					required
				/>
				<Input
					placeholder='Número'
					value={formData.number}
					onChange={(e) => setFormData({ ...formData, number: e.target.value })}
					required
				/>
			</div>
			<Input
				placeholder='Complemento (opcional)'
				value={formData.complement}
				onChange={(e) =>
					setFormData({ ...formData, complement: e.target.value })
				}
			/>
			<div className='grid grid-cols-2 gap-2'>
				<Input
					placeholder='Bairro'
					value={formData.neighborhood}
					onChange={(e) =>
						setFormData({ ...formData, neighborhood: e.target.value })
					}
					required
				/>
				<Input
					placeholder='Cidade'
					value={formData.city}
					onChange={(e) => setFormData({ ...formData, city: e.target.value })}
					required
				/>
			</div>
			<div className='grid grid-cols-2 gap-2'>
				<Input
					placeholder='UF'
					value={formData.state}
					onChange={(e) => setFormData({ ...formData, state: e.target.value })}
					maxLength={2}
					required
				/>
				<Input
					placeholder='CEP'
					value={formData.zipCode}
					onChange={(e) =>
						setFormData({
							...formData,
							zipCode: e.target.value.replace(/\D/g, ''),
						})
					}
					maxLength={8}
					required
				/>
			</div>
			<label className='flex items-center gap-2'>
				<input
					type='checkbox'
					checked={formData.isDefault}
					onChange={(e) =>
						setFormData({ ...formData, isDefault: e.target.checked })
					}
				/>
				<span className='text-sm'>Definir como endereço padrão</span>
			</label>
			<div className='flex gap-2'>
				<Button type='submit' disabled={submitting}>
					{submitting ? (
						<LoadingSpinner size='sm' />
					) : isNew ? (
						'Criar'
					) : (
						'Salvar'
					)}
				</Button>
				<Button type='button' variant='outline' onClick={onCancel}>
					Cancelar
				</Button>
			</div>
		</form>
	);
}
