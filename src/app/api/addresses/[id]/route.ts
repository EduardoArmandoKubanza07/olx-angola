/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { addressSchema } from '@/validations/schemas';

// GET /api/addresses/[id] - Buscar um endereço específico
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const { id } = await params;

		const address = await prisma.address.findFirst({
			where: { id, userId: user.id },
		});

		if (!address) {
			return NextResponse.json(
				{ error: 'Endereço não encontrado' },
				{ status: 404 },
			);
		}

		return NextResponse.json(address);
	} catch (error) {
		console.error('Erro ao buscar endereço:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}

// PUT /api/addresses/[id] - Atualizar endereço
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const { id } = await params;
		const body = await request.json();
		const validated = addressSchema.parse(body);

		// Verificar se o endereço pertence ao usuário
		const existingAddress = await prisma.address.findFirst({
			where: { id, userId: user.id },
		});

		if (!existingAddress) {
			return NextResponse.json(
				{ error: 'Endereço não encontrado' },
				{ status: 404 },
			);
		}

		// Se for definir como padrão, remover padrão dos outros
		if (validated.isDefault) {
			await prisma.address.updateMany({
				where: { userId: user.id, isDefault: true, id: { not: id } },
				data: { isDefault: false },
			});
		}

		const updatedAddress = await prisma.address.update({
			where: { id },
			data: validated,
		});

		return NextResponse.json(updatedAddress);
	} catch (error: any) {
		if (error.errors) {
			return NextResponse.json(
				{ error: 'Dados inválidos', details: error.errors },
				{ status: 400 },
			);
		}
		console.error('Erro ao atualizar endereço:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}

// DELETE /api/addresses/[id] - Excluir endereço
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const { id } = await params;

		// Verificar se o endereço pertence ao usuário
		const address = await prisma.address.findFirst({
			where: { id, userId: user.id },
		});

		if (!address) {
			return NextResponse.json(
				{ error: 'Endereço não encontrado' },
				{ status: 404 },
			);
		}

		await prisma.address.delete({
			where: { id },
		});

		return NextResponse.json({ message: 'Endereço removido com sucesso' });
	} catch (error) {
		console.error('Erro ao excluir endereço:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
