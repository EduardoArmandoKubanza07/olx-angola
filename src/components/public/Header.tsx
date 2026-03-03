'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';

export function Header() {
	const { user, logout } = useAuth();
	const { totalItems } = useCart();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	console.log(user);
	const navs = [
		{
			link: '/products',
			text: 'Produtos',
		},
		{
			link: '/categories',
			text: 'Categorias',
		},
	];

	return (
		<header className='bg-white shadow-sm sticky top-0 z-40'>
			<nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<Link href='/' className='text-xl font-bold text-blue-600'>
						OXL.<span className='text-gray-800'>Angola</span>
					</Link>

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center space-x-6'>
						{navs.map((nav) => (
							<Link key={nav.link} href={nav.link}>
								{nav.text}
							</Link>
						))}
					</div>

					{/* Desktop Right Icons */}
					<div className='hidden md:flex items-center space-x-4'>
						<Link
							href='/cart'
							className='relative p-2 text-gray-700 hover:text-blue-600'
						>
							<ShoppingCart className='h-5 w-5' />
							{totalItems > 0 && (
								<span className='absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
									{totalItems}
								</span>
							)}
						</Link>

						{user ? (
							<div className='flex items-center space-x-2'>
								<Link
									href='/profile'
									className='flex items-center space-x-1 p-2 text-gray-700 hover:text-blue-600'
								>
									<User className='h-5 w-5' />
									<span className='text-sm hidden lg:inline'>{user.name}</span>
								</Link>
								<Button
									variant='ghost'
									size='sm'
									onClick={logout}
									className='text-gray-700 hover:text-red-600'
								>
									<LogOut className='h-4 w-4' />
								</Button>
							</div>
						) : (
							<div className='flex items-center space-x-2'>
								<Link href='/login'>
									<Button variant='ghost' size='sm'>
										Entrar
									</Button>
								</Link>
								<Link href='/register'>
									<Button size='sm'>Cadastrar</Button>
								</Link>
							</div>
						)}
					</div>

					{/* Mobile menu button */}
					<button
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						className='md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100'
					>
						{mobileMenuOpen ? (
							<X className='h-6 w-6' />
						) : (
							<Menu className='h-6 w-6' />
						)}
					</button>
				</div>

				{/* Mobile menu */}
				{mobileMenuOpen && (
					<div className='md:hidden py-4 border-t space-y-2'>
						{navs.map((nav) => (
							<Link
								key={nav.link}
								href={nav.link}
								className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
								onClick={() => setMobileMenuOpen(false)}
							>
								{nav.text}
							</Link>
						))}

						<Link
							href='/cart'
							className='flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100'
							onClick={() => setMobileMenuOpen(false)}
						>
							<span>Carrinho</span>
							{totalItems > 0 && (
								<span className='bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
									{totalItems}
								</span>
							)}
						</Link>
						{user ? (
							<>
								<Link
									href={user?.role === 'ADMIN' ? '/admin' : '/profile'}
									className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
									onClick={() => setMobileMenuOpen(false)}
								>
									Meu Perfil
								</Link>
								<button
									onClick={() => {
										logout();
										setMobileMenuOpen(false);
									}}
									className='block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100'
								>
									Sair
								</button>
							</>
						) : (
							<>
								<Link
									href='/login'
									className='block px-4 py-2 text-blue-600 font-medium hover:bg-gray-100'
									onClick={() => setMobileMenuOpen(false)}
								>
									Entrar
								</Link>
								<Link
									href='/register'
									className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
									onClick={() => setMobileMenuOpen(false)}
								>
									Cadastrar
								</Link>
							</>
						)}
					</div>
				)}
			</nav>
		</header>
	);
}
