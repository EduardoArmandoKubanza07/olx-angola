/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/categories/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { CategoryForm } from '@/components/forms/category-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function NewCategoryPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	async function handleSubmit(data: any) {
		setIsSubmitting(true);
		try {
			const res = await fetch('/api/categories', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error('Erro ao criar');
			router.push('/admin/categories');
			router.refresh();
		} catch (error) {
			alert('Erro ao criar categoria');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className='max-w-md mx-auto'>
			<Card>
				<CardHeader>
					<CardTitle>Nova Categoria</CardTitle>
				</CardHeader>
				<CardContent>
					<CategoryForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
				</CardContent>
			</Card>
		</div>
	);
}
