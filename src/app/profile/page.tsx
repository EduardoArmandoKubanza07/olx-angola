/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AddressList } from '@/components/profile/AddressList';
import { User, MapPin, Lock, Package } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/public/Header';

export default function ProfilePage() {
	const { user, loading: authLoading } = useAuth();
	const { showToast } = useToast();
	const [activeTab, setActiveTab] = useState('dados');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [saving, setSaving] = useState(false);

	// Dados para alterar senha
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [changingPassword, setChangingPassword] = useState(false);

	useEffect(() => {
		if (user) {
			setName(user.name || '');
			setEmail(user.email || '');
		}
	}, [user]);

	if (authLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<LoadingSpinner size='lg' text='Carregando perfil...' />
			</div>
		);
	}

	if (!user) {
		return (
			<>
				<Header />
				<div className='max-w-7xl mx-auto px-4 py-16 text-center'>
					<h2 className='text-2xl font-bold mb-4'>
						Faça login para ver seu perfil
					</h2>
					<Link href='/auth/login'>
						<Button>Entrar</Button>
					</Link>
				</div>
			</>
		);
	}

	const handleUpdateProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		try {
			const res = await fetch('/api/user', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Erro ao atualizar');
			showToast('Dados atualizados com sucesso!', 'success');
		} catch (error: any) {
			showToast(error.message, 'error');
		} finally {
			setSaving(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setChangingPassword(true);
		try {
			const res = await fetch('/api/user/password', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Erro ao alterar senha');
			showToast('Senha alterada com sucesso!', 'success');
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
		} catch (error: any) {
			showToast(error.message, 'error');
		} finally {
			setChangingPassword(false);
		}
	};

	return (
		<>
			<Header />
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-6'>Meu Perfil</h1>

				<div className='grid md:grid-cols-4 gap-6'>
					{/* Sidebar com abas */}
					<Card className='md:col-span-1 h-fit'>
						<CardContent className='p-4'>
							<nav className='space-y-1'>
								<button
									onClick={() => setActiveTab('dados')}
									className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
										activeTab === 'dados'
											? 'bg-blue-50 text-blue-700 font-medium'
											: 'text-gray-700 hover:bg-gray-100'
									}`}
								>
									<User className='h-4 w-4' />
									Dados Pessoais
								</button>
								<button
									onClick={() => setActiveTab('enderecos')}
									className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
										activeTab === 'enderecos'
											? 'bg-blue-50 text-blue-700 font-medium'
											: 'text-gray-700 hover:bg-gray-100'
									}`}
								>
									<MapPin className='h-4 w-4' />
									Endereços
								</button>
								<button
									onClick={() => setActiveTab('seguranca')}
									className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition ${
										activeTab === 'seguranca'
											? 'bg-blue-50 text-blue-700 font-medium'
											: 'text-gray-700 hover:bg-gray-100'
									}`}
								>
									<Lock className='h-4 w-4' />
									Segurança
								</button>
								<Link
									href='/profile/orders'
									className='w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100'
								>
									<Package className='h-4 w-4' />
									Meus Pedidos
								</Link>
							</nav>
						</CardContent>
					</Card>

					{/* Conteúdo da aba */}
					<Card className='md:col-span-3'>
						<CardHeader>
							<CardTitle>
								{activeTab === 'dados' && 'Dados Pessoais'}
								{activeTab === 'enderecos' && 'Meus Endereços'}
								{activeTab === 'seguranca' && 'Alterar Senha'}
							</CardTitle>
						</CardHeader>
						<CardContent>
							{activeTab === 'dados' && (
								<form
									onSubmit={handleUpdateProfile}
									className='space-y-4 max-w-md'
								>
									<div>
										<label
											htmlFor='name'
											className='block text-sm font-medium mb-1'
										>
											Nome
										</label>
										<Input
											id='name'
											value={name}
											onChange={(e) => setName(e.target.value)}
											required
										/>
									</div>
									<div>
										<label
											htmlFor='email'
											className='block text-sm font-medium mb-1'
										>
											Email
										</label>
										<Input
											id='email'
											type='email'
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<Button type='submit' disabled={saving}>
										{saving ? (
											<LoadingSpinner size='sm' />
										) : (
											'Salvar alterações'
										)}
									</Button>
								</form>
							)}

							{activeTab === 'enderecos' && <AddressList />}

							{activeTab === 'seguranca' && (
								<form
									onSubmit={handleChangePassword}
									className='space-y-4 max-w-md'
								>
									<div>
										<label
											htmlFor='currentPassword'
											className='block text-sm font-medium mb-1'
										>
											Senha atual
										</label>
										<Input
											id='currentPassword'
											type='password'
											value={currentPassword}
											onChange={(e) => setCurrentPassword(e.target.value)}
											required
										/>
									</div>
									<div>
										<label
											htmlFor='newPassword'
											className='block text-sm font-medium mb-1'
										>
											Nova senha
										</label>
										<Input
											id='newPassword'
											type='password'
											value={newPassword}
											onChange={(e) => setNewPassword(e.target.value)}
											required
										/>
									</div>
									<div>
										<label
											htmlFor='confirmPassword'
											className='block text-sm font-medium mb-1'
										>
											Confirmar nova senha
										</label>
										<Input
											id='confirmPassword'
											type='password'
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											required
										/>
									</div>
									<Button type='submit' disabled={changingPassword}>
										{changingPassword ? (
											<LoadingSpinner size='sm' />
										) : (
											'Alterar senha'
										)}
									</Button>
								</form>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</>
	);
}
