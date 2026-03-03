// src/components/admin/ProductCard.tsx
'use client';

import { Pencil, Trash2, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPriceKz } from '@/lib/utils';

interface ProductCardProps {
	product: {
		id: string;
		name: string;
		price: number;
		stock: number;
		category: { name: string };
		images: { url: string; isMain: boolean }[];
	};
	onEdit: () => void;
	onDelete: () => void;
}

export function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
	const mainImage =
		product.images.find((img) => img.isMain) || product.images[0];

	return (
		<Card className='hover:shadow-md transition-shadow overflow-hidden'>
			<div className='aspect-square bg-gray-100 flex items-center justify-center'>
				{mainImage ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={mainImage.url}
						alt={product.name}
						className='w-full h-full object-cover'
					/>
				) : (
					<ImageOff className='h-12 w-12 text-gray-400' />
				)}
			</div>
			<CardContent className='p-4'>
				<h3 className='font-semibold text-lg mb-1 line-clamp-1'>
					{product.name}
				</h3>
				<p className='text-sm text-gray-600 mb-2'>{product.category.name}</p>
				<div className='flex justify-between items-center mb-3'>
					<span className='text-xl font-bold text-blue-600'>
						{formatPriceKz(product.price)}
					</span>
					<span
						className={`text-xs px-2 py-1 rounded-full ${
							product.stock > 0
								? 'bg-green-100 text-green-700'
								: 'bg-red-100 text-red-700'
						}`}
					>
						{product.stock > 0 ? `${product.stock} unid.` : 'Esgotado'}
					</span>
				</div>
				<div className='flex gap-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={onEdit}
						className='flex-1'
					>
						<Pencil className='h-3 w-3 mr-1' />
						Editar
					</Button>
					<Button
						variant='destructive'
						size='sm'
						onClick={onDelete}
						className='flex-1'
					>
						<Trash2 className='h-3 w-3 mr-1' />
						Excluir
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
