'use client';

import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatPriceKz } from '@/lib/utils';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';

export default function CartPage() {
	const { user } = useAuth();
	const { items, loading, updateQuantity, removeFromCart, totalPrice } =
		useCart();

	if (!user) {
		return (
			<>
				<Header />
				<div className='max-w-7xl mx-auto px-4 py-16 text-center'>
					<h2 className='text-2xl font-bold text-gray-900 mb-4'>
						Faça login para ver seu carrinho
					</h2>
					<Link href='/auth/login'>
						<Button>Entrar</Button>
					</Link>
				</div>
			</>
		);
	}

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando carrinho...' />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<>
				<Header />
				<div className='max-w-7xl mx-auto px-4 py-16 text-center'>
					<ShoppingBag className='h-16 w-16 mx-auto text-gray-400 mb-4' />
					<h2 className='text-2xl font-bold text-gray-900 mb-2'>
						Seu carrinho está vazio
					</h2>
					<p className='text-gray-600 mb-6'>
						Explore nossos produtos e adicione itens ao carrinho.
					</p>
					<Link href='/products'>
						<Button>Ver produtos</Button>
					</Link>
				</div>
			</>
		);
	}

	return (
		<>
			<Header />
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-6'>
					Carrinho de Compras
				</h1>

				<div className='grid lg:grid-cols-3 gap-8'>
					{/* Lista de itens */}
					<div className='lg:col-span-2 space-y-4'>
						{items.map((item) => {
							const image = item.product.images[0]?.url;
							return (
								<Card key={item.id}>
									<CardContent className='p-4 flex gap-4'>
										<div className='w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0'>
											{image ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={image}
													alt={item.product.name}
													className='w-full h-full object-cover'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center text-gray-400'>
													Sem img
												</div>
											)}
										</div>

										<div className='flex-1 min-w-0'>
											<Link href={`/products/${item.product.id}`}>
												<h3 className='font-medium text-gray-900 hover:text-blue-600 truncate'>
													{item.product.name}
												</h3>
											</Link>
											<p className='text-sm text-gray-500 mt-1'>
												{formatPriceKz(item.product.price)} cada
											</p>

											<div className='flex items-center justify-between mt-3'>
												<div className='flex items-center border rounded-md'>
													<button
														onClick={() =>
															updateQuantity(item.id, item.quantity - 1)
														}
														className='p-1 hover:bg-gray-100 disabled:opacity-50'
														disabled={item.quantity <= 1}
													>
														<Minus className='h-4 w-4' />
													</button>
													<span className='w-8 text-center text-sm'>
														{item.quantity}
													</span>
													<button
														onClick={() =>
															updateQuantity(item.id, item.quantity + 1)
														}
														className='p-1 hover:bg-gray-100'
													>
														<Plus className='h-4 w-4' />
													</button>
												</div>

												<Button
													variant='ghost'
													size='sm'
													onClick={() => removeFromCart(item.id)}
													className='text-red-600 hover:text-red-700'
												>
													<Trash2 className='h-4 w-4' />
												</Button>
											</div>
										</div>

										<div className='text-right'>
											<p className='font-bold text-blue-600'>
												{formatPriceKz(item.product.price * item.quantity)}
											</p>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>

					{/* Resumo do pedido */}
					<div>
						<Card>
							<CardContent className='p-6'>
								<h2 className='text-lg font-bold mb-4'>Resumo do pedido</h2>

								<div className='space-y-2 text-sm mb-4'>
									<div className='flex justify-between'>
										<span>Subtotal</span>
										<span>{formatPriceKz(totalPrice)}</span>
									</div>
									<div className='flex justify-between'>
										<span>Frete</span>
										<span className='text-green-600'>Grátis</span>
									</div>
									<div className='border-t pt-2 mt-2 font-bold text-base'>
										<div className='flex justify-between'>
											<span>Total</span>
											<span className='text-blue-600'>
												{formatPriceKz(totalPrice)}
											</span>
										</div>
									</div>
								</div>

								<Link href='/checkout'>
									<Button className='w-full' size='lg'>
										Finalizar compra
									</Button>
								</Link>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
