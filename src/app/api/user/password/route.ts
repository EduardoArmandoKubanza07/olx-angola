/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser, hashPassword, comparePasswords } from '@/lib/auth';
import { z } from 'zod';

const passwordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
		newPassword: z
			.string()
			.min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
		confirmPassword: z.string().min(6, 'Confirmação de senha é obrigatória'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'As senhas não coincidem',
		path: ['confirmPassword'],
	});

export async function PUT(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const body = await request.json();
		const validated = passwordSchema.parse(body);

		// Buscar usuário com senha atual
		const fullUser = await prisma.user.findUnique({
			where: { id: user.id },
		});

		if (!fullUser) {
			return NextResponse.json(
				{ error: 'Usuário não encontrado' },
				{ status: 404 },
			);
		}

		// Verificar senha atual
		const passwordMatch = await comparePasswords(
			validated.currentPassword,
			fullUser.password,
		);
		if (!passwordMatch) {
			return NextResponse.json(
				{ error: 'Senha atual incorreta' },
				{ status: 400 },
			);
		}

		// Hash da nova senha
		const hashedNewPassword = await hashPassword(validated.newPassword);

		// Atualizar senha
		await prisma.user.update({
			where: { id: user.id },
			data: { password: hashedNewPassword },
		});

		return NextResponse.json({ message: 'Senha alterada com sucesso' });
	} catch (error: any) {
		if (error.errors) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 },
			);
		}
		console.error('Erro ao alterar senha:', error);
		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}
