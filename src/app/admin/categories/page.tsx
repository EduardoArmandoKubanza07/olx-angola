/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

interface Category {
	id: string;
	name: string;
	description: string | null;
	_count?: { products: number };
}

export default function AdminCategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		fetchCategories();
	}, []);

	async function fetchCategories() {
		try {
			const res = await fetch('/api/categories');
			if (!res.ok) throw new Error('Erro ao carregar');
			const data = await res.json();
			setCategories(data);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('Tem certeza que deseja excluir?')) return;
		try {
			const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
			if (!res.ok) throw new Error('Erro ao excluir');
			setCategories(categories.filter((c) => c.id !== id));
		} catch (err: any) {
			alert(err.message);
		}
	}

	if (loading) return <p>Carregando...</p>;

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold'>Categorias</h2>
				<Link href='/admin/categories/new'>
					<Button>Nova Categoria</Button>
				</Link>
			</div>

			{error && <Alert variant='error'>{error}</Alert>}

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{categories.map((category) => (
					<Card key={category.id}>
						<CardHeader>
							<CardTitle>{category.name}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-sm text-gray-600 mb-2'>
								{category.description || 'Sem descrição'}
							</p>
							<p className='text-xs text-gray-500'>
								Produtos: {category._count?.products || 0}
							</p>
							<div className='mt-4 flex gap-2'>
								<Link href={`/admin/categories/${category.id}/edit`}>
									<Button variant='outline' size='sm'>
										Editar
									</Button>
								</Link>
								<Button
									variant='destructive'
									size='sm'
									onClick={() => handleDelete(category.id)}
								>
									Excluir
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
