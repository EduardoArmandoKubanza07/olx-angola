// src/components/forms/category-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { categorySchema, type CategoryInput } from '@/validations/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';

interface CategoryFormProps {
	initialData?: CategoryInput & { id?: string };
	onSubmit: (data: CategoryInput) => Promise<void>;
	isSubmitting?: boolean;
}

export function CategoryForm({
	initialData,
	onSubmit,
	isSubmitting,
}: CategoryFormProps) {
	const form = useForm<CategoryInput>({
		resolver: zodResolver(categorySchema),
		defaultValues: initialData || {
			name: '',
			description: '',
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<FormField
					control={form.control}
					name='name'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nome</FormLabel>
							<FormControl>
								<Input placeholder='Eletrônicos' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Descrição (opcional)</FormLabel>
							<FormControl>
								<Input
									placeholder='Descrição da categoria'
									{...field}
									value={field.value || ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit' loading={isSubmitting}>
					{initialData ? 'Atualizar' : 'Criar'}
				</Button>
			</form>
		</Form>
	);
}
