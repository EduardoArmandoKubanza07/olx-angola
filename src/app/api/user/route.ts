/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const updateProfileSchema = z.object({
	name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	email: z.string().email('Email inválido'),
});

export async function PUT(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const body = await request.json();
		const validated = updateProfileSchema.parse(body);

		// Verificar se email já está em uso por outro usuário
		if (validated.email !== user.email) {
			const existingUser = await prisma.user.findUnique({
				where: { email: validated.email },
			});
			if (existingUser) {
				return NextResponse.json(
					{ error: 'Email já está em uso' },
					{ status: 400 },
				);
			}
		}

		const updatedUser = await prisma.user.update({
			where: { id: user.id },
			data: {
				name: validated.name,
				email: validated.email,
			},
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
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
		console.error('Erro ao atualizar perfil:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}
