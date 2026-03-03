// src/app/admin/layout.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
	Menu,
	X,
	LayoutDashboard,
	Package,
	ShoppingCart,
	Users,
	Tag,
	LogOut,
	Home,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading, logout } = useAuth();
	const router = useRouter();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		if (!loading && (!user || user.role !== 'ADMIN')) {
			router.push('/');
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
			</div>
		);
	}

	if (!user || user.role !== 'ADMIN') return null;

	const navigation = [
		{ name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
		{ name: 'Produtos', href: '/admin/products', icon: Package },
		{ name: 'Categorias', href: '/admin/categories', icon: Tag },
		{ name: 'Pedidos', href: '/admin/orders', icon: ShoppingCart },
		{ name: 'Usuários', href: '/admin/users', icon: Users },
		{ name: 'Início', href: '/', icon: Home },
	];

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Sidebar - sempre fixed em desktop */}
			<aside
				className={`
          fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-300 ease-in-out z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
			>
				{/* Logo */}
				<div className='h-16 flex items-center justify-between px-4 border-b border-gray-200'>
					<Link href='/admin' className='text-xl font-bold text-blue-600'>
						OLX<span className='text-gray-800'>.Angola</span>
					</Link>
					<button
						onClick={() => setSidebarOpen(false)}
						className='lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100'
					>
						<X className='h-5 w-5' />
					</button>
				</div>

				{/* Navegação */}
				<nav className='flex-1 overflow-y-auto py-4 px-3 space-y-1'>
					{navigation.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className='flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 hover:text-blue-600 transition-colors'
							onClick={() => setSidebarOpen(false)}
						>
							<item.icon className='h-5 w-5' />
							<span>{item.name}</span>
						</Link>
					))}
				</nav>

				{/* Informações do usuário e logout */}
				<div className='border-t border-gray-200 p-4'>
					<div className='flex items-center gap-3 mb-3'>
						<div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold'>
							{user.name?.charAt(0).toUpperCase()}
						</div>
						<div className='flex-1 min-w-0'>
							<p className='text-sm font-medium text-gray-900 truncate'>
								{user.name}
							</p>
							<p className='text-xs text-gray-500 truncate'>{user.email}</p>
						</div>
					</div>
					<Button
						variant='ghost'
						className='w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50'
						onClick={logout}
					>
						<LogOut className='h-4 w-4 mr-2' />
						Sair
					</Button>
				</div>
			</aside>

			{/* Overlay para mobile */}
			{sidebarOpen && (
				<div
					className='fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden'
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Conteúdo principal - com margem esquerda em desktop */}
			<div className='lg:ml-64 flex flex-col min-h-screen'>
				{/* Header - fixo no topo com largura total menos sidebar */}
				<header className='sticky top-0 z-10 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6'>
					<button
						onClick={() => setSidebarOpen(true)}
						className='lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 mr-4'
					>
						<Menu className='h-5 w-5' />
					</button>
					<div className='flex-1' />
					<div className='flex items-center gap-3'>
						<span className='text-sm text-gray-700 hidden sm:inline'>
							Olá, {user.name}
						</span>
						<div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold sm:hidden'>
							{user.name?.charAt(0).toUpperCase()}
						</div>
					</div>
				</header>

				{/* Conteúdo da página */}
				<main className='flex-1 p-4 lg:p-6'>{children}</main>
			</div>
		</div>
	);
}
