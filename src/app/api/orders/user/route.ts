import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const orders = await prisma.order.findMany({
			where: { userId: user.id },
			include: {
				items: {
					include: {
						product: {
							select: { name: true, price: true, images: { take: 1 } },
						},
					},
				},
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
