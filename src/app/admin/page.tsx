// src/app/admin/page.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
	const { user, loading, logout } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && (!user || user.role !== 'ADMIN')) {
			router.push('/');
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<p>Carregando...</p>
			</div>
		);
	}

	if (!user || user.role !== 'ADMIN') {
		return null;
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='flex justify-between items-center mb-8'>
					<h1 className='text-3xl font-bold'>Painel Administrativo</h1>
					<Button onClick={logout}>Sair</Button>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
					<Card>
						<CardHeader>
							<CardTitle>Produtos</CardTitle>
							<CardDescription>Gerir produtos do sistema</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className='w-full'
								onClick={() => router.push('/admin/products')}
							>
								Ver Produtos
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Categorias</CardTitle>
							<CardDescription>Gerir categorias</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className='w-full'
								onClick={() => router.push('/admin/categories')}
							>
								Ver Categorias
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Pedidos</CardTitle>
							<CardDescription>Gerir pedidos dos clientes</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className='w-full'
								onClick={() => router.push('/admin/orders')}
							>
								Ver Pedidos
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Utilizadores</CardTitle>
							<CardDescription>Gerir utilizadores</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className='w-full'
								onClick={() => router.push('/admin/users')}
							>
								Ver Utilizadores
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Relatórios</CardTitle>
							<CardDescription>Ver estatísticas e relatórios</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className='w-full'
								onClick={() => router.push('/admin/reports')}
							>
								Ver Relatórios
							</Button>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Configurações</CardTitle>
							<CardDescription>Configurações do sistema</CardDescription>
						</CardHeader>
						<CardContent>
							<Button
								className='w-full'
								onClick={() => router.push('/admin/settings')}
							>
								Ver Configurações
							</Button>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
