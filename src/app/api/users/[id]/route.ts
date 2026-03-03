/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

// Schema para atualização (apenas role por enquanto, mas pode expandir)
const updateUserSchema = z.object({
	role: z.enum(['USER', 'ADMIN']),
	name: z.string().min(3).optional(),
	email: z.string().email().optional(),
});

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser || currentUser.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { id } = await params;

		const user = await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
				_count: {
					select: {
						orders: true,
						addresses: true,
					},
				},
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'Usuário não encontrado' },
				{ status: 404 },
			);
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error('Erro ao buscar usuário:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar usuário' },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser || currentUser.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { id } = await params;

		// Impedir que o admin mude a própria role ou se exclua (vamos tratar no DELETE)
		if (id === currentUser.id) {
			return NextResponse.json(
				{ error: 'Não é possível alterar o próprio usuário' },
				{ status: 400 },
			);
		}

		const body = await request.json();
		const validated = updateUserSchema.parse(body);

		const updatedUser = await prisma.user.update({
			where: { id },
			data: validated,
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return NextResponse.json(updatedUser);
	} catch (error: any) {
		if (error.errors) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 },
			);
		}
		console.error('Erro ao atualizar usuário:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser || currentUser.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { id } = await params;

		// Impedir auto-exclusão
		if (id === currentUser.id) {
			return NextResponse.json(
				{ error: 'Não é possível excluir o próprio usuário' },
				{ status: 400 },
			);
		}

		// Verificar se usuário existe
		const user = await prisma.user.findUnique({
			where: { id },
			include: {
				_count: {
					select: { orders: true },
				},
			},
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'Usuário não encontrado' },
				{ status: 404 },
			);
		}

		// Opcional: impedir exclusão se tiver pedidos (para manter integridade)
		if (user._count.orders > 0) {
			return NextResponse.json(
				{ error: 'Não é possível excluir usuário com pedidos' },
				{ status: 400 },
			);
		}

		await prisma.user.delete({
			where: { id },
		});

		return NextResponse.json({ message: 'Usuário removido com sucesso' });
	} catch (error) {
		console.error('Erro ao excluir usuário:', error);
		return NextResponse.json(
			{ error: 'Erro ao excluir usuário' },
			{ status: 500 },
		);
	}
}
