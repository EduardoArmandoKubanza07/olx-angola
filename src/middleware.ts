// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
	const token = request.cookies.get('token')?.value;
	const { pathname } = request.nextUrl;

	// Rotas públicas
	const isPublicPath =
		pathname === '/login' ||
		pathname === '/register' ||
		pathname.startsWith('/products') ||
		pathname === '/';

	// Rotas de admin
	const isAdminPath = pathname.startsWith('/admin');

	if (!token && !isPublicPath) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (token) {
		const payload = verifyToken(token);

		if (isAdminPath && payload?.role !== 'ADMIN') {
			return NextResponse.redirect(new URL('/', request.url));
		}

		if (isPublicPath && (pathname === '/login' || pathname === '/register')) {
			return NextResponse.redirect(new URL('/', request.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		'/',
		'/login',
		'/register',
		'/products/:path*',
		'/cart/:path*',
		'/checkout/:path*',
		'/profile/:path*',
		'/admin/:path*',
	],
};
