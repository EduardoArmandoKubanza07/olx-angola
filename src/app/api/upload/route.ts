// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';

// Força o uso do runtime Node.js (necessário para manipulação de arquivos)
export const runtime = 'nodejs';

export async function POST(request: Request) {
	try {
		// Verificar autenticação (apenas admin pode fazer upload)
		const user = await getCurrentUser();
		if (!user || user.role !== 'ADMIN') {
			return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json(
				{ error: 'Nenhum arquivo enviado' },
				{ status: 400 },
			);
		}

		// Validar tipo de arquivo (apenas imagens)
		if (!file.type.startsWith('image/')) {
			return NextResponse.json(
				{ error: 'Apenas imagens são permitidas' },
				{ status: 400 },
			);
		}

		// Validar tamanho (máx 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json(
				{ error: 'Imagem muito grande (máx 5MB)' },
				{ status: 400 },
			);
		}

		// Gerar nome único para o arquivo
		const timestamp = Date.now();
		const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_'); // Remove caracteres especiais
		const fileName = `${timestamp}-${originalName}`;
		const uploadDir = path.join(process.cwd(), 'public/uploads');
		const filePath = path.join(uploadDir, fileName);

		// Garantir que a pasta existe
		await mkdir(uploadDir, { recursive: true });

		// Salvar o arquivo
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		await writeFile(filePath, buffer);

		// Retornar o caminho público
		const publicUrl = `/uploads/${fileName}`;
		return NextResponse.json({ url: publicUrl });
	} catch (error) {
		console.error('Erro no upload:', error);
		return NextResponse.json(
			{ error: 'Erro interno no servidor' },
			{ status: 500 },
		);
	}
}
