/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { formatPriceKz } from '@/lib/utils';
import { Upload, CreditCard, MapPin } from 'lucide-react';
import { Header } from '@/components/public/Header';

// Dados bancários fornecidos
const BANK_DATA = {
	iban: 'AO06004000006935232010179',
	name: 'Silva Santos António Batos',
	bank: 'BIC (ou outro)',
};

export default function CheckoutPage() {
	const { user } = useAuth();
	const { items, totalPrice, clearCart, loading: cartLoading } = useCart();
	const router = useRouter();
	const { showToast } = useToast();

	// Estados para endereço
	const [addresses, setAddresses] = useState<any[]>([]);
	const [selectedAddressId, setSelectedAddressId] = useState('');
	const [showAddressForm, setShowAddressForm] = useState(false);
	const [newAddress, setNewAddress] = useState({
		street: '',
		number: '',
		complement: '',
		neighborhood: '',
		city: '',
		state: '',
		zipCode: '',
		isDefault: false,
	});

	// Estados para pagamento
	const [paymentProof, setPaymentProof] = useState<File | null>(null);
	const [proofUrl, setProofUrl] = useState('');
	const [uploading, setUploading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	// Carregar endereços do usuário
	useEffect(() => {
		if (user) {
			fetch('/api/addresses')
				.then((res) => res.json())
				.then((data) => {
					setAddresses(data);
					const defaultAddr = data.find((a: any) => a.isDefault);
					if (defaultAddr) setSelectedAddressId(defaultAddr.id);
				});
		}
	}, [user]);

	// Redirecionar se carrinho vazio
	useEffect(() => {
		if (!cartLoading && items.length === 0) {
			router.push('/cart');
		}
	}, [items, cartLoading, router]);

	if (!user) {
		return (
			<>
				<Header />
				<div className='max-w-7xl mx-auto px-4 py-16 text-center'>
					<h2 className='text-2xl font-bold mb-4'>
						Faça login para finalizar a compra
					</h2>
					<Button onClick={() => router.push('/auth/login')}>Entrar</Button>
				</div>
			</>
		);
	}

	if (cartLoading || items.length === 0) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Preparando checkout...' />
			</div>
		);
	}

	const handleAddressSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await fetch('/api/addresses', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newAddress),
			});
			if (!res.ok) throw new Error('Erro ao salvar endereço');
			const addr = await res.json();
			setAddresses([...addresses, addr]);
			setSelectedAddressId(addr.id);
			setShowAddressForm(false);
			setNewAddress({
				street: '',
				number: '',
				complement: '',
				neighborhood: '',
				city: '',
				state: '',
				zipCode: '',
				isDefault: false,
			});
			showToast('Endereço adicionado!', 'success');
		} catch (error) {
			showToast('Erro ao salvar endereço', 'error');
		}
	};

	const handleProofUpload = async (file: File) => {
		setUploading(true);
		const formData = new FormData();
		formData.append('file', file);
		try {
			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});
			if (!res.ok) throw new Error('Erro no upload');
			const { url } = await res.json();
			setProofUrl(url);
			showToast('Comprovante enviado!', 'success');
		} catch (error) {
			showToast('Erro ao enviar comprovante', 'error');
		} finally {
			setUploading(false);
		}
	};

	const handleSubmitOrder = async () => {
		if (!selectedAddressId) {
			showToast('Selecione um endereço de entrega', 'warning');
			return;
		}
		if (!proofUrl) {
			showToast('Anexe o comprovante de pagamento', 'warning');
			return;
		}

		setSubmitting(true);
		try {
			const res = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					addressId: selectedAddressId,
					paymentMethod: 'transfer',
					paymentProof: proofUrl,
				}),
			});
			if (!res.ok) throw new Error('Erro ao criar pedido');
			const order = await res.json();
			clearCart();
			router.push(`/orders/${order.id}/success`);
		} catch (error) {
			showToast('Erro ao finalizar pedido', 'error');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<Header />
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-6'>Checkout</h1>

				<div className='grid lg:grid-cols-3 gap-8'>
					{/* Coluna principal */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Endereço de entrega */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<MapPin className='h-5 w-5' />
									Endereço de Entrega
								</CardTitle>
							</CardHeader>
							<CardContent>
								{addresses.length > 0 && !showAddressForm ? (
									<div className='space-y-3'>
										{addresses.map((addr) => (
											<label
												key={addr.id}
												className='flex items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-gray-50'
											>
												<input
													type='radio'
													name='address'
													value={addr.id}
													checked={selectedAddressId === addr.id}
													onChange={(e) => setSelectedAddressId(e.target.value)}
													className='mt-1'
												/>
												<div>
													<p className='font-medium'>
														{addr.street}, {addr.number}
													</p>
													{addr.complement && (
														<p className='text-sm text-gray-600'>
															{addr.complement}
														</p>
													)}
													<p className='text-sm text-gray-600'>
														{addr.neighborhood}, {addr.city} - {addr.state}
													</p>
													<p className='text-sm text-gray-600'>
														CEP: {addr.zipCode}
													</p>
													{addr.isDefault && (
														<span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded'>
															Padrão
														</span>
													)}
												</div>
											</label>
										))}
										<Button
											variant='outline'
											onClick={() => setShowAddressForm(true)}
											className='mt-2'
										>
											+ Adicionar novo endereço
										</Button>
									</div>
								) : (
									<div>
										<form onSubmit={handleAddressSubmit} className='space-y-3'>
											<div className='grid sm:grid-cols-2 gap-3'>
												<Input
													placeholder='Rua'
													value={newAddress.street}
													onChange={(e) =>
														setNewAddress({
															...newAddress,
															street: e.target.value,
														})
													}
													required
												/>
												<Input
													placeholder='Número'
													value={newAddress.number}
													onChange={(e) =>
														setNewAddress({
															...newAddress,
															number: e.target.value,
														})
													}
													required
												/>
											</div>
											<Input
												placeholder='Complemento (opcional)'
												value={newAddress.complement}
												onChange={(e) =>
													setNewAddress({
														...newAddress,
														complement: e.target.value,
													})
												}
											/>
											<div className='grid sm:grid-cols-2 gap-3'>
												<Input
													placeholder='Bairro'
													value={newAddress.neighborhood}
													onChange={(e) =>
														setNewAddress({
															...newAddress,
															neighborhood: e.target.value,
														})
													}
													required
												/>
												<Input
													placeholder='Cidade'
													value={newAddress.city}
													onChange={(e) =>
														setNewAddress({
															...newAddress,
															city: e.target.value,
														})
													}
													required
												/>
											</div>
											<div className='grid sm:grid-cols-2 gap-3'>
												<Input
													minLength={2}
													maxLength={2}
													placeholder='UF'
													value={newAddress.state}
													onChange={(e) =>
														setNewAddress({
															...newAddress,
															state: e.target.value,
														})
													}
													required
												/>
												<Input
													minLength={4}
													placeholder='CEP'
													value={newAddress.zipCode}
													onChange={(e) =>
														setNewAddress({
															...newAddress,
															zipCode: e.target.value,
														})
													}
													required
												/>
											</div>
											<label className='flex items-center gap-2'>
												<input
													type='checkbox'
													checked={newAddress.isDefault}
													onChange={(e) =>
														setNewAddress({
															...newAddress,
															isDefault: e.target.checked,
														})
													}
												/>
												<span className='text-sm'>
													Definir como endereço padrão
												</span>
											</label>
											<div className='flex gap-2'>
												<Button type='submit'>Salvar endereço</Button>
												{addresses.length > 0 && (
													<Button
														type='button'
														variant='outline'
														onClick={() => setShowAddressForm(false)}
													>
														Cancelar
													</Button>
												)}
											</div>
										</form>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Pagamento */}
						<Card>
							<CardHeader>
								<CardTitle className='flex items-center gap-2'>
									<CreditCard className='h-5 w-5' />
									Pagamento por Transferência
								</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								<div className='bg-blue-50 p-4 rounded-md'>
									<p className='font-semibold mb-2'>
										Dados para transferência:
									</p>
									<p>
										<span className='text-sm text-gray-600'>IBAN:</span>{' '}
										<strong>{BANK_DATA.iban}</strong>
									</p>
									<p>
										<span className='text-sm text-gray-600'>Nome:</span>{' '}
										<strong>{BANK_DATA.name}</strong>
									</p>
									<p>
										<span className='text-sm text-gray-600'>Banco:</span>{' '}
										{BANK_DATA.bank}
									</p>
									<p className='text-sm mt-2 text-gray-600'>
										Valor total:{' '}
										<strong className='text-blue-700'>
											{formatPriceKz(totalPrice)}
										</strong>
									</p>
								</div>

								<div>
									<Label htmlFor='proof'>Anexar comprovante de pagamento</Label>
									<div className='mt-1 flex items-center gap-2'>
										<input
											type='file'
											id='proof'
											accept='image/*,application/pdf'
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													setPaymentProof(file);
													handleProofUpload(file);
												}
											}}
											className='hidden'
										/>
										<Button
											type='button'
											variant='outline'
											onClick={() => document.getElementById('proof')?.click()}
											disabled={uploading}
										>
											{uploading ? (
												<LoadingSpinner size='sm' />
											) : (
												<Upload className='h-4 w-4 mr-2' />
											)}
											{uploading ? 'Enviando...' : 'Selecionar arquivo'}
										</Button>
										{paymentProof && (
											<span className='text-sm text-gray-600'>
												{paymentProof.name}
											</span>
										)}
									</div>
									{proofUrl && (
										<p className='text-sm text-green-600 mt-1'>
											✓ Comprovante anexado
										</p>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Resumo do pedido */}
					<div>
						<Card>
							<CardHeader>
								<CardTitle>Resumo do Pedido</CardTitle>
							</CardHeader>
							<CardContent className='space-y-4'>
								{items.map((item) => (
									<div key={item.id} className='flex justify-between text-sm'>
										<span className='truncate'>
											{item.product.name} x{item.quantity}
										</span>
										<span>
											{formatPriceKz(item.product.price * item.quantity)}
										</span>
									</div>
								))}
								<div className='border-t pt-2 font-bold flex justify-between'>
									<span>Total</span>
									<span className='text-blue-600'>
										{formatPriceKz(totalPrice)}
									</span>
								</div>
								<Button
									className='w-full'
									size='lg'
									onClick={handleSubmitOrder}
									disabled={submitting || !selectedAddressId || !proofUrl}
								>
									{submitting ? (
										<LoadingSpinner size='sm' />
									) : (
										'Finalizar Pedido'
									)}
								</Button>
								<p className='text-xs text-gray-500 text-center'>
									Após a confirmação do pagamento, seu pedido será processado.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}
