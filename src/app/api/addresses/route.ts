/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { addressSchema } from '@/validations/schemas';

// GET /api/addresses - Listar endereços do usuário logado
export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const addresses = await prisma.address.findMany({
			where: { userId: user.id },
			orderBy: { isDefault: 'desc' }, // endereços padrão aparecem primeiro
		});

		return NextResponse.json(addresses);
	} catch (error) {
		console.error('Erro ao buscar endereços:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}

// POST /api/addresses - Criar novo endereço
export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const body = await request.json();
		const validated = addressSchema.parse(body);

		// Se o novo endereço for marcado como padrão, removemos o padrão dos outros endereços
		if (validated.isDefault) {
			await prisma.address.updateMany({
				where: { userId: user.id, isDefault: true },
				data: { isDefault: false },
			});
		}

		const address = await prisma.address.create({
			data: {
				...validated,
				userId: user.id,
			},
		});

		return NextResponse.json(address, { status: 201 });
	} catch (error: any) {
		if (error.errors) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 },
			);
		}
		console.error('Erro ao criar endereço:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
