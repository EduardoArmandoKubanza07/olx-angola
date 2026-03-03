// src/app/page.tsx
import { Hero } from '@/components/public/Hero';
import { CategoryCarousel } from '@/components/public/CategoryCarousel';
import { FeaturedProducts } from '@/components/public/FeaturedProducts';
import { Footer } from '@/components/public/Footer';
import { Header } from '@/components/public/Header';

export default function Home() {
	return (
		<main>
			<Header />
			<Hero />
			<CategoryCarousel />
			<FeaturedProducts />
			<Footer />
		</main>
	);
}
