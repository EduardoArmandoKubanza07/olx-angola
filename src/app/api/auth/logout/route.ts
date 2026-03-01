// src/app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
	(await cookies()).delete('token');

	return NextResponse.json({
		message: 'Logout realizado com sucesso',
	});
}
