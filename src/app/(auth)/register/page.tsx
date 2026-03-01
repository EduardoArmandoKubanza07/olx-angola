// src/app/auth/register/page.tsx
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

export default function RegisterPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { register } = useAuth();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('As senhas não coincidem');
			return;
		}

		if (password.length < 6) {
			setError('A senha deve ter no mínimo 6 caracteres');
			return;
		}

		setLoading(true);

		try {
			await register(name, email, password);
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='min-h-screen grid lg:grid-cols-2'>
			{/* Lado esquerdo - SVG Ilustrativo */}
			<div className='hidden lg:flex bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center p-12'>
				<div className='max-w-md text-center'>
					<svg
						className='w-full h-auto'
						viewBox='0 0 400 400'
						fill='none'
						xmlns='http://www.w3.org/2000/svg'
					>
						{/* Background */}
						<circle cx='200' cy='200' r='150' fill='#E0E7FF' />

						{/* Ícone de presente/novo usuário */}
						<rect
							x='140'
							y='140'
							width='120'
							height='120'
							rx='20'
							fill='#3B82F6'
						/>

						{/* Fita do presente */}
						<rect x='140' y='185' width='120' height='30' fill='#2563EB' />
						<rect x='185' y='140' width='30' height='120' fill='#2563EB' />

						{/* Laço */}
						<circle cx='200' cy='185' r='15' fill='#F59E0B' />
						<circle cx='200' cy='215' r='15' fill='#F59E0B' />

						{/* Confetes */}
						<circle cx='280' cy='120' r='8' fill='#FCD34D' />
						<circle cx='320' cy='160' r='8' fill='#34D399' />
						<circle cx='120' cy='280' r='8' fill='#F87171' />
						<circle cx='80' cy='240' r='8' fill='#60A5FA' />

						{/* Texto */}
						<text
							x='200'
							y='350'
							fill='#1E3A8A'
							fontSize='24'
							fontWeight='bold'
							textAnchor='middle'
						>
							Junte-se a Nós
						</text>
						<text
							x='200'
							y='380'
							fill='#6B7280'
							fontSize='16'
							textAnchor='middle'
						>
							Crie sua conta e comece a comprar
						</text>
					</svg>

					<h2 className='mt-8 text-2xl font-bold text-gray-900'>
						Novo por aqui?
					</h2>
					<p className='mt-2 text-gray-600'>
						Cadastre-se e tenha acesso a ofertas exclusivas
					</p>
				</div>
			</div>

			{/* Lado direito - Formulário */}
			<div className='flex items-center justify-center p-8'>
				<Card className='w-full max-w-md'>
					<CardHeader className='space-y-1'>
						<CardTitle className='text-3xl font-bold'>Criar conta</CardTitle>
						<CardDescription>
							Preencha os dados para se registrar
						</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className='space-y-4'>
							{error && (
								<Alert variant='error'>
									<p>{error}</p>
								</Alert>
							)}

							<div className='space-y-2'>
								<label htmlFor='name' className='text-sm font-medium'>
									Nome completo
								</label>
								<Input
									id='name'
									placeholder='Seu nome'
									value={name}
									onChange={(e) => setName(e.target.value)}
									required
								/>
							</div>

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
								<p className='text-xs text-gray-500'>Mínimo de 6 caracteres</p>
							</div>

							<div className='space-y-2'>
								<label
									htmlFor='confirmPassword'
									className='text-sm font-medium'
								>
									Confirmar senha
								</label>
								<Input
									id='confirmPassword'
									type='password'
									placeholder='••••••••'
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</div>

							<Button type='submit' className='w-full' loading={loading}>
								Criar conta
							</Button>

							<p className='text-center text-sm text-gray-600'>
								Já tem uma conta?{' '}
								<Link
									href='/login'
									className='text-blue-600 hover:underline font-medium'
								>
									Faça login
								</Link>
							</p>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
