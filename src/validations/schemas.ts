// src/validations/schemas.ts
import { z } from 'zod';

// Validação de usuário
export const userSchema = z.object({
	email: z.string().email('Email inválido'),
	password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
	name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
});

export const loginSchema = userSchema.omit({ name: true });

// Validação de produto
export const productSchema = z.object({
	name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
	price: z.number().positive('Preço deve ser positivo'),
	stock: z.number().int().min(0, 'Estoque não pode ser negativo'),
	categoryId: z.string().min(1, 'Categoria é obrigatória'),
	images: z
		.array(z.string().min(1, 'Caminho da imagem é obrigatório'))
		.optional()
		.default([]),
});
// Validação de categoria
export const categorySchema = z.object({
	name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
	description: z.string().optional(),
});

// Validação de endereço
export const addressSchema = z.object({
	street: z.string().min(3, 'Rua é obrigatória'),
	number: z.string().min(1, 'Número é obrigatório'),
	complement: z.string().optional(),
	neighborhood: z.string().min(3, 'Bairro é obrigatório'),
	city: z.string().min(3, 'Cidade é obrigatória'),
	state: z.string().length(2, 'UF deve ter 2 caracteres'),
	zipCode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
	isDefault: z.boolean().default(false),
});

// Validação de item do carrinho
export const cartItemSchema = z.object({
	productId: z.string(),
	quantity: z.number().int().min(1, 'Quantidade mínima é 1'),
});

// Tipos inferidos
export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;
