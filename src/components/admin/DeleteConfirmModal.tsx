// src/components/admin/DeleteConfirmModal.tsx
'use client';

import { Dialog } from '@headlessui/react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface DeleteConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	itemName: string;
	loading?: boolean;
}

export function DeleteConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	itemName,
	loading = false,
}: DeleteConfirmModalProps) {
	return (
		<Dialog open={isOpen} onClose={onClose} className='relative z-50'>
			<div className='fixed inset-0 bg-black/30' aria-hidden='true' />

			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel className='mx-auto max-w-md w-full bg-white rounded-lg shadow-xl'>
					<div className='flex items-center justify-between p-4 border-b'>
						<Dialog.Title className='text-lg font-semibold text-red-600'>
							Confirmar Exclusão
						</Dialog.Title>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<div className='p-6'>
						<div className='flex items-center gap-3 text-yellow-600 mb-4'>
							<AlertTriangle className='h-6 w-6' />
							<p className='text-sm'>
								Tem certeza que deseja excluir a categoria{' '}
								<strong>{itemName}</strong>? Esta ação não pode ser desfeita.
							</p>
						</div>

						<div className='flex justify-end gap-2'>
							<Button variant='outline' onClick={onClose} disabled={loading}>
								Cancelar
							</Button>
							<Button
								variant='destructive'
								onClick={onConfirm}
								disabled={loading}
							>
								{loading ? <LoadingSpinner size='sm' /> : 'Excluir'}
							</Button>
						</div>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
