'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Header } from '@/components/public/Header';

interface Category {
	id: string;
	name: string;
	description: string | null;
	_count: { products: number };
}

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/api/categories')
			.then((res) => res.json())
			.then((data) => {
				setCategories(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	if (loading) {
		return (
			<>
				<Header />
				<div className='min-h-screen flex items-center justify-center'>
					<LoadingSpinner size='lg' text='Carregando categorias...' />
				</div>
			</>
		);
	}

	return (
		<>
			<Header />
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-6'>Categorias</h1>

				{categories.length === 0 ? (
					<p className='text-gray-500'>Nenhuma categoria encontrada.</p>
				) : (
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{categories.map((cat) => (
							<Link key={cat.id} href={`/products?category=${cat.id}`}>
								<Card className='hover:shadow-md transition-shadow cursor-pointer h-full'>
									<CardContent className='p-6'>
										<h2 className='text-xl font-semibold mb-2'>{cat.name}</h2>
										{cat.description && (
											<p className='text-gray-600 text-sm mb-3'>
												{cat.description}
											</p>
										)}
										<p className='text-sm text-blue-600 font-medium'>
											{cat._count.products} produto(s)
										</p>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				)}
			</div>
		</>
	);
}
