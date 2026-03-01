// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { userSchema } from '@/validations/schemas';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Validar dados
		const validatedData = userSchema.parse(body);

		// Verificar se usuário já existe
		const existingUser = await prisma.user.findUnique({
			where: { email: validatedData.email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: 'Email já cadastrado' },
				{ status: 400 },
			);
		}

		// Hash da senha
		const hashedPassword = await hashPassword(validatedData.password);

		// Criar usuário
		const user = await prisma.user.create({
			data: {
				email: validatedData.email,
				password: hashedPassword,
				name: validatedData.name,
			},
			select: {
				id: true,
				email: true,
				name: true,
				role: true,
			},
		});

		// Gerar token
		const token = generateToken(user.id, user.role);

		// Setar cookie
		(await cookies()).set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60, // 7 dias
		});

		return NextResponse.json(
			{
				message: 'Usuário criado com sucesso',
				user,
			},
			{ status: 201 },
		);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		if (error.errors) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: 'Erro interno do servidor' },
			{ status: 500 },
		);
	}
}
