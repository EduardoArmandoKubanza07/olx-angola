/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/EditUserModal.tsx
'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Shield, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface EditUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	user: {
		id: string;
		name: string;
		email: string;
		role: 'USER' | 'ADMIN';
	};
}

export function EditUserModal({
	isOpen,
	onClose,
	onSuccess,
	user,
}: EditUserModalProps) {
	const [role, setRole] = useState<'USER' | 'ADMIN'>(user.role);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const res = await fetch(`/api/users/${user.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ role }),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Erro ao atualizar');
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
							Editar Usuário
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

						<div className='space-y-1'>
							<Label>Nome</Label>
							<p className='text-gray-700 bg-gray-50 p-2 rounded'>
								{user.name}
							</p>
						</div>

						<div className='space-y-1'>
							<Label>Email</Label>
							<p className='text-gray-700 bg-gray-50 p-2 rounded'>
								{user.email}
							</p>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='role'>Permissão</Label>
							<div className='grid grid-cols-2 gap-2'>
								<button
									type='button'
									onClick={() => setRole('USER')}
									className={`
                    flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors
                    ${
											role === 'USER'
												? 'bg-gray-100 border-gray-400'
												: 'border-gray-200 hover:bg-gray-50'
										}
                  `}
								>
									<UserIcon className='h-4 w-4' />
									<span>Usuário</span>
								</button>
								<button
									type='button'
									onClick={() => setRole('ADMIN')}
									className={`
                    flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors
                    ${
											role === 'ADMIN'
												? 'bg-purple-100 border-purple-400 text-purple-700'
												: 'border-gray-200 hover:bg-gray-50'
										}
                  `}
								>
									<Shield className='h-4 w-4' />
									<span>Admin</span>
								</button>
							</div>
						</div>

						<div className='flex justify-end gap-2 pt-4'>
							<Button type='button' variant='outline' onClick={onClose}>
								Cancelar
							</Button>
							<Button type='submit' disabled={loading}>
								{loading ? <LoadingSpinner size='sm' /> : 'Salvar'}
							</Button>
						</div>
					</form>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
