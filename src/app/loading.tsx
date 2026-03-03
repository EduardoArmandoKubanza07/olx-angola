// src/app/loading.tsx
export default function Loading() {
	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
			<div className='text-center'>
				{/* Spinner animado */}
				<div className='relative mx-auto w-32 h-32 mb-8'>
					{/* Círculo externo */}
					<div className='absolute inset-0 border-4 border-blue-200 rounded-full'></div>
					{/* Círculo interno animado */}
					<div className='absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin'></div>
					{/* Ícone de carrinho */}
					<svg
						className='absolute inset-0 w-16 h-16 m-auto text-blue-600'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<circle cx='9' cy='21' r='1' />
						<circle cx='20' cy='21' r='1' />
						<path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' />
					</svg>
				</div>

				<h2 className='text-2xl font-semibold text-gray-900 mb-2'>
					A carregar...
				</h2>
				<p className='text-gray-600'>Por favor, aguarde um momento.</p>

				{/* Barra de progresso animada */}
				<div className='mt-8 w-64 h-2 bg-blue-100 rounded-full overflow-hidden mx-auto'>
					<div className='h-full bg-blue-600 rounded-full animate-pulse'></div>
				</div>
			</div>
		</div>
	);
}
