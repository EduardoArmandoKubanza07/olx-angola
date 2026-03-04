import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
	try {
		// Verificar autenticação (qualquer usuário logado pode fazer upload)
		const user = await getCurrentUser();
		if (!user) {
			return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
		}

		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return NextResponse.json(
				{ error: 'Nenhum arquivo enviado' },
				{ status: 400 },
			);
		}

		// Validar tipo de arquivo (imagens ou PDF)
		const allowedTypes = [
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp',
			'application/pdf',
		];
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{
					error:
						'Tipo de arquivo não permitido. Apenas imagens e PDF são aceitos.',
				},
				{ status: 400 },
			);
		}

		// Validar tamanho (máx 5MB)
		if (file.size > 5 * 1024 * 1024) {
			return NextResponse.json(
				{ error: 'Arquivo muito grande (máx 5MB)' },
				{ status: 400 },
			);
		}

		// Gerar nome único para o arquivo
		const timestamp = Date.now();
		const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
		const fileName = `${user.id}-${timestamp}-${originalName}`;

		// Diretório específico para comprovantes
		const uploadDir = path.join(process.cwd(), 'public/uploads/proofs');
		const filePath = path.join(uploadDir, fileName);

		// Garantir que a pasta existe
		await mkdir(uploadDir, { recursive: true });

		// Salvar o arquivo
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		await writeFile(filePath, buffer);

		// Retornar o caminho público
		const publicUrl = `/uploads/proofs/${fileName}`;
		return NextResponse.json({ url: publicUrl });
	} catch (error) {
		console.error('Erro no upload:', error);
		return NextResponse.json(
			{ error: 'Erro interno no servidor' },
			{ status: 500 },
		);
	}
}
