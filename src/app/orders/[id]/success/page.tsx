'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/public/Header';

export default function OrderSuccessPage() {
	const { id } = useParams();

	return (
		<>
			<Header />
			<div className='max-w-2xl mx-auto px-4 py-16 text-center'>
				<CheckCircle className='h-16 w-16 text-green-600 mx-auto mb-4' />
				<h1 className='text-3xl font-bold text-gray-900 mb-2'>
					Pedido realizado!
				</h1>
				<p className='text-gray-600 mb-4'>
					Seu pedido{' '}
					<span className='font-mono bg-gray-100 px-2 py-1 rounded'>#{id}</span>{' '}
					foi criado.
				</p>
				<p className='text-gray-600 mb-8'>
					Aguarde a confirmação do pagamento. Você receberá um email assim que
					for aprovado.
				</p>
				<div className='space-x-4'>
					<Link href='/'>
						<Button>Voltar à loja</Button>
					</Link>
					<Link href='/profile/orders'>
						<Button variant='outline'>Meus Pedidos</Button>
					</Link>
				</div>
			</div>
		</>
	);
}
