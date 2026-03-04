import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const orders = await prisma.order.findMany({
			include: {
				user: { select: { name: true, email: true } },
				items: { include: { product: { select: { name: true } } } },
				address: true,
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(orders);
	} catch (error) {
		console.error('Erro ao buscar pedidos:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
