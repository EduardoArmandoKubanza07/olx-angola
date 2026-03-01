// src/components/layout/navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function Navbar() {
	const { user, logout } = useAuth();

	return (
		<nav className='bg-white border-b border-gray-200'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex items-center'>
						<Link href='/' className='text-xl font-bold text-blue-600'>
							Loja Diversos
						</Link>

						<div className='hidden sm:ml-8 sm:flex sm:space-x-4'>
							<Link
								href='/products'
								className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
							>
								Produtos
							</Link>
							<Link
								href='/categories'
								className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
							>
								Categorias
							</Link>
							<Link
								href='/offers'
								className='text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium'
							>
								Ofertas
							</Link>
						</div>
					</div>

					<div className='flex items-center space-x-4'>
						{user ? (
							<>
								<span className='text-sm text-gray-700'>Olá, {user.name}</span>
								<Button variant='ghost' size='sm' onClick={logout}>
									Sair
								</Button>
							</>
						) : (
							<>
								<Link href='/login'>
									<Button variant='ghost' size='sm'>
										Entrar
									</Button>
								</Link>
								<Link href='/register'>
									<Button size='sm'>Cadastrar</Button>
								</Link>
							</>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
}
