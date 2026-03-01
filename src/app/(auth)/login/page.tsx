/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/auth/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useAuth();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await login(email, password);
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='min-h-screen grid lg:grid-cols-2'>
			{/* Lado esquerdo - Formulário */}
			<div className='flex items-center justify-center p-8'>
				<Card className='w-full max-w-md'>
					<CardHeader className='space-y-1'>
						<CardTitle className='text-3xl font-bold'>
							Bem-vindo de volta
						</CardTitle>
						<CardDescription>Entre na sua conta para continuar</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-4'>
							{error && (
								<Alert variant='error'>
									<p>{error}</p>
								</Alert>
							)}

							<div className='space-y-2'>
								<label htmlFor='email' className='text-sm font-medium'>
									Email
								</label>
								<Input
									id='email'
									type='email'
									placeholder='seu@email.com'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</div>

							<div className='space-y-2'>
								<label htmlFor='password' className='text-sm font-medium'>
									Senha
								</label>
								<Input
									id='password'
									type='password'
									placeholder='••••••••'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</div>

							<Button type='submit' className='w-full' loading={loading}>
								Entrar
							</Button>

							<p className='text-center text-sm text-gray-600'>
								Não tem uma conta?{' '}
								<Link
									href='/register'
									className='text-blue-600 hover:underline font-medium'
								>
									Registre-se
								</Link>
							</p>
						</form>
					</CardContent>
				</Card>
			</div>

			{/* Lado direito - SVG Ilustrativo */}
			<div className='hidden lg:flex bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-12'>
				<div className='max-w-md text-center'>
					<svg
						className='w-full h-auto'
						viewBox='0 0 400 400'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						{/* Carrinho de compras estilizado */}
						<circle cx='200' cy='200' r='150' fill='#E0E7FF' />

						{/* Ícone de carrinho */}
						<rect
							x='120'
							y='180'
							width='160'
							height='100'
							rx='10'
							fill='#3B82F6'
						/>
						<rect
							x='140'
							y='140'
							width='120'
							height='40'
							rx='8'
							fill='#2563EB'
						/>

						{/* Rodas do carrinho */}
						<circle cx='160' cy='280' r='20' fill='#1E3A8A' />
						<circle cx='240' cy='280' r='20' fill='#1E3A8A' />

						{/* Produtos dentro do carrinho */}
						<rect
							x='150'
							y='190'
							width='30'
							height='50'
							rx='4'
							fill='#FCD34D'
						/>
						<rect
							x='190'
							y='190'
							width='30'
							height='50'
							rx='4'
							fill='#F59E0B'
						/>
						<rect
							x='230'
							y='190'
							width='30'
							height='50'
							rx='4'
							fill='#FBBF24'
						/>

						{/* Tag de preço */}
						<path
							d='M300 120 L340 120 L330 100 L310 100 L300 120'
							fill='#EF4444'
						/>
						<text
							x='315'
							y='115'
							fill='white'
							fontSize='12'
							textAnchor='middle'
						>
							50%
						</text>

						{/* Texto */}
						<text
							x='200'
							y='350'
							fill='#1E3A8A'
							fontSize='24'
							fontWeight='bold'
							textAnchor='middle'
						>
							Compre com Facilidade
						</text>
						<text
							x='200'
							y='380'
							fill='#6B7280'
							fontSize='16'
							textAnchor='middle'
						>
							Milhares de produtos à sua espera
						</text>
					</svg>

					<h2 className='mt-8 text-2xl font-bold text-gray-900'>
						Sua loja de diversos online
					</h2>
					<p className='mt-2 text-gray-600'>
						Encontre tudo o que precisa num só lugar
					</p>
				</div>
			</div>
		</div>
	);
}
