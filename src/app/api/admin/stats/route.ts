import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
	try {
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		// Datas para comparação mensal
		const now = new Date();
		const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		const firstDayPreviousMonth = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			1,
		);

		// Total de produtos
		const totalProducts = await prisma.product.count();

		// Total de usuários
		const totalUsers = await prisma.user.count();

		// Total de pedidos
		const totalOrders = await prisma.order.count();

		// Receita total (soma dos pedidos com status PAID ou DELIVERED)
		const revenueResult = await prisma.order.aggregate({
			where: { status: { in: ['PAID', 'DELIVERED'] } },
			_sum: { total: true },
		});
		const totalRevenue = revenueResult._sum.total || 0;

		// Receita do mês atual
		const currentMonthRevenueResult = await prisma.order.aggregate({
			where: {
				status: { in: ['PAID', 'DELIVERED'] },
				createdAt: { gte: firstDayCurrentMonth },
			},
			_sum: { total: true },
		});
		const currentMonthRevenue = currentMonthRevenueResult._sum.total || 0;

		// Receita do mês anterior
		const previousMonthRevenueResult = await prisma.order.aggregate({
			where: {
				status: { in: ['PAID', 'DELIVERED'] },
				createdAt: {
					gte: firstDayPreviousMonth,
					lt: firstDayCurrentMonth,
				},
			},
			_sum: { total: true },
		});
		const previousMonthRevenue = previousMonthRevenueResult._sum.total || 0;

		// Calcular variação percentual da receita
		const revenueChange =
			previousMonthRevenue === 0
				? '+100%'
				: `${(((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1)}%`;
		const revenueTrend =
			currentMonthRevenue >= previousMonthRevenue ? 'up' : 'down';

		// Variação de produtos (novos produtos no mês)
		const productsThisMonth = await prisma.product.count({
			where: { createdAt: { gte: firstDayCurrentMonth } },
		});
		const productsLastMonth = await prisma.product.count({
			where: {
				createdAt: {
					gte: firstDayPreviousMonth,
					lt: firstDayCurrentMonth,
				},
			},
		});
		const productsChange =
			productsLastMonth === 0
				? `+${productsThisMonth}`
				: `${(((productsThisMonth - productsLastMonth) / productsLastMonth) * 100).toFixed(1)}%`;
		const productsTrend =
			productsThisMonth >= productsLastMonth ? 'up' : 'down';

		// Variação de pedidos
		const ordersThisMonth = await prisma.order.count({
			where: { createdAt: { gte: firstDayCurrentMonth } },
		});
		const ordersLastMonth = await prisma.order.count({
			where: {
				createdAt: {
					gte: firstDayPreviousMonth,
					lt: firstDayCurrentMonth,
				},
			},
		});
		const ordersChange =
			ordersLastMonth === 0
				? `+${ordersThisMonth}`
				: `${(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(1)}%`;
		const ordersTrend = ordersThisMonth >= ordersLastMonth ? 'up' : 'down';

		// Variação de usuários
		const usersThisMonth = await prisma.user.count({
			where: { createdAt: { gte: firstDayCurrentMonth } },
		});
		const usersLastMonth = await prisma.user.count({
			where: {
				createdAt: {
					gte: firstDayPreviousMonth,
					lt: firstDayCurrentMonth,
				},
			},
		});
		const usersChange =
			usersLastMonth === 0
				? `+${usersThisMonth}`
				: `${(((usersThisMonth - usersLastMonth) / usersLastMonth) * 100).toFixed(1)}%`;
		const usersTrend = usersThisMonth >= usersLastMonth ? 'up' : 'down';

		// Pedidos recentes (últimos 5)
		const recentOrders = await prisma.order.findMany({
			take: 5,
			orderBy: { createdAt: 'desc' },
			include: {
				user: { select: { name: true } },
			},
		});

		// Dados para gráfico de vendas dos últimos 7 dias
		const last7Days = Array.from({ length: 7 }, (_, i) => {
			const d = new Date();
			d.setDate(d.getDate() - i);
			return d.toISOString().split('T')[0];
		}).reverse();

		const salesLast7Days = await Promise.all(
			last7Days.map(async (date) => {
				const start = new Date(date);
				const end = new Date(date);
				end.setDate(end.getDate() + 1);
				const result = await prisma.order.aggregate({
					where: {
						status: { in: ['PAID', 'DELIVERED'] },
						createdAt: { gte: start, lt: end },
					},
					_sum: { total: true },
				});
				return result._sum.total || 0;
			}),
		);

		return NextResponse.json({
			totalRevenue,
			revenueChange,
			revenueTrend,
			totalProducts,
			productsChange,
			productsTrend,
			totalOrders,
			ordersChange,
			ordersTrend,
			totalUsers,
			usersChange,
			usersTrend,
			recentOrders: recentOrders.map((order) => ({
				id: order.id,
				total: order.total,
				userName: order.user.name,
				createdAt: order.createdAt,
			})),
			chartData: {
				labels: last7Days.map((date) => {
					const d = new Date(date);
					return d.toLocaleDateString('pt-AO', { weekday: 'short' });
				}),
				values: salesLast7Days,
			},
		});
	} catch (error) {
		console.error('Erro ao buscar estatísticas:', error);
		return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
	}
}
