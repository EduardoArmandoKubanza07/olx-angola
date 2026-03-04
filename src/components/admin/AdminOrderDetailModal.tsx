/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, CheckCircle, XCircle, Truck, PackageCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPriceKz } from '@/lib/utils';

interface AdminOrderDetailModalProps {
	order: any;
	isOpen: boolean;
	onClose: () => void;
	onUpdateStatus: (orderId: string, status: string) => Promise<void>;
}

export function AdminOrderDetailModal({
	order,
	isOpen,
	onClose,
	onUpdateStatus,
}: AdminOrderDetailModalProps) {
	const [updating, setUpdating] = useState(false);

	const handleStatusChange = async (newStatus: string) => {
		setUpdating(true);
		await onUpdateStatus(order.id, newStatus);
		setUpdating(false);
	};

	return (
		<Dialog open={isOpen} onClose={onClose} className='relative z-50'>
			<div className='fixed inset-0 bg-black/30' aria-hidden='true' />
			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel className='mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto'>
					<div className='flex items-center justify-between p-4 border-b sticky top-0 bg-white'>
						<Dialog.Title className='text-lg font-semibold'>
							Pedido #{order.id.slice(-8)}
						</Dialog.Title>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<div className='p-4 space-y-4'>
						{/* Cliente */}
						<div>
							<h3 className='font-medium mb-1'>Cliente</h3>
							<p className='text-sm text-gray-600'>
								{order.user.name} - {order.user.email}
							</p>
						</div>

						{/* Status com ações */}
						<div>
							<h3 className='font-medium mb-2'>Status atual</h3>
							<div className='flex items-center gap-2 mb-3'>
								<span
									className={`px-3 py-1 rounded-full text-xs font-medium ${
										order.status === 'PENDING'
											? 'bg-yellow-100 text-yellow-800'
											: order.status === 'PAID'
												? 'bg-green-100 text-green-800'
												: order.status === 'PROCESSING'
													? 'bg-blue-100 text-blue-800'
													: order.status === 'SHIPPED'
														? 'bg-purple-100 text-purple-800'
														: order.status === 'DELIVERED'
															? 'bg-green-100 text-green-800'
															: 'bg-red-100 text-red-800'
									}`}
								>
									{order.status}
								</span>
							</div>

							<div className='grid grid-cols-2 gap-2'>
								<Button
									size='sm'
									variant='outline'
									onClick={() => handleStatusChange('PAID')}
									disabled={updating || order.status === 'PAID'}
									className='text-green-600 border-green-200 hover:bg-green-50'
								>
									<CheckCircle className='h-4 w-4 mr-1' />
									Confirmar pagamento
								</Button>
								<Button
									size='sm'
									variant='outline'
									onClick={() => handleStatusChange('PROCESSING')}
									disabled={updating || order.status === 'PROCESSING'}
								>
									Processando
								</Button>
								<Button
									size='sm'
									variant='outline'
									onClick={() => handleStatusChange('SHIPPED')}
									disabled={updating || order.status === 'SHIPPED'}
									className='text-purple-600'
								>
									<Truck className='h-4 w-4 mr-1' />
									Enviado
								</Button>
								<Button
									size='sm'
									variant='outline'
									onClick={() => handleStatusChange('DELIVERED')}
									disabled={updating || order.status === 'DELIVERED'}
									className='text-green-600'
								>
									<PackageCheck className='h-4 w-4 mr-1' />
									Entregue
								</Button>
								<Button
									size='sm'
									variant='outline'
									onClick={() => handleStatusChange('CANCELLED')}
									disabled={updating || order.status === 'CANCELLED'}
									className='text-red-600 border-red-200 hover:bg-red-50 col-span-2'
								>
									<XCircle className='h-4 w-4 mr-1' />
									Cancelar pedido
								</Button>
							</div>
						</div>

						{/* Endereço */}
						<div>
							<h3 className='font-medium mb-1'>Endereço de entrega</h3>
							<p className='text-sm text-gray-600'>
								{order.address.street}, {order.address.number}
								{order.address.complement && ` - ${order.address.complement}`}
								<br />
								{order.address.neighborhood}, {order.address.city} -{' '}
								{order.address.state}
								<br />
								CEP: {order.address.zipCode}
							</p>
						</div>

						{/* Itens */}
						<div>
							<h3 className='font-medium mb-2'>Itens</h3>
							<div className='space-y-2'>
								{order.items.map((item: any) => (
									<div key={item.id} className='flex justify-between text-sm'>
										<span>
											{item.product.name} x{item.quantity}
										</span>
										<span>{formatPriceKz(item.price * item.quantity)}</span>
									</div>
								))}
							</div>
						</div>

						{/* Total */}
						<div className='border-t pt-2'>
							<div className='flex justify-between font-bold'>
								<span>Total</span>
								<span className='text-blue-600'>
									{formatPriceKz(order.total)}
								</span>
							</div>
						</div>

						{/* Comprovante */}
						{order.paymentProof && (
							<div>
								<h3 className='font-medium mb-2'>Comprovante de pagamento</h3>
								<a
									href={order.paymentProof}
									target='_blank'
									rel='noopener noreferrer'
									className='text-blue-600 hover:underline text-sm inline-flex items-center'
								>
									Ver comprovante
								</a>
							</div>
						)}
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
