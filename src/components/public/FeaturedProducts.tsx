// src/components/public/FeaturedProducts.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatPriceKz } from '@/lib/utils';

interface Product {
	id: string;
	name: string;
	price: number;
	images: { url: string; isMain: boolean }[];
	category: { name: string };
}

export function FeaturedProducts() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/api/products')
			.then((res) => res.json())
			.then((data) => setProducts(data.slice(0, 4))) // primeiros 4
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <LoadingSpinner text='Carregando produtos...' />;

	return (
		<section className='py-12'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<h2 className='text-3xl font-bold text-gray-900 mb-8'>
					Produtos em Destaque
				</h2>
				<div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
					{products.map((product) => {
						const mainImage =
							product.images.find((img) => img.isMain) || product.images[0];
						return (
							<Link key={product.id} href={`/products/${product.id}`}>
								<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
									<div className='aspect-square bg-gray-100 flex items-center justify-center'>
										{mainImage ? (
											// eslint-disable-next-line @next/next/no-img-element
											<img
												src={mainImage.url}
												alt={product.name}
												className='w-full h-full object-cover'
											/>
										) : (
											<span className='text-gray-400'>Sem imagem</span>
										)}
									</div>
									<CardContent className='p-4'>
										<p className='text-sm text-gray-500 mb-1'>
											{product.category.name}
										</p>
										<h3 className='font-semibold truncate'>{product.name}</h3>
										<p className='text-lg font-bold text-blue-600 mt-2'>
											{formatPriceKz(product.price)}
										</p>
									</CardContent>
								</Card>
							</Link>
						);
					})}
				</div>
			</div>
		</section>
	);
}
