/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { CategoryModal } from '@/components/admin/CategoryModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Category {
	id: string;
	name: string;
	description: string | null;
	_count?: { products: number };
}

export default function AdminCategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(
		null,
	);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const { showToast } = useToast();

	const fetchCategories = async () => {
		try {
			const res = await fetch('/api/categories');
			if (!res.ok) throw new Error('Erro ao carregar');
			const data = await res.json();
			setCategories(data);
		} catch (err: any) {
			showToast(err.message, 'error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchCategories();
	}, []);

	const handleEdit = (category: Category) => {
		setSelectedCategory(category);
		setModalOpen(true);
	};

	const handleDeleteClick = (category: Category) => {
		setSelectedCategory(category);
		setDeleteModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedCategory) return;

		setDeleteLoading(true);
		try {
			const res = await fetch(`/api/categories/${selectedCategory.id}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Erro ao excluir');
			}

			showToast('Categoria excluída com sucesso!', 'success');
			setCategories(categories.filter((c) => c.id !== selectedCategory.id));
			setDeleteModalOpen(false);
		} catch (err: any) {
			showToast(err.message, 'error');
		} finally {
			setDeleteLoading(false);
			setSelectedCategory(null);
		}
	};

	const handleModalSuccess = () => {
		showToast(
			selectedCategory ? 'Categoria atualizada!' : 'Categoria criada!',
			'success',
		);
		fetchCategories();
	};

	if (loading) {
		return (
			<div className='h-64 flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando categorias...' />
			</div>
		);
	}

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold text-gray-800'>Categorias</h2>
				<Button
					onClick={() => {
						setSelectedCategory(null);
						setModalOpen(true);
					}}
				>
					<Plus className='h-4 w-4 mr-2' />
					Nova Categoria
				</Button>
			</div>

			{categories.length === 0 ? (
				<Card>
					<CardContent className='py-12 text-center text-gray-500'>
						Nenhuma categoria cadastrada.
					</CardContent>
				</Card>
			) : (
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{categories.map((category) => (
						<Card
							key={category.id}
							className='hover:shadow-md transition-shadow'
						>
							<CardHeader className='pb-2'>
								<CardTitle className='text-lg'>{category.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-sm text-gray-600 mb-3'>
									{category.description || 'Sem descrição'}
								</p>
								<p className='text-xs text-gray-400 mb-4'>
									{category._count?.products || 0} produto(s)
								</p>
								<div className='flex gap-2'>
									<Button
										variant='outline'
										size='sm'
										onClick={() => handleEdit(category)}
										className='flex-1'
									>
										<Pencil className='h-3 w-3 mr-1' />
										Editar
									</Button>
									<Button
										variant='destructive'
										size='sm'
										onClick={() => handleDeleteClick(category)}
										className='flex-1'
									>
										<Trash2 className='h-3 w-3 mr-1' />
										Excluir
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Modal de criação/edição */}
			<CategoryModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onSuccess={handleModalSuccess}
				category={selectedCategory}
			/>

			{/* Modal de confirmação de exclusão */}
			<DeleteConfirmModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDeleteConfirm}
				itemName={selectedCategory?.name || ''}
				loading={deleteLoading}
			/>
		</div>
	);
}
