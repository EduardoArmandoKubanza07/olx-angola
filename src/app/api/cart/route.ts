import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// GET /api/cart - Retorna carrinho do usuário
export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const cart = await prisma.cart.findUnique({
			where: { userId: user.id },
			include: {
				items: {
					include: {
						product: {
							include: {
								images: {
									where: { isMain: true },
									take: 1,
								},
							},
						},
					},
				},
			},
		});

		return NextResponse.json(cart || { items: [] });
	} catch (error) {
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}

// POST /api/cart - Adiciona item ao carrinho
export async function POST(request: Request) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const { productId, quantity = 1 } = await request.json();

		// Verifica se produto existe e tem estoque
		const product = await prisma.product.findUnique({
			where: { id: productId },
		});
		if (!product) {
			return NextResponse.json(
				{ error: 'Produto não encontrado' },
				{ status: 404 },
			);
		}
		if (product.stock < quantity) {
			return NextResponse.json(
				{ error: 'Estoque insuficiente' },
				{ status: 400 },
			);
		}

		// Busca ou cria carrinho
		let cart = await prisma.cart.findUnique({
			where: { userId: user.id },
		});

		if (!cart) {
			cart = await prisma.cart.create({
				data: { userId: user.id },
			});
		}

		// Verifica se item já existe no carrinho
		const existingItem = await prisma.cartItem.findUnique({
			where: {
				cartId_productId: {
					cartId: cart.id,
					productId,
				},
			},
		});

		if (existingItem) {
			// Atualiza quantidade
			await prisma.cartItem.update({
				where: { id: existingItem.id },
				data: { quantity: existingItem.quantity + quantity },
			});
		} else {
			// Cria novo item
			await prisma.cartItem.create({
				data: {
					cartId: cart.id,
					productId,
					quantity,
				},
			});
		}

		return NextResponse.json({ message: 'Item adicionado' });
	} catch (error) {
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}

// DELETE /api/cart - Limpa carrinho
export async function DELETE() {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const cart = await prisma.cart.findUnique({
			where: { userId: user.id },
		});

		if (cart) {
			await prisma.cartItem.deleteMany({
				where: { cartId: cart.id },
			});
		}

		return NextResponse.json({ message: 'Carrinho limpo' });
	} catch (error) {
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
