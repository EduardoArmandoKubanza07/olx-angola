// src/app/page.tsx
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Home() {
	return (
		<main className='min-h-screen p-8'>
			<h1 className='text-3xl font-bold mb-8'>E-commerce Diversos</h1>

			<div className='grid gap-6 max-w-md'>
				<Card>
					<CardHeader>
						<CardTitle>Teste de Componentes</CardTitle>
						<CardDescription>
							Verifica se os componentes estão funcionando
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-4'>
						<Input placeholder='Email' type='email' />
						<Input placeholder='Senha' type='password' />

						<div className='flex gap-2'>
							<Button>Entrar</Button>
							<Button variant='secondary'>Registrar</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
