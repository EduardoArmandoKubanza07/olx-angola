import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// PATCH /api/admin/orders/[id] - Atualizar status do pedido
export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const { id } = await params;
		const { status } = await request.json();

		const validStatuses = [
			'PENDING',
			'PAID',
			'PROCESSING',
			'SHIPPED',
			'DELIVERED',
			'CANCELLED',
		];
		if (!validStatuses.includes(status)) {
			return NextResponse.json({ error: 'Status inválido' }, { status: 400 });
		}

		const order = await prisma.order.update({
			where: { id },
			data: { status },
		});

		return NextResponse.json(order);
	} catch (error) {
		console.error('Erro ao atualizar pedido:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
