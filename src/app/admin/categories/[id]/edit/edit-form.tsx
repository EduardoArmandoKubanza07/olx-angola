/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/categories/[id]/edit/edit-form.tsx
'use client';

import { useRouter } from 'next/navigation';
import { CategoryForm } from '@/components/forms/category-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function EditCategoryForm({ category }: { category: any }) {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(data: any) {
		setIsSubmitting(true);
		try {
			const res = await fetch(`/api/categories/${category.id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error('Erro ao atualizar');
			router.push('/admin/categories');
			router.refresh();
		} catch (error) {
			alert('Erro ao atualizar categoria');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className='max-w-md mx-auto'>
			<Card>
				<CardHeader>
					<CardTitle>Editar Categoria</CardTitle>
				</CardHeader>
				<CardContent>
					<CategoryForm
						initialData={{
							name: category.name,
							description: category.description || '',
						}}
						onSubmit={handleSubmit}
						isSubmitting={isSubmitting}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
