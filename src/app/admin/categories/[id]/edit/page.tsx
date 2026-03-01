// src/app/admin/categories/[id]/edit/page.tsx
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditCategoryForm from './edit-form';

export default async function EditCategoryPage({
	params,
}: {
	params: { id: string };
}) {
	const category = await prisma.category.findUnique({
		where: { id: params.id },
	});

	if (!category) {
		notFound();
	}

	return <EditCategoryForm category={category} />;
}
