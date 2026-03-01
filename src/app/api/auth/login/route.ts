// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePasswords, generateToken } from '@/lib/auth';
import { loginSchema } from '@/validations/schemas';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Validar dados
		const validatedData = loginSchema.parse(body);

		// Buscar usuário
		const user = await prisma.user.findUnique({
			where: { email: validatedData.email },
		});

		if (!user) {
			return NextResponse.json(
				{ error: 'Email ou senha inválidos' },
				{ status: 401 },
			);
		}

		// Verificar senha
		const passwordMatch = await comparePasswords(
			validatedData.password,
			user.password,
		);

		if (!passwordMatch) {
			return NextResponse.json(
				{ error: 'Email ou senha inválidos' },
				{ status: 401 },
			);
		}

		// Gerar token
		const token = generateToken(user.id, user.role);

		// Setar cookie
		(await cookies()).set('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60, // 7 dias
		});

		return NextResponse.json({
			message: 'Login realizado com sucesso',
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role,
			},
		});
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
