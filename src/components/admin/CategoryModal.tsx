/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/CategoryModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface CategoryModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	category?: {
		id: string;
		name: string;
		description: string | null;
	} | null;
}

export function CategoryModal({
	isOpen,
	onClose,
	onSuccess,
	category,
}: CategoryModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (category) {
			setName(category.name);
			setDescription(category.description || '');
		} else {
			setName('');
			setDescription('');
		}
		setError('');
	}, [category, isOpen]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const url = category
				? `/api/categories/${category.id}`
				: '/api/categories';
			const method = category ? 'PUT' : 'POST';

			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, description }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Erro ao salvar');
			}

			onSuccess();
			onClose();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onClose={onClose} className='relative z-50'>
			<div className='fixed inset-0 bg-black/30' aria-hidden='true' />

			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel className='mx-auto max-w-md w-full bg-white rounded-lg shadow-xl'>
					<div className='flex items-center justify-between p-4 border-b'>
						<Dialog.Title className='text-lg font-semibold'>
							{category ? 'Editar Categoria' : 'Nova Categoria'}
						</Dialog.Title>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<form onSubmit={handleSubmit} className='p-4 space-y-4'>
						{error && (
							<div className='bg-red-50 text-red-600 p-3 rounded-md text-sm'>
								{error}
							</div>
						)}

						<div className='space-y-2'>
							<Label htmlFor='name'>Nome</Label>
							<Input
								id='name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								placeholder='Ex: Eletrônicos'
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='description'>Descrição</Label>
							<Input
								id='description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder='Descrição da categoria (opcional)'
							/>
						</div>

						<div className='flex justify-end gap-2 pt-4'>
							<Button type='button' variant='outline' onClick={onClose}>
								Cancelar
							</Button>
							<Button type='submit' disabled={loading}>
								{loading ? (
									<LoadingSpinner size='sm' />
								) : category ? (
									'Salvar'
								) : (
									'Criar'
								)}
							</Button>
						</div>
					</form>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
