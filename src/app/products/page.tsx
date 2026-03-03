'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatPriceKz } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { Header } from '@/components/public/Header';

interface Product {
	id: string;
	name: string;
	price: number;
	images: { url: string; isMain: boolean }[];
	category: { id: string; name: string };
}

interface Category {
	id: string;
	name: string;
	_count: { products: number };
}

export default function ProductsPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState(searchParams.get('q') || '');
	const [selectedCategory, setSelectedCategory] = useState(
		searchParams.get('category') || '',
	);
	const [debouncedSearch, setDebouncedSearch] = useState(search);

	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 300);
		return () => clearTimeout(timer);
	}, [search]);

	// Fetch categories once
	useEffect(() => {
		fetch('/api/categories')
			.then((res) => res.json())
			.then(setCategories);
	}, []);

	// Fetch products based on filters
	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			const params = new URLSearchParams();
			if (debouncedSearch) params.set('q', debouncedSearch);
			if (selectedCategory) params.set('category', selectedCategory);

			try {
				const res = await fetch(`/api/products?${params.toString()}`);
				const data = await res.json();
				setProducts(data);
			} catch (error) {
				console.error('Erro ao carregar produtos:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();

		// Update URL
		const newParams = new URLSearchParams();
		if (debouncedSearch) newParams.set('q', debouncedSearch);
		if (selectedCategory) newParams.set('category', selectedCategory);
		router.push(`/products?${newParams.toString()}`, { scroll: false });
	}, [debouncedSearch, selectedCategory, router]);

	const clearFilters = () => {
		setSearch('');
		setSelectedCategory('');
	};

	const hasFilters = search || selectedCategory;

	return (
		<>
			<Header />
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-6'>Produtos</h1>

				<div className='flex flex-col lg:flex-row gap-8'>
					{/* Sidebar com filtros */}
					<aside className='lg:w-64 space-y-6'>
						<div>
							<label
								htmlFor='search'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Buscar
							</label>
							<div className='relative'>
								<Input
									id='search'
									type='text'
									placeholder='O que procura?'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									className='pr-10'
								/>
								<Search className='absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
							</div>
						</div>

						<div>
							<h3 className='text-sm font-medium text-gray-700 mb-2'>
								Categorias
							</h3>
							<div className='space-y-2'>
								<button
									onClick={() => setSelectedCategory('')}
									className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
										selectedCategory === ''
											? 'bg-blue-50 text-blue-700 font-medium'
											: 'text-gray-600 hover:bg-gray-100'
									}`}
								>
									Todas
								</button>
								{categories.map((cat) => (
									<button
										key={cat.id}
										onClick={() => setSelectedCategory(cat.id)}
										className={`w-full text-left px-3 py-2 rounded-md text-sm transition ${
											selectedCategory === cat.id
												? 'bg-blue-50 text-blue-700 font-medium'
												: 'text-gray-600 hover:bg-gray-100'
										}`}
									>
										<span>{cat.name}</span>
										<span className='float-right text-xs text-gray-400'>
											{cat._count.products}
										</span>
									</button>
								))}
							</div>
						</div>

						{hasFilters && (
							<Button
								variant='outline'
								size='sm'
								onClick={clearFilters}
								className='w-full'
							>
								<X className='h-3 w-3 mr-1' />
								Limpar filtros
							</Button>
						)}
					</aside>

					{/* Grid de produtos */}
					<main className='flex-1'>
						{loading ? (
							<div className='h-64 flex items-center justify-center'>
								<LoadingSpinner size='lg' text='Carregando produtos...' />
							</div>
						) : products.length === 0 ? (
							<div className='text-center py-12 bg-white rounded-lg border border-dashed'>
								<p className='text-gray-500'>Nenhum produto encontrado.</p>
								{hasFilters && (
									<Button
										variant='outline'
										onClick={clearFilters}
										className='mt-2'
									>
										Limpar filtros
									</Button>
								)}
							</div>
						) : (
							<>
								<p className='text-sm text-gray-500 mb-4'>
									{products.length} produto(s) encontrado(s)
								</p>
								<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
									{products.map((product) => {
										const mainImage =
											product.images.find((img) => img.isMain) ||
											product.images[0];
										return (
											<Link key={product.id} href={`/products/${product.id}`}>
												<Card className='hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col'>
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
													<CardContent className='p-4 flex-1 flex flex-col'>
														<p className='text-xs text-gray-500 mb-1'>
															{product.category.name}
														</p>
														<h3 className='font-semibold truncate'>
															{product.name}
														</h3>
														<p className='text-lg font-bold text-blue-600 mt-2'>
															{formatPriceKz(product.price)}
														</p>
													</CardContent>
												</Card>
											</Link>
										);
									})}
								</div>
							</>
						)}
					</main>
				</div>
			</div>
		</>
	);
}
