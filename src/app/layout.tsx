import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/components/ui/toast';
import { CartProvider } from '@/contexts/CartContext';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'OXL.Angola - A melhor loja de diversos da banda.',
	description: 'Sistema de e-commerce completo',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='pt-BR'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ToastProvider>
					<CartProvider>{children}</CartProvider>
				</ToastProvider>
			</body>
		</html>
	);
}
