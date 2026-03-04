/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { formatPriceKz } from '@/lib/utils';

interface OrderDetailModalProps {
	order: any;
	isOpen: boolean;
	onClose: () => void;
}

export function OrderDetailModal({
	order,
	isOpen,
	onClose,
}: OrderDetailModalProps) {
	return (
		<Dialog open={isOpen} onClose={onClose} className='relative z-50'>
			<div className='fixed inset-0 bg-black/30' aria-hidden='true' />
			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel className='mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto'>
					<div className='flex items-center justify-between p-4 border-b sticky top-0 bg-white'>
						<Dialog.Title className='text-lg font-semibold'>
							Detalhes do Pedido #{order.id.slice(-8)}
						</Dialog.Title>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<div className='p-4 space-y-4'>
						{/* Status */}
						<div className='flex justify-between items-center'>
							<span className='font-medium'>Status:</span>
							<span
								className={`px-3 py-1 rounded-full text-xs font-medium ${
									order.status === 'PENDING'
										? 'bg-yellow-100 text-yellow-800'
										: order.status === 'PAID'
											? 'bg-green-100 text-green-800'
											: 'bg-gray-100 text-gray-800'
								}`}
							>
								{order.status}
							</span>
						</div>

						{/* Endereço */}
						<div>
							<h3 className='font-medium mb-2'>Endereço de entrega</h3>
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

						{/* Totais */}
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
									className='text-blue-600 hover:underline text-sm'
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
