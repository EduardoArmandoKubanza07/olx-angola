import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatPriceKz(price: number) {
	return new Intl.NumberFormat('pt-AO', {
		style: 'currency',
		currency: 'AOA',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
}

export function formatPrice(price: number) {
	return new Intl.NumberFormat('pt-AO', {
		// Locale de Angola
		style: 'currency',
		currency: 'AOA', // Código da moeda: Kwanza Angolano
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(price);
}

export function generateSlug(text: string) {
	return text
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\w\s-]/g, '')
		.replace(/\s+/g, '-');
}
