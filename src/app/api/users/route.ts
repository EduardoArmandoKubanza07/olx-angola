// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
	try {
		// Verificar autenticação e role admin
		const currentUser = await getCurrentUser();
		if (!currentUser || currentUser.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const users = await prisma.user.findMany({
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
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(users);
	} catch (error) {
		console.error('Erro ao buscar usuários:', error);
		return NextResponse.json(
			{ error: 'Erro ao buscar usuários' },
			{ status: 500 },
		);
	}
}
