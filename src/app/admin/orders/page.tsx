/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatPriceKz } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

interface OrderItem {
	id: string;
	quantity: number;
	price: number;
	product: { id: string; name: string; images: { url: string }[] };
}

interface Order {
	id: string;
	status: string;
	total: number;
	paymentProof: string | null;
	createdAt: string;
	user: { name: string; email: string };
	address: {
		street: string;
		number: string;
		neighborhood: string;
		city: string;
		state: string;
		zipCode: string;
	};
	items: OrderItem[];
}

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [statusFilter, setStatusFilter] = useState('');
	const { showToast } = useToast();

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const url = statusFilter
				? `/api/admin/orders?status=${statusFilter}`
				: '/api/admin/orders';
			const res = await fetch(url);
			if (!res.ok) throw new Error('Erro ao carregar pedidos');
			const data = await res.json();
			setOrders(data);
		} catch (error: any) {
			showToast(error.message, 'error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, [statusFilter]);

	const updateStatus = async (orderId: string, newStatus: string) => {
		try {
			const res = await fetch(`/api/admin/orders/${orderId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			});
			if (!res.ok) throw new Error('Erro ao atualizar status');
			showToast('Status atualizado!', 'success');
			fetchOrders();
		} catch (error: any) {
			showToast(error.message, 'error');
		}
	};

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

	const formatDate = (date: string) => {
		return new Date(date).toLocaleDateString('pt-AO');
	};

	if (loading) {
		return (
			<div className='h-64 flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando pedidos...' />
			</div>
		);
	}

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold text-gray-800'>Pedidos</h2>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className='border rounded-md px-3 py-2'
				>
					<option value=''>Todos os status</option>
					<option value='PENDING'>Pendentes</option>
					<option value='PAID'>Pagos</option>
					<option value='PROCESSING'>Processando</option>
					<option value='SHIPPED'>Enviados</option>
					<option value='DELIVERED'>Entregues</option>
					<option value='CANCELLED'>Cancelados</option>
				</select>
			</div>

			{orders.length === 0 ? (
				<Card>
					<CardContent className='py-12 text-center text-gray-500'>
						Nenhum pedido encontrado.
					</CardContent>
				</Card>
			) : (
				<div className='space-y-4'>
					{orders.map((order) => (
						<Card key={order.id} className='hover:shadow-md transition-shadow'>
							<CardContent className='p-6'>
								<div className='flex flex-wrap justify-between items-start gap-4'>
									<div>
										<div className='flex items-center gap-2 mb-2'>
											<span className='text-sm text-gray-500'>
												Pedido #{order.id.slice(-8)}
											</span>
											<span
												className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
											>
												{order.status}
											</span>
										</div>
										<p className='font-medium'>{order.user.name}</p>
										<p className='text-sm text-gray-600'>{order.user.email}</p>
										<p className='text-sm text-gray-600 mt-2'>
											{order.address.street}, {order.address.number} -{' '}
											{order.address.neighborhood}, {order.address.city}/
											{order.address.state}
										</p>
										<p className='text-sm text-gray-500 mt-1'>
											Data: {formatDate(order.createdAt)}
										</p>
									</div>
									<div className='text-right'>
										<p className='text-xl font-bold text-blue-600'>
											{formatPriceKz(order.total)}
										</p>
										{order.paymentProof && (
											<a
												href={order.paymentProof}
												target='_blank'
												rel='noopener noreferrer'
												className='text-sm text-blue-500 hover:underline inline-block mt-1'
											>
												Ver comprovante
											</a>
										)}
										<div className='mt-3 flex gap-2'>
											{order.status === 'PENDING' && (
												<>
													<Button
														size='sm'
														onClick={() => updateStatus(order.id, 'PAID')}
														className='bg-green-600 hover:bg-green-700'
													>
														<CheckCircle className='h-4 w-4 mr-1' />
														Confirmar pagamento
													</Button>
													<Button
														size='sm'
														variant='destructive'
														onClick={() => updateStatus(order.id, 'CANCELLED')}
													>
														<XCircle className='h-4 w-4 mr-1' />
														Cancelar
													</Button>
												</>
											)}
											{order.status === 'PAID' && (
												<Button
													size='sm'
													onClick={() => updateStatus(order.id, 'PROCESSING')}
												>
													Processar
												</Button>
											)}
											{order.status === 'PROCESSING' && (
												<Button
													size='sm'
													onClick={() => updateStatus(order.id, 'SHIPPED')}
												>
													Marcar como enviado
												</Button>
											)}
											{order.status === 'SHIPPED' && (
												<Button
													size='sm'
													onClick={() => updateStatus(order.id, 'DELIVERED')}
												>
													Confirmar entrega
												</Button>
											)}
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
