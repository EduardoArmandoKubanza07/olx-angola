import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// PUT /api/cart/[itemId] - Atualiza quantidade
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ itemId: string }> },
) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const { itemId } = await params;
		const { quantity } = await request.json();

		if (quantity < 1) {
			return NextResponse.json(
				{ error: 'Quantidade inválida' },
				{ status: 400 },
			);
		}

		const item = await prisma.cartItem.findUnique({
			where: { id: itemId },
			include: { cart: true },
		});

		if (!item || item.cart.userId !== user.id) {
			return NextResponse.json(
				{ error: 'Item não encontrado' },
				{ status: 404 },
			);
		}

		// Verifica estoque
		const product = await prisma.product.findUnique({
			where: { id: item.productId },
		});
		if (product && product.stock < quantity) {
			return NextResponse.json(
				{ error: 'Estoque insuficiente' },
				{ status: 400 },
			);
		}

		await prisma.cartItem.update({
			where: { id: itemId },
			data: { quantity },
		});

		return NextResponse.json({ message: 'Quantidade atualizada' });
	} catch (error) {
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}

// DELETE /api/cart/[itemId] - Remove item
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ itemId: string }> },
) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const { itemId } = await params;

		const item = await prisma.cartItem.findUnique({
			where: { id: itemId },
			include: { cart: true },
		});

		if (!item || item.cart.userId !== user.id) {
			return NextResponse.json(
				{ error: 'Item não encontrado' },
				{ status: 404 },
			);
		}

		await prisma.cartItem.delete({
			where: { id: itemId },
		});

		return NextResponse.json({ message: 'Item removido' });
	} catch (error) {
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
