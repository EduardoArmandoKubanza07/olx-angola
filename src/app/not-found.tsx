// src/app/not-found.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4'>
			<div className='text-center'>
				{/* Ilustração SVG */}
				<svg
					className='w-64 h-64 mx-auto mb-8'
					viewBox='0 0 400 400'
					fill='none'
					xmlns='http://www.w3.org/2000/svg'
				>
					<circle cx='200' cy='200' r='150' fill='#E0E7FF' />
					<text
						x='200'
						y='180'
						textAnchor='middle'
						fontSize='80'
						fontWeight='bold'
						fill='#3B82F6'
					>
						404
					</text>
					<text
						x='200'
						y='240'
						textAnchor='middle'
						fontSize='24'
						fill='#1E3A8A'
					>
						Página não encontrada
					</text>
					<path
						d='M120 280 L280 280'
						stroke='#2563EB'
						strokeWidth='4'
						strokeDasharray='10 10'
					/>
					<circle cx='160' cy='310' r='10' fill='#F59E0B' />
					<circle cx='240' cy='310' r='10' fill='#F59E0B' />
				</svg>

				<h1 className='text-4xl font-bold text-gray-900 mb-4'>
					Ops! Página não encontrada
				</h1>
				<p className='text-lg text-gray-600 mb-8 max-w-md mx-auto'>
					A página que você está procurando pode ter sido removida ou está
					temporariamente indisponível.
				</p>
				<div className='space-x-4'>
					<Link href='/'>
						<Button size='lg'>Voltar para o início</Button>
					</Link>
					<Link href='/products'>
						<Button variant='outline' size='lg'>
							Ver produtos
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
