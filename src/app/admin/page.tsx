'use client';

import { useEffect, useState } from 'react';
import {
	Package,
	ShoppingCart,
	Users,
	DollarSign,
	TrendingUp,
	TrendingDown,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { formatPriceKz } from '@/lib/utils';

interface Stats {
	totalRevenue: number;
	revenueChange: string;
	revenueTrend: 'up' | 'down';
	totalProducts: number;
	productsChange: string;
	productsTrend: 'up' | 'down';
	totalOrders: number;
	ordersChange: string;
	ordersTrend: 'up' | 'down';
	totalUsers: number;
	usersChange: string;
	usersTrend: 'up' | 'down';
	recentOrders: Array<{
		id: string;
		total: number;
		userName: string;
		createdAt: string;
	}>;
	chartData: {
		labels: string[];
		values: number[];
	};
}

export default function AdminDashboard() {
	const [greeting, setGreeting] = useState('');
	const [stats, setStats] = useState<Stats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const hour = new Date().getHours();
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (hour < 12) setGreeting('Bom dia');
		else if (hour < 18) setGreeting('Boa tarde');
		else setGreeting('Boa noite');
	}, []);

	useEffect(() => {
		fetch('/api/admin/stats')
			.then((res) => res.json())
			.then((data) => {
				setStats(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error('Erro ao carregar estatísticas', err);
				setLoading(false);
			});
	}, []);

	if (loading) {
		return (
			<div className='h-64 flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando dashboard...' />
			</div>
		);
	}

	if (!stats) {
		return <div>Erro ao carregar dados</div>;
	}

	const statCards = [
		{
			title: 'Receita Total',
			value: formatPriceKz(stats.totalRevenue),
			icon: DollarSign,
			change: stats.revenueChange,
			trend: stats.revenueTrend,
		},
		{
			title: 'Produtos',
			value: stats.totalProducts.toString(),
			icon: Package,
			change: stats.productsChange,
			trend: stats.productsTrend,
		},
		{
			title: 'Pedidos',
			value: stats.totalOrders.toString(),
			icon: ShoppingCart,
			change: stats.ordersChange,
			trend: stats.ordersTrend,
		},
		{
			title: 'Usuários',
			value: stats.totalUsers.toString(),
			icon: Users,
			change: stats.usersChange,
			trend: stats.usersTrend,
		},
	];

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-2xl font-bold text-gray-900'>{greeting}, Admin!</h1>
				<p className='text-gray-600 mt-1'>
					Bem-vindo ao painel de controle. Aqui está o resumo da sua loja.
				</p>
			</div>

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{statCards.map((stat, index) => (
					<Card key={index} className='hover:shadow-md transition-shadow'>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-sm font-medium text-gray-600'>
								{stat.title}
							</CardTitle>
							<stat.icon className='h-4 w-4 text-gray-400' />
						</CardHeader>
						<CardContent>
							<div className='text-2xl font-bold'>{stat.value}</div>
							<p
								className={`text-xs flex items-center mt-1 ${
									stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
								}`}
							>
								{stat.trend === 'up' ? (
									<TrendingUp className='h-3 w-3 mr-1' />
								) : (
									<TrendingDown className='h-3 w-3 mr-1' />
								)}
								{stat.change} em relação ao mês passado
							</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className='grid gap-6 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle>Vendas dos últimos 7 dias</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='h-64 flex items-end justify-around bg-gray-50 rounded-lg border border-dashed border-gray-300 p-4'>
							{stats.chartData.values.map((value, i) => {
								const max = Math.max(...stats.chartData.values, 1);
								const height = value > 0 ? (value / max) * 200 : 10; // altura mínima para visibilidade
								return (
									<div key={i} className='flex flex-col items-center w-8'>
										<div
											className='w-6 bg-blue-500 rounded-t'
											style={{ height: `${height}px` }}
										></div>
										<span className='text-xs mt-1 text-gray-600'>
											{stats.chartData.labels[i]}
										</span>
										<span className='text-xs font-medium'>
											{formatPriceKz(value)}
										</span>
									</div>
								);
							})}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Pedidos Recentes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{stats.recentOrders.length === 0 ? (
								<p className='text-gray-500'>Nenhum pedido recente.</p>
							) : (
								stats.recentOrders.map((order) => (
									<div
										key={order.id}
										className='flex items-center justify-between py-2 border-b last:border-0'
									>
										<div>
											<p className='font-medium'>
												Pedido #{order.id.slice(-8)}
											</p>
											<p className='text-sm text-gray-600'>{order.userName}</p>
										</div>
										<span className='text-sm font-semibold'>
											{formatPriceKz(order.total)}
										</span>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
