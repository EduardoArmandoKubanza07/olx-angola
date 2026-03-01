/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/categories/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { categorySchema } from '@/validations/schemas';

export async function GET() {
	try {
		const categories = await prisma.category.findMany({
			orderBy: { name: 'asc' },
		});
		return NextResponse.json(categories);
	} catch (error) {
		return NextResponse.json(
			{ error: 'Erro ao buscar categorias' },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const body = await request.json();
		const validated = categorySchema.parse(body);

		const category = await prisma.category.create({
			data: validated,
		});

		return NextResponse.json(category, { status: 201 });
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
