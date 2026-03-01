// prisma/seed/index.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/lib/auth';

const prisma = new PrismaClient();

async function main() {
	// Criar categorias
	const categories = await Promise.all([
		prisma.category.create({
			data: {
				name: 'Eletrônicos',
				description: 'Produtos eletrônicos em geral',
			},
		}),
		prisma.category.create({
			data: {
				name: 'Roupas',
				description: 'Moda masculina e feminina',
			},
		}),
		prisma.category.create({
			data: {
				name: 'Livros',
				description: 'Livros de diversos gêneros',
			},
		}),
	]);

	// Criar usuário admin
	const adminPassword = await hashPassword('admin123');
	await prisma.user.create({
		data: {
			email: 'admin@example.com',
			password: adminPassword,
			name: 'Administrador',
			role: 'ADMIN',
		},
	});

	// Criar usuário comum
	const userPassword = await hashPassword('user123');
	await prisma.user.create({
		data: {
			email: 'user@example.com',
			password: userPassword,
			name: 'Usuário Teste',
			role: 'USER',
		},
	});

	console.log('Seed completed successfully!');
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
