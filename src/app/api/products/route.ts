/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { productSchema } from '@/validations/schemas';

// GET /api/products - Listar produtos com suporte a filtros (busca e categoria)
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const q = searchParams.get('q');
		const categoryId = searchParams.get('category');

		// Construir o filtro dinamicamente
		const where: any = {};

		if (q) {
			where.OR = [{ name: { contains: q } }, { description: { contains: q } }];
		}

		if (categoryId) {
			where.categoryId = categoryId;
		}

		const products = await prisma.product.findMany({
			where,
			include: {
				category: {
					select: { id: true, name: true },
				},
				images: {
					orderBy: { order: 'asc' },
				},
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(products);
	} catch (error) {
		console.error('Erro ao buscar produtos:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar produtos' },
			{ status: 500 },
		);
	}
}

// POST /api/products - Criar novo produto (mantido igual)
export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const body = await request.json();
		const validated = productSchema.parse(body);

		const category = await prisma.category.findUnique({
			where: { id: validated.categoryId },
		});

		if (!category) {
			return NextResponse.json(
				{ error: 'Categoria não encontrada' },
				{ status: 400 },
			);
		}

		const product = await prisma.product.create({
			data: {
				name: validated.name,
				description: validated.description,
				price: validated.price,
				stock: validated.stock,
				categoryId: validated.categoryId,
				images: {
					create:
						validated.images?.map((url, index) => ({
							url,
							isMain: index === 0,
							order: index,
						})) || [],
				},
			},
			include: {
				category: true,
				images: true,
			},
		});

		return NextResponse.json(product, { status: 201 });
	} catch (error: any) {
		if (error.errors) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 },
			);
		}
		console.error('Erro ao criar produto:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}
