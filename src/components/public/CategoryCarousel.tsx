'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Category {
	id: string;
	name: string;
	_count: { products: number };
}

export function CategoryCarousel() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetch('/api/categories')
			.then((res) => res.json())
			.then((data) => setCategories(data))
			.finally(() => setLoading(false));
	}, []);

	// Efeito de rolagem infinita
	useEffect(() => {
		const scrollContainer = scrollRef.current;
		if (!scrollContainer || categories.length === 0) return;

		let animationId: number;
		const scrollSpeed = 0.5; // pixels por frame

		const scroll = () => {
			if (scrollContainer) {
				scrollContainer.scrollLeft += scrollSpeed;
				// Se chegou ao fim, volta ao início
				if (
					scrollContainer.scrollLeft >=
					scrollContainer.scrollWidth - scrollContainer.clientWidth
				) {
					scrollContainer.scrollLeft = 0;
				}
			}
			animationId = requestAnimationFrame(scroll);
		};

		animationId = requestAnimationFrame(scroll);

		return () => cancelAnimationFrame(animationId);
	}, [categories]);

	if (loading) return <LoadingSpinner text='Carregando categorias...' />;

	// Duplicar categorias para efeito contínuo
	const duplicatedCategories = [...categories, ...categories];

	return (
		<section className='py-12 bg-gray-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<h2 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
					Categorias em Destaque
				</h2>
				<div
					ref={scrollRef}
					className='overflow-x-hidden whitespace-nowrap py-4'
					style={{ scrollBehavior: 'auto' }}
				>
					<div className='inline-flex gap-4'>
						{duplicatedCategories.map((cat, index) => (
							<Link
								key={`${cat.id}-${index}`}
								href={`/products?category=${cat.id}`}
								className='inline-block w-48'
							>
								<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
									<CardContent className='p-6 text-center'>
										<h3 className='font-semibold text-lg truncate'>
											{cat.name}
										</h3>
										<p className='text-sm text-gray-500 mt-1'>
											{cat._count.products} produtos
										</p>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
