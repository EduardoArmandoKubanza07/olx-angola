// src/app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { ReactNode } from 'react';

export default async function AdminLayout({
	children,
}: {
	children: ReactNode;
}) {
	const user = await getCurrentUser();

	console.log(user);

	if (!user || user.role !== 'ADMIN') {
		redirect('/login');
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			<nav className='bg-white shadow-sm'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between h-16'>
						<div className='flex items-center'>
							<h1 className='text-xl font-bold text-gray-900'>Painel Admin</h1>
						</div>
					</div>
				</div>
			</nav>

			<main className='py-10'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>{children}</div>
			</main>
		</div>
	);
}
