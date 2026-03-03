/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/admin/ProductModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';

interface ProductModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
	categories: { id: string; name: string }[];
	product?: any | null;
}

export function ProductModal({
	isOpen,
	onClose,
	onSuccess,
	categories,
	product,
}: ProductModalProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [stock, setStock] = useState('');
	const [categoryId, setCategoryId] = useState('');
	const [images, setImages] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState('');
	const { showToast } = useToast();

	useEffect(() => {
		if (product) {
			setName(product.name || '');
			setDescription(product.description || '');
			setPrice(product.price?.toString() || '');
			setStock(product.stock?.toString() || '');
			setCategoryId(product.categoryId || '');
			setImages(product.images?.map((img: any) => img.url) || []);
		} else {
			setName('');
			setDescription('');
			setPrice('');
			setStock('');
			setCategoryId(categories[0]?.id || '');
			setImages([]);
		}
		setError('');
	}, [product, categories, isOpen]);

	const handleUpload = async (file: File) => {
		setUploading(true);
		try {
			const formData = new FormData();
			formData.append('file', file);

			const res = await fetch('/api/upload', {
				method: 'POST',
				body: formData,
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Erro no upload');
			}

			const { url } = await res.json();
			setImages((prev) => [...prev, url]);
			showToast('Imagem enviada com sucesso!', 'success');
		} catch (err: any) {
			showToast(err.message, 'error');
		} finally {
			setUploading(false);
		}
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleUpload(file);
		}
		// Limpar o input para permitir selecionar o mesmo arquivo novamente
		e.target.value = '';
	};

	const handleRemoveImage = (index: number) => {
		setImages(images.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		const priceNum = parseFloat(price.replace(',', '.'));
		const stockNum = parseInt(stock);

		if (isNaN(priceNum) || priceNum <= 0) {
			setError('Preço inválido');
			setLoading(false);
			return;
		}

		if (isNaN(stockNum) || stockNum < 0) {
			setError('Estoque inválido');
			setLoading(false);
			return;
		}

		try {
			const url = product ? `/api/products/${product.id}` : '/api/products';
			const method = product ? 'PUT' : 'POST';

			const res = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					name,
					description,
					price: priceNum,
					stock: stockNum,
					categoryId,
					images,
				}),
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Erro ao salvar produto');
			}

			onSuccess();
			onClose();
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={isOpen} onClose={onClose} className='relative z-50'>
			<div className='fixed inset-0 bg-black/30' aria-hidden='true' />

			<div className='fixed inset-0 flex items-center justify-center p-4'>
				<Dialog.Panel className='mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto'>
					<div className='flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10'>
						<Dialog.Title className='text-lg font-semibold'>
							{product ? 'Editar Produto' : 'Novo Produto'}
						</Dialog.Title>
						<button
							onClick={onClose}
							className='text-gray-400 hover:text-gray-600'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					<form onSubmit={handleSubmit} className='p-4 space-y-4'>
						{error && (
							<div className='bg-red-50 text-red-600 p-3 rounded-md text-sm'>
								{error}
							</div>
						)}

						<div className='space-y-2'>
							<Label htmlFor='name'>Nome do Produto *</Label>
							<Input
								id='name'
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
								placeholder='Ex: Smartphone XYZ'
							/>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='description'>Descrição *</Label>
							<Input
								id='description'
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
								placeholder='Descrição detalhada do produto'
							/>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='price'>Preço (Kz) *</Label>
								<Input
									id='price'
									type='text'
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									required
									placeholder='15000'
								/>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='stock'>Estoque *</Label>
								<Input
									id='stock'
									type='number'
									min='0'
									value={stock}
									onChange={(e) => setStock(e.target.value)}
									required
									placeholder='10'
								/>
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='category'>Categoria *</Label>
							<select
								id='category'
								value={categoryId}
								onChange={(e) => setCategoryId(e.target.value)}
								required
								className='w-full h-10 px-3 rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
							>
								<option value=''>Selecione uma categoria</option>
								{categories.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.name}
									</option>
								))}
							</select>
						</div>

						<div className='space-y-3'>
							<div className='flex items-center justify-between'>
								<Label>Imagens do Produto</Label>
								<div className='relative'>
									<input
										type='file'
										accept='image/*'
										onChange={handleFileSelect}
										className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
										disabled={uploading}
									/>
									<Button
										type='button'
										variant='outline'
										size='sm'
										disabled={uploading}
									>
										{uploading ? (
											<LoadingSpinner size='sm' />
										) : (
											<Upload className='h-3 w-3 mr-1' />
										)}
										{uploading ? 'Enviando...' : 'Adicionar imagem'}
									</Button>
								</div>
							</div>

							{images.length > 0 ? (
								<div className='grid grid-cols-2 gap-3 mt-2'>
									{images.map((url, index) => (
										<div
											key={index}
											className='relative group border rounded-md p-2'
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={url}
												alt={`Produto ${index + 1}`}
												className='w-full h-24 object-cover rounded'
											/>
											<button
												type='button'
												onClick={() => handleRemoveImage(index)}
												className='absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
											>
												<Trash2 className='h-3 w-3' />
											</button>
											{index === 0 && (
												<span className='absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded'>
													Principal
												</span>
											)}
										</div>
									))}
								</div>
							) : (
								<p className='text-sm text-gray-500 italic'>
									Nenhuma imagem adicionada. Clique em Adicionar imagem para
									fazer upload.
								</p>
							)}
						</div>

						<div className='flex justify-end gap-2 pt-4 border-t'>
							<Button type='button' variant='outline' onClick={onClose}>
								Cancelar
							</Button>
							<Button type='submit' disabled={loading || uploading}>
								{loading ? (
									<LoadingSpinner size='sm' />
								) : product ? (
									'Salvar'
								) : (
									'Criar'
								)}
							</Button>
						</div>
					</form>
				</Dialog.Panel>
			</div>
		</Dialog>
	);
}
