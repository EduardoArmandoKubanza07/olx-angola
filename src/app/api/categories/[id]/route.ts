/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { categorySchema } from '@/validations/schemas';

export async function GET({ params }: { params: { id: string } }) {
	try {
		const category = await prisma.category.findUnique({
			where: { id: params.id },
			include: { products: true },
		});
		if (!category) {
			return NextResponse.json(
				{ error: 'Categoria não encontrada' },
				{ status: 404 },
			);
		}
		return NextResponse.json(category);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Erro ao buscar categoria' },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const body = await request.json();
		const validated = categorySchema.parse(body);

		const category = await prisma.category.update({
			where: { id: params.id },
			data: validated,
		});

		return NextResponse.json(category);
	} catch (error: any) {
		if (error.errors) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 },
			);
		}
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		await prisma.category.delete({
			where: { id: params.id },
		});

		return NextResponse.json({ message: 'Categoria removida' });
	} catch (error) {
		return NextResponse.json(
			{ error: 'Erro ao remover categoria' },
			{ status: 500 },
		);
	}
}
