/* eslint-disable react-hooks/set-state-in-effect */
// src/app/admin/page.tsx
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

const stats = [
	{
		title: 'Receita Total',
		value: '45.231,89',
		icon: DollarSign,
		change: '+20.1%',
		trend: 'up',
	},
	{
		title: 'Produtos',
		value: '2.345',
		icon: Package,
		change: '+180',
		trend: 'up',
	},
	{
		title: 'Pedidos',
		value: '356',
		icon: ShoppingCart,
		change: '-4.5%',
		trend: 'down',
	},
	{
		title: 'Usuários',
		value: '1.289',
		icon: Users,
		change: '+12.3%',
		trend: 'up',
	},
];

export default function AdminDashboard() {
	const [greeting, setGreeting] = useState('');

	useEffect(() => {
		const hour = new Date().getHours();
		if (hour < 12) setGreeting('Bom dia');
		else if (hour < 18) setGreeting('Boa tarde');
		else setGreeting('Boa noite');
	}, []);

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-2xl font-bold text-gray-900'>{greeting}, Admin!</h1>
				<p className='text-gray-600 mt-1'>
					Bem-vindo ao painel de controle. Aqui está o resumo da sua loja.
				</p>
			</div>

			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{stats.map((stat, index) => (
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
						<div className='h-64 flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300'>
							<p className='text-gray-500'>Gráfico de vendas em breve</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Pedidos Recentes</CardTitle>
					</CardHeader>
					<CardContent>
						<div className='space-y-4'>
							{[1, 2, 3, 4, 5].map((i) => (
								<div
									key={i}
									className='flex items-center justify-between py-2 border-b last:border-0'
								>
									<div>
										<p className='font-medium'>Pedido #{1000 + i}</p>
										<p className='text-sm text-gray-600'>Cliente Exemplo</p>
									</div>
									<span className='text-sm font-semibold'>
										AOA{(i * 150).toFixed(2)}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
