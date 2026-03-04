import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/orders - Lista todos os pedidos (admin)
export async function GET(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const status = searchParams.get('status'); // filtra por status

		const where = status ? { status } : {};

		const orders = await prisma.order.findMany({
			where,
			include: {
				user: { select: { id: true, name: true, email: true } },
				address: true,
				items: { include: { product: { include: { images: { take: 1 } } } } },
			},
			orderBy: { createdAt: 'desc' },
		});

		return NextResponse.json(orders);
	} catch (error) {
		console.error('Erro ao buscar pedidos:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
