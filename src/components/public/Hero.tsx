'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion'; // Opcional, mas vamos instalar para efeitos
import { ShoppingBag, ArrowRight } from 'lucide-react';

export function Hero() {
	return (
		<section className='relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden'>
			{/* Fundo animado */}
			<div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
			<div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>

			{/* Bolhas decorativas */}
			<div className='absolute top-20 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl'></div>
			<div className='absolute bottom-10 right-10 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl'></div>

			<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32'>
				<div className='grid lg:grid-cols-2 gap-12 items-center'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
							Descubra o melhor da{' '}
							<span className='text-yellow-300'>OXL.Angola</span>
						</h1>
						<p className='text-lg md:text-xl mt-4 text-blue-100 max-w-lg'>
							Tecnologia, moda, livros e muito mais com entrega rápida em todo
							Angola. Compre com confiança e segurança.
						</p>
						<div className='flex flex-wrap gap-4 mt-8'>
							<Link href='/products'>
								<Button
									size='lg'
									className='bg-white text-blue-600 hover:bg-gray-100 shadow-lg'
								>
									<ShoppingBag className='mr-2 h-5 w-5' />
									Começar a Comprar
								</Button>
							</Link>
							<Link href='/categories'>
								<Button
									size='lg'
									variant='outline'
									className='border-white text-white hover:bg-white/20'
								>
									Ver Categorias
									<ArrowRight className='ml-2 h-5 w-5' />
								</Button>
							</Link>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className='hidden lg:block'
					>
						<div className='relative'>
							<div className='absolute inset-0 bg-white/20 rounded-full blur-3xl'></div>
							<div className='relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20'>
								<div className='grid grid-cols-2 gap-4'>
									{[1, 2, 3, 4].map((i) => (
										<div
											key={i}
											className='bg-white/10 rounded-lg p-4 flex flex-col items-center'
										>
											<div className='w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mb-2'>
												<ShoppingBag className='h-6 w-6 text-yellow-300' />
											</div>
											<p className='text-sm font-medium'>Produto {i}</p>
											<p className='text-xs text-blue-200'>15.000 Kz</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
