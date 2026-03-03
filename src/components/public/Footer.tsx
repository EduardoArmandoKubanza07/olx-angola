import Link from 'next/link';
import {
	Facebook,
	Instagram,
	Twitter,
	Mail,
	Phone,
	MapPin,
} from 'lucide-react';

export function Footer() {
	return (
		<footer className='bg-gray-900 text-gray-300'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
					{/* Sobre */}
					<div>
						<h3 className='text-white text-lg font-bold mb-4'>Loja Diversos</h3>
						<p className='text-sm leading-relaxed'>
							A sua loja online de confiança em Angola. Oferecemos uma vasta
							gama de produtos com qualidade e os melhores preços.
						</p>
						<div className='flex space-x-4 mt-4'>
							<a href='#' className='text-gray-400 hover:text-white transition'>
								<Facebook className='h-5 w-5' />
							</a>
							<a href='#' className='text-gray-400 hover:text-white transition'>
								<Instagram className='h-5 w-5' />
							</a>
							<a href='#' className='text-gray-400 hover:text-white transition'>
								<Twitter className='h-5 w-5' />
							</a>
						</div>
					</div>

					{/* Links Rápidos */}
					<div>
						<h4 className='text-white font-semibold mb-4'>Links Rápidos</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link href='/products' className='hover:text-white transition'>
									Produtos
								</Link>
							</li>
							<li>
								<Link
									href='/categories'
									className='hover:text-white transition'
								>
									Categorias
								</Link>
							</li>
							<li>
								<Link href='/about' className='hover:text-white transition'>
									Sobre Nós
								</Link>
							</li>
							<li>
								<Link href='/contact' className='hover:text-white transition'>
									Contacto
								</Link>
							</li>
							<li>
								<Link href='/faq' className='hover:text-white transition'>
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* Suporte */}
					<div>
						<h4 className='text-white font-semibold mb-4'>Suporte</h4>
						<ul className='space-y-2 text-sm'>
							<li>
								<Link href='/terms' className='hover:text-white transition'>
									Termos de Uso
								</Link>
							</li>
							<li>
								<Link href='/privacy' className='hover:text-white transition'>
									Política de Privacidade
								</Link>
							</li>
							<li>
								<Link href='/returns' className='hover:text-white transition'>
									Trocas e Devoluções
								</Link>
							</li>
							<li>
								<Link href='/shipping' className='hover:text-white transition'>
									Envio e Entrega
								</Link>
							</li>
						</ul>
					</div>

					{/* Contacto */}
					<div>
						<h4 className='text-white font-semibold mb-4'>Contacto</h4>
						<ul className='space-y-3 text-sm'>
							<li className='flex items-start gap-3'>
								<MapPin className='h-5 w-5 text-gray-400 flex-shrink-0' />
								<span>Luanda, Angola</span>
							</li>
							<li className='flex items-center gap-3'>
								<Phone className='h-5 w-5 text-gray-400 flex-shrink-0' />
								<span>+244 999 999 999</span>
							</li>
							<li className='flex items-center gap-3'>
								<Mail className='h-5 w-5 text-gray-400 flex-shrink-0' />
								<span>suporte@lojadiversos.co.ao</span>
							</li>
						</ul>
					</div>
				</div>

				<div className='border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500'>
					<p>
						&copy; {new Date().getFullYear()} Loja Diversos. Todos os direitos
						reservados.
					</p>
					<p className='mt-2 md:mt-0'>Feito com ❤️ em Angola</p>
				</div>
			</div>
		</footer>
	);
}
