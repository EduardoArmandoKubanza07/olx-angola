/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { productSchema } from '@/validations/schemas';

// GET /api/products/[id] - Buscar produto específico
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const product = await prisma.product.findUnique({
			where: { id },
			include: {
				category: true,
				images: {
					orderBy: { order: 'asc' },
				},
			},
		});

		if (!product) {
			return NextResponse.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 },
			);
		}

		return NextResponse.json(product);
	} catch (error) {
		console.error('Erro ao buscar produto:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar produto' },
			{ status: 500 },
		);
	}
}

// PUT /api/products/[id] - Atualizar produto
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();
		const validated = productSchema.parse(body);

		// Verificar se produto existe
		const existingProduct = await prisma.product.findUnique({
			where: { id },
			include: { images: true },
		});

		if (!existingProduct) {
			return NextResponse.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 },
			);
		}

		// Verificar se a categoria existe
		const category = await prisma.category.findUnique({
			where: { id: validated.categoryId },
		});

		if (!category) {
			return NextResponse.json(
				{ error: 'Categoria não encontrada' },
				{ status: 400 },
			);
		}

		// Atualizar produto e imagens
		const product = await prisma.$transaction(async (tx) => {
			// Atualizar dados básicos
			const updated = await tx.product.update({
				where: { id },
				data: {
					name: validated.name,
					description: validated.description,
					price: validated.price,
					stock: validated.stock,
					categoryId: validated.categoryId,
				},
			});

			// Remover imagens antigas
			await tx.productImage.deleteMany({
				where: { productId: id },
			});

			// Criar novas imagens
			if (validated.images && validated.images.length > 0) {
				await tx.productImage.createMany({
					data: validated.images.map((url, index) => ({
						productId: id,
						url,
						isMain: index === 0,
						order: index,
					})),
				});
			}

			return updated;
		});

		// Buscar produto atualizado com relacionamentos
		const updatedProduct = await prisma.product.findUnique({
			where: { id },
			include: {
				category: true,
				images: {
					orderBy: { order: 'asc' },
				},
			},
		});

		return NextResponse.json(updatedProduct);
	} catch (error: any) {
		if (error.errors) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 },
			);
		}
		console.error('Erro ao atualizar produto:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}

// DELETE /api/products/[id] - Remover produto
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { id } = await params;

		// Verificar se produto existe
		const product = await prisma.product.findUnique({
			where: { id },
		});

		if (!product) {
			return NextResponse.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 },
			);
		}

		// O prisma irá deletar em cascata as imagens (onDelete: Cascade)
		await prisma.product.delete({
			where: { id },
		});

		return NextResponse.json({ message: 'Produto removido com sucesso' });
	} catch (error) {
		console.error('Erro ao remover produto:', error);
		return NextResponse.json(
			{ error: 'Erro ao remover produto' },
			{ status: 500 },
		);
	}
}
