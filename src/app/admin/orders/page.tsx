/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { formatPriceKz } from '@/lib/utils';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { AdminOrderDetailModal } from '@/components/admin/AdminOrderDetailModal';

interface Order {
	id: string;
	total: number;
	status: string;
	paymentProof: string | null;
	createdAt: string;
	user: { name: string; email: string };
	items: any[];
	address: any;
}

export default function AdminOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const { showToast } = useToast();

	const fetchOrders = async () => {
		try {
			const res = await fetch('/api/admin/orders');
			const data = await res.json();
			setOrders(data);
		} catch (error) {
			showToast('Erro ao carregar pedidos', 'error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrders();
	}, []);

	const updateStatus = async (orderId: string, newStatus: string) => {
		try {
			const res = await fetch(`/api/admin/orders/${orderId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ status: newStatus }),
			});
			if (!res.ok) throw new Error('Erro ao atualizar');
			showToast('Status atualizado!', 'success');
			fetchOrders();
			if (selectedOrder) {
				setSelectedOrder({ ...selectedOrder, status: newStatus });
			}
		} catch (error) {
			showToast('Erro ao atualizar status', 'error');
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

	if (loading) {
		return (
			<div className='h-64 flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando pedidos...' />
			</div>
		);
	}

	return (
		<div>
			<h2 className='text-2xl font-bold text-gray-800 mb-6'>Pedidos</h2>

			<div className='bg-white rounded-lg border overflow-hidden'>
				<div className='overflow-x-auto'>
					<table className='w-full text-sm'>
						<thead className='bg-gray-50 border-b'>
							<tr>
								<th className='px-4 py-3 text-left'>Pedido</th>
								<th className='px-4 py-3 text-left'>Cliente</th>
								<th className='px-4 py-3 text-left'>Data</th>
								<th className='px-4 py-3 text-left'>Total</th>
								<th className='px-4 py-3 text-left'>Status</th>
								<th className='px-4 py-3 text-left'>Comprovante</th>
								<th className='px-4 py-3 text-left'>Ações</th>
							</tr>
						</thead>
						<tbody className='divide-y'>
							{orders.map((order) => (
								<tr key={order.id} className='hover:bg-gray-50'>
									<td className='px-4 py-3 font-mono text-xs'>
										#{order.id.slice(-8)}
									</td>
									<td className='px-4 py-3'>
										<div>{order.user.name}</div>
										<div className='text-xs text-gray-500'>
											{order.user.email}
										</div>
									</td>
									<td className='px-4 py-3'>
										{new Date(order.createdAt).toLocaleDateString('pt-AO')}
									</td>
									<td className='px-4 py-3 font-bold'>
										{formatPriceKz(order.total)}
									</td>
									<td className='px-4 py-3'>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}
										>
											{order.status}
										</span>
									</td>
									<td className='px-4 py-3'>
										{order.paymentProof ? (
											<a
												href={order.paymentProof}
												target='_blank'
												rel='noopener noreferrer'
												className='text-blue-600 hover:underline text-xs'
											>
												Ver
											</a>
										) : (
											<span className='text-gray-400'>Não enviado</span>
										)}
									</td>
									<td className='px-4 py-3'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => {
												setSelectedOrder(order);
												setModalOpen(true);
											}}
										>
											<Eye className='h-4 w-4' />
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal de detalhes do pedido (admin) */}
			{selectedOrder && (
				<AdminOrderDetailModal
					order={selectedOrder}
					isOpen={modalOpen}
					onClose={() => setModalOpen(false)}
					onUpdateStatus={updateStatus}
				/>
			)}
		</div>
	);
}
