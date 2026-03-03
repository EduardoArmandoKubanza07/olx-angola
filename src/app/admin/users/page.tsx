/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/usuarios/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { EditUserModal } from '@/components/admin/EditUserModal';
import { Pencil, Trash2, Shield, User as UserIcon } from 'lucide-react';

interface User {
	id: string;
	email: string;
	name: string;
	role: 'USER' | 'ADMIN';
	createdAt: string;
	_count: {
		orders: number;
		addresses: number;
	};
}

export default function AdminUsersPage() {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const { showToast } = useToast();

	const fetchUsers = async () => {
		try {
			const res = await fetch('/api/users');
			if (!res.ok) throw new Error('Erro ao carregar usuários');
			const data = await res.json();
			setUsers(data);
		} catch (err: any) {
			showToast(err.message, 'error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUsers();
	}, []);

	const handleEdit = (user: User) => {
		setSelectedUser(user);
		setEditModalOpen(true);
	};

	const handleDeleteClick = (user: User) => {
		setSelectedUser(user);
		setDeleteModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedUser) return;

		setDeleteLoading(true);
		try {
			const res = await fetch(`/api/users/${selectedUser.id}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Erro ao excluir');
			}

			showToast('Usuário excluído com sucesso!', 'success');
			setUsers(users.filter((u) => u.id !== selectedUser.id));
			setDeleteModalOpen(false);
		} catch (err: any) {
			showToast(err.message, 'error');
		} finally {
			setDeleteLoading(false);
			setSelectedUser(null);
		}
	};

	const handleEditSuccess = () => {
		showToast('Usuário atualizado com sucesso!', 'success');
		fetchUsers(); // recarrega a lista
	};

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('pt-AO');
	};

	if (loading) {
		return (
			<div className='h-64 flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando usuários...' />
			</div>
		);
	}

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold text-gray-800'>Usuários</h2>
				<div className='text-sm text-gray-500'>
					Total: {users.length} usuário(s)
				</div>
			</div>

			{users.length === 0 ? (
				<div className='text-center py-12 bg-white rounded-lg border border-dashed'>
					<p className='text-gray-500'>Nenhum usuário cadastrado.</p>
				</div>
			) : (
				<div className='bg-white rounded-lg border overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='w-full text-sm'>
							<thead className='bg-gray-50 border-b'>
								<tr>
									<th className='px-4 py-3 text-left font-medium text-gray-600'>
										Nome
									</th>
									<th className='px-4 py-3 text-left font-medium text-gray-600'>
										Email
									</th>
									<th className='px-4 py-3 text-left font-medium text-gray-600'>
										Role
									</th>
									<th className='px-4 py-3 text-left font-medium text-gray-600'>
										Pedidos
									</th>
									<th className='px-4 py-3 text-left font-medium text-gray-600'>
										Endereços
									</th>
									<th className='px-4 py-3 text-left font-medium text-gray-600'>
										Data Cadastro
									</th>
									<th className='px-4 py-3 text-right font-medium text-gray-600'>
										Ações
									</th>
								</tr>
							</thead>
							<tbody className='divide-y'>
								{users.map((user) => (
									<tr key={user.id} className='hover:bg-gray-50'>
										<td className='px-4 py-3'>
											<div className='flex items-center gap-2'>
												<div className='w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
													{user.name.charAt(0).toUpperCase()}
												</div>
												<span className='font-medium'>{user.name}</span>
											</div>
										</td>
										<td className='px-4 py-3 text-gray-600'>{user.email}</td>
										<td className='px-4 py-3'>
											<span
												className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
													user.role === 'ADMIN'
														? 'bg-purple-100 text-purple-700'
														: 'bg-gray-100 text-gray-700'
												}`}
											>
												{user.role === 'ADMIN' ? (
													<Shield className='h-3 w-3' />
												) : (
													<UserIcon className='h-3 w-3' />
												)}
												{user.role === 'ADMIN' ? 'Admin' : 'Usuário'}
											</span>
										</td>
										<td className='px-4 py-3'>{user._count.orders}</td>
										<td className='px-4 py-3'>{user._count.addresses}</td>
										<td className='px-4 py-3 text-gray-500'>
											{formatDate(user.createdAt)}
										</td>
										<td className='px-4 py-3 text-right'>
											<div className='flex justify-end gap-2'>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => handleEdit(user)}
													className='text-blue-600 hover:text-blue-800'
												>
													<Pencil className='h-4 w-4' />
												</Button>
												<Button
													variant='ghost'
													size='sm'
													onClick={() => handleDeleteClick(user)}
													className='text-red-600 hover:text-red-800'
													disabled={user._count.orders > 0} // desabilita se tiver pedidos
													title={
														user._count.orders > 0
															? 'Usuário com pedidos não pode ser excluído'
															: ''
													}
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Modal de edição */}
			{selectedUser && (
				<EditUserModal
					isOpen={editModalOpen}
					onClose={() => setEditModalOpen(false)}
					onSuccess={handleEditSuccess}
					user={selectedUser}
				/>
			)}

			{/* Modal de exclusão */}
			<DeleteConfirmModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDeleteConfirm}
				itemName={selectedUser?.name || ''}
				loading={deleteLoading}
			/>
		</div>
	);
}
