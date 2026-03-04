/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const { addressId, paymentMethod, paymentProof } = await request.json();

		// Buscar carrinho com produtos
		const cart = await prisma.cart.findUnique({
			where: { userId: user.id },
			include: {
				items: {
					include: { product: true },
				},
			},
		});

		if (!cart || cart.items.length === 0) {
			return NextResponse.json({ error: 'Carrinho vazio' }, { status: 400 });
		}

		// Verificar endereço pertence ao usuário
		const address = await prisma.address.findFirst({
			where: { id: addressId, userId: user.id },
		});
		if (!address) {
			return NextResponse.json({ error: 'Endereço inválido' }, { status: 400 });
		}

		// Verificar estoque suficiente
		for (const item of cart.items) {
			if (item.product.stock < item.quantity) {
				return NextResponse.json(
					{ error: `Produto ${item.product.name} sem estoque suficiente` },
					{ status: 400 },
				);
			}
		}

		// Calcular total
		const total = cart.items.reduce(
			(acc, item) => acc + item.product.price * item.quantity,
			0,
		);

		// Usar transação para garantir atomicidade
		const order = await prisma.$transaction(async (tx) => {
			// 1. Criar o pedido
			const newOrder = await tx.order.create({
				data: {
					userId: user.id,
					addressId,
					total,
					paymentMethod,
					paymentProof,
					status: 'PENDING',
					items: {
						create: cart.items.map((item) => ({
							productId: item.productId,
							quantity: item.quantity,
							price: item.product.price,
						})),
					},
				},
			});

			// 2. Atualizar estoque de cada produto
			for (const item of cart.items) {
				await tx.product.update({
					where: { id: item.productId },
					data: {
						stock: {
							decrement: item.quantity,
						},
					},
				});
			}

			// 3. Limpar carrinho
			await tx.cartItem.deleteMany({
				where: { cartId: cart.id },
			});

			return newOrder;
		});

		return NextResponse.json(order, { status: 201 });
	} catch (error: any) {
		console.error('Erro ao criar pedido:', error);
		return NextResponse.json(
			{ error: error.message || 'Erro interno ao processar pedido' },
			{ status: 500 },
		);
	}
}
