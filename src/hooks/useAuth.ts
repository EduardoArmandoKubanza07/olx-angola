'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
	id: string;
	email: string;
	name: string;
	role: string;
}

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		checkAuth();
	}, []);

	async function checkAuth() {
		try {
			const res = await fetch('/api/auth/me');
			if (res.ok) {
				const data = await res.json();
				setUser(data.user);
			}
		} catch (error) {
			console.error('Erro ao verificar autenticação:', error);
		} finally {
			setLoading(false);
		}
	}

	async function login(email: string, password: string) {
		const res = await fetch('/api/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password }),
		});

		const data = await res.json();

		if (!res.ok) {
			throw new Error(data.error);
		}

		setUser(data.user);

		if (data?.user?.role === 'ADMIN') {
			router.push('/admin');
		} else {
			router.push('/');
		}
		return data;
	}

	async function register(name: string, email: string, password: string) {
		const res = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, email, password }),
		});

		const data = await res.json();

		if (!res.ok) {
			throw new Error(data.error);
		}

		setUser(data.user);
		router.push('/');
		return data;
	}

	async function logout() {
		await fetch('/api/auth/logout', { method: 'POST' });
		setUser(null);
		router.push('/login');
	}

	return {
		user,
		loading,
		login,
		register,
		logout,
	};
}
