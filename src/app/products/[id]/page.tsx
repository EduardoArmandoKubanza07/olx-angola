/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatPriceKz } from '@/lib/utils';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Header } from '@/components/public/Header';

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	category: { id: string; name: string };
	images: { url: string; isMain: boolean }[];
}

export default function ProductDetailPage() {
	const { id } = useParams();
	const { addToCart } = useCart();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const [adding, setAdding] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string>('');

	useEffect(() => {
		fetch(`/api/products/${id}`)
			.then((res) => res.json())
			.then((data) => {
				setProduct(data);
				const main =
					data.images.find((img: any) => img.isMain) || data.images[0];
				setSelectedImage(main?.url || '');
			})
			.finally(() => setLoading(false));
	}, [id]);

	const handleAddToCart = async () => {
		if (!product) return;
		setAdding(true);
		await addToCart(product.id, quantity);
		setAdding(false);
	};

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando produto...' />
			</div>
		);
	}

	if (!product) {
		return (
			<div className='max-w-7xl mx-auto px-4 py-16 text-center'>
				<h2 className='text-2xl font-bold text-gray-900'>
					Produto não encontrado
				</h2>
				<Link
					href='/products'
					className='text-blue-600 hover:underline mt-4 inline-block'
				>
					Voltar para produtos
				</Link>
			</div>
		);
	}

	return (
		<>
			<Header />
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Breadcrumb */}
				<div className='mb-6'>
					<Link
						href='/products'
						className='text-sm text-gray-500 hover:text-blue-600 flex items-center gap-1'
					>
						<ArrowLeft className='h-3 w-3' />
						Voltar para produtos
					</Link>
				</div>

				<div className='grid md:grid-cols-2 gap-8'>
					{/* Galeria de imagens */}
					<div>
						<div className='aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4'>
							{selectedImage ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={selectedImage}
									alt={product.name}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-gray-400'>
									Sem imagem
								</div>
							)}
						</div>
						{product.images.length > 1 && (
							<div className='grid grid-cols-4 gap-2'>
								{product.images.map((img, idx) => (
									<button
										key={idx}
										onClick={() => setSelectedImage(img.url)}
										className={`aspect-square rounded-md overflow-hidden border-2 transition ${
											selectedImage === img.url
												? 'border-blue-600'
												: 'border-transparent'
										}`}
									>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={img.url}
											alt={`${product.name} ${idx + 1}`}
											className='w-full h-full object-cover'
										/>
									</button>
								))}
							</div>
						)}
					</div>

					{/* Informações do produto */}
					<div>
						<p className='text-sm text-gray-500 mb-2'>
							{product.category.name}
						</p>
						<h1 className='text-3xl font-bold text-gray-900 mb-4'>
							{product.name}
						</h1>
						<p className='text-4xl font-bold text-blue-600 mb-4'>
							{formatPriceKz(product.price)}
						</p>

						<div className='prose prose-sm text-gray-600 mb-6'>
							{product.description}
						</div>

						<div className='bg-gray-50 rounded-lg p-4 mb-6'>
							<div className='flex items-center justify-between mb-4'>
								<span className='text-sm text-gray-600'>Disponibilidade:</span>
								<span
									className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}
								>
									{product.stock > 0
										? `${product.stock} unidades em estoque`
										: 'Esgotado'}
								</span>
							</div>

							{product.stock > 0 && (
								<>
									<div className='flex items-center gap-4 mb-4'>
										<span className='text-sm text-gray-600'>Quantidade:</span>
										<div className='flex items-center border rounded-md'>
											<button
												onClick={() => setQuantity(Math.max(1, quantity - 1))}
												className='p-2 hover:bg-gray-100 disabled:opacity-50'
												disabled={quantity <= 1}
											>
												<Minus className='h-4 w-4' />
											</button>
											<span className='w-12 text-center'>{quantity}</span>
											<button
												onClick={() =>
													setQuantity(Math.min(product.stock, quantity + 1))
												}
												className='p-2 hover:bg-gray-100 disabled:opacity-50'
												disabled={quantity >= product.stock}
											>
												<Plus className='h-4 w-4' />
											</button>
										</div>
									</div>

									<Button
										onClick={handleAddToCart}
										disabled={adding}
										className='w-full'
										size='lg'
									>
										{adding ? (
											<LoadingSpinner size='sm' />
										) : (
											<>
												<ShoppingCart className='h-5 w-5 mr-2' />
												Adicionar ao carrinho
											</>
										)}
									</Button>
								</>
							)}
						</div>

						<Card>
							<CardContent className='p-4'>
								<h3 className='font-medium mb-2'>Informações adicionais</h3>
								<ul className='text-sm text-gray-600 space-y-1'>
									<li>• Categoria: {product.category.name}</li>
									<li>• SKU: {product.id.slice(-8)}</li>
									<li>• Disponível para entrega em todo Angola</li>
								</ul>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
