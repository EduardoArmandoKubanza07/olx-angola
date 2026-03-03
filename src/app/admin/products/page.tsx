/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/admin/produtos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/components/ui/toast';
import { ProductModal } from '@/components/admin/ProductModal';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { ProductCard } from '@/components/admin/ProductCard';
import { Plus } from 'lucide-react';

interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	categoryId: string;
	category: { id: string; name: string };
	images: { url: string; isMain: boolean }[];
}

export default function AdminProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<{ id: string; name: string }[]>(
		[],
	);
	const [loading, setLoading] = useState(true);
	const [modalOpen, setModalOpen] = useState(false);
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const { showToast } = useToast();

	const fetchData = async () => {
		try {
			const [productsRes, categoriesRes] = await Promise.all([
				fetch('/api/products'),
				fetch('/api/categories'),
			]);

			if (!productsRes.ok) throw new Error('Erro ao carregar produtos');
			if (!categoriesRes.ok) throw new Error('Erro ao carregar categorias');

			const productsData = await productsRes.json();
			const categoriesData = await categoriesRes.json();

			setProducts(productsData);
			setCategories(categoriesData);
		} catch (err: any) {
			showToast(err.message, 'error');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleEdit = (product: Product) => {
		setSelectedProduct(product);
		setModalOpen(true);
	};

	const handleDeleteClick = (product: Product) => {
		setSelectedProduct(product);
		setDeleteModalOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!selectedProduct) return;

		setDeleteLoading(true);
		try {
			const res = await fetch(`/api/products/${selectedProduct.id}`, {
				method: 'DELETE',
			});

			if (!res.ok) {
				const data = await res.json();
				throw new Error(data.error || 'Erro ao excluir');
			}

			showToast('Produto excluído com sucesso!', 'success');
			setProducts(products.filter((p) => p.id !== selectedProduct.id));
			setDeleteModalOpen(false);
		} catch (err: any) {
			showToast(err.message, 'error');
		} finally {
			setDeleteLoading(false);
			setSelectedProduct(null);
		}
	};

	const handleModalSuccess = () => {
		showToast(
			selectedProduct ? 'Produto atualizado!' : 'Produto criado!',
			'success',
		);
		fetchData();
	};

	if (loading) {
		return (
			<div className='h-64 flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando produtos...' />
			</div>
		);
	}

	return (
		<div>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-2xl font-bold text-gray-800'>Produtos</h2>
				<Button
					onClick={() => {
						setSelectedProduct(null);
						setModalOpen(true);
					}}
				>
					<Plus className='h-4 w-4 mr-2' />
					Novo Produto
				</Button>
			</div>

			{products.length === 0 ? (
				<div className='text-center py-12 bg-white rounded-lg border border-dashed'>
					<p className='text-gray-500'>Nenhum produto cadastrado.</p>
					<Button
						variant='link'
						onClick={() => {
							setSelectedProduct(null);
							setModalOpen(true);
						}}
						className='mt-2'
					>
						Cadastrar primeiro produto
					</Button>
				</div>
			) : (
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onEdit={() => handleEdit(product)}
							onDelete={() => handleDeleteClick(product)}
						/>
					))}
				</div>
			)}

			<ProductModal
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
				onSuccess={handleModalSuccess}
				categories={categories}
				product={selectedProduct}
			/>

			<DeleteConfirmModal
				isOpen={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				onConfirm={handleDeleteConfirm}
				itemName={selectedProduct?.name || ''}
				loading={deleteLoading}
			/>
		</div>
	);
}
