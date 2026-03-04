/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatPriceKz } from '@/lib/utils';
import { Package, Eye } from 'lucide-react';
import { OrderDetailModal } from '@/components/ui/OrderDetailModal';
import { Header } from '@/components/public/Header';

interface OrderItem {
	id: string;
	quantity: number;
	price: number;
	product: { name: string; images: { url: string }[] };
}

interface Order {
	id: string;
	total: number;
	status: string;
	paymentMethod: string;
	paymentProof: string | null;
	createdAt: string;
	items: OrderItem[];
	address: any;
}

export default function MyOrdersPage() {
	const { user } = useAuth();
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		fetch('/api/orders/user')
			.then((res) => res.json())
			.then(setOrders)
			.finally(() => setLoading(false));
	}, []);

	if (!user) {
		return (
			<>
				<Header />
				<div className='max-w-7xl mx-auto px-4 py-16 text-center'>
					<h2 className='text-2xl font-bold'>
						Faça login para ver seus pedidos
					</h2>
					<Link href='/login' className='mt-4 inline-block'>
						<Button>Entrar</Button>
					</Link>
				</div>
			</>
		);
	}

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando pedidos...' />
			</div>
		);
	}

	if (orders.length === 0) {
		return (
			<>
				<Header />
				<div className='max-w-7xl mx-auto px-4 py-16 text-center'>
					<Package className='h-16 w-16 mx-auto text-gray-400 mb-4' />
					<h2 className='text-2xl font-bold text-gray-900 mb-2'>
						Nenhum pedido ainda
					</h2>
					<p className='text-gray-600 mb-6'>
						Explore nossos produtos e faça seu primeiro pedido.
					</p>
					<Link href='/products'>
						<Button>Ver produtos</Button>
					</Link>
				</div>
			</>
		);
	}

	const getStatusBadge = (status: string) => {
		const styles = {
			PENDING: 'bg-yellow-100 text-yellow-800',
			PAID: 'bg-green-100 text-green-800',
			PROCESSING: 'bg-blue-100 text-blue-800',
			SHIPPED: 'bg-purple-100 text-purple-800',
			DELIVERED: 'bg-green-100 text-green-800',
			CANCELLED: 'bg-red-100 text-red-800',
		};
		return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
	};

	return (
		<>
			<Header />
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-6'>Meus Pedidos</h1>

				<div className='space-y-4'>
					{orders.map((order) => (
						<Card key={order.id} className='hover:shadow-md transition-shadow'>
							<CardContent className='p-6'>
								<div className='flex flex-col sm:flex-row sm:items-center justify-between mb-4'>
									<div>
										<p className='text-sm text-gray-500'>
											Pedido #{order.id.slice(-8)}
										</p>
										<p className='text-sm text-gray-500'>
											{new Date(order.createdAt).toLocaleDateString('pt-AO')}
										</p>
									</div>
									<div className='mt-2 sm:mt-0 flex items-center gap-3'>
										<span
											className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
										>
											{order.status === 'PENDING'
												? 'Aguardando pagamento'
												: order.status === 'PAID'
													? 'Pago'
													: order.status === 'PROCESSING'
														? 'Em processamento'
														: order.status === 'SHIPPED'
															? 'Enviado'
															: order.status === 'DELIVERED'
																? 'Entregue'
																: 'Cancelado'}
										</span>
										<Button
											variant='outline'
											size='sm'
											onClick={() => {
												setSelectedOrder(order);
												setModalOpen(true);
											}}
										>
											<Eye className='h-4 w-4 mr-1' />
											Detalhes
										</Button>
									</div>
								</div>

								<div className='border-t pt-4'>
									<div className='flex justify-between font-bold'>
										<span>Total</span>
										<span className='text-blue-600'>
											{formatPriceKz(order.total)}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Modal de detalhes do pedido */}
				{selectedOrder && (
					<OrderDetailModal
						order={selectedOrder}
						isOpen={modalOpen}
						onClose={() => setModalOpen(false)}
					/>
				)}
			</div>
		</>
	);
}
