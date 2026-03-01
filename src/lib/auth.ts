import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function hashPassword(password: string) {
	return bcrypt.hash(password, 10);
}

export async function comparePasswords(password: string, hash: string) {
	return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, role: string) {
	return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
	try {
		return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
	} catch {
		return null;
	}
}

export async function getCurrentUser() {
	const cookieStore = cookies();
	const token = (await cookieStore).get('token')?.value;

	if (!token) return null;

	const payload = verifyToken(token);
	if (!payload) return null;

	const user = await prisma.user.findUnique({
		where: { id: payload.userId },
		select: { id: true, email: true, name: true, role: true },
	});

	return user;
}
