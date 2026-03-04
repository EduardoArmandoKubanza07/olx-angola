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

		// 1. Buscar carrinho do usuário
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

		// 2. Verificar se o endereço pertence ao usuário
		const address = await prisma.address.findFirst({
			where: { id: addressId, userId: user.id },
		});
		if (!address) {
			return NextResponse.json({ error: 'Endereço inválido' }, { status: 400 });
		}

		// 3. Calcular total
		const total = cart.items.reduce(
			(acc, item) => acc + item.product.price * item.quantity,
			0,
		);

		// 4. Criar o pedido (sem transação explícita)
		const order = await prisma.order.create({
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
			include: { items: true },
		});

		// 5. Limpar o carrinho
		await prisma.cartItem.deleteMany({
			where: { cartId: cart.id },
		});

		return NextResponse.json(order, { status: 201 });
	} catch (error: any) {
		console.error('Erro detalhado ao criar pedido:', error);
		return NextResponse.json(
			{ error: error.message || 'Erro interno ao processar pedido' },
			{ status: 500 },
		);
	}
}
