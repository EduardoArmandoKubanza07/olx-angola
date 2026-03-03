'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/toast';

interface CartItem {
	id: string;
	productId: string;
	quantity: number;
	product: {
		id: string;
		name: string;
		price: number;
		images: { url: string }[];
	};
}

interface CartContextData {
	items: CartItem[];
	loading: boolean;
	totalItems: number;
	totalPrice: number;
	addToCart: (productId: string, quantity?: number) => Promise<void>;
	updateQuantity: (itemId: string, quantity: number) => Promise<void>;
	removeFromCart: (itemId: string) => Promise<void>;
	clearCart: () => Promise<void>;
	refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: React.ReactNode }) {
	const { user } = useAuth();
	const { showToast } = useToast();
	const [items, setItems] = useState<CartItem[]>([]);
	const [loading, setLoading] = useState(false);

	const refreshCart = async () => {
		if (!user) {
			setItems([]);
			return;
		}
		setLoading(true);
		try {
			const res = await fetch('/api/cart');
			if (res.ok) {
				const data = await res.json();
				setItems(data.items || []);
			}
		} catch (error) {
			console.error('Erro ao carregar carrinho:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		refreshCart();
	}, [user]);

	const addToCart = async (productId: string, quantity = 1) => {
		if (!user) {
			showToast('Faça login para adicionar ao carrinho', 'warning');
			return;
		}
		try {
			const res = await fetch('/api/cart', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ productId, quantity }),
			});
			if (!res.ok) throw new Error('Erro ao adicionar');
			await refreshCart();
			showToast('Produto adicionado ao carrinho!', 'success');
		} catch (error) {
			showToast('Erro ao adicionar produto', 'error');
		}
	};

	const updateQuantity = async (itemId: string, quantity: number) => {
		try {
			const res = await fetch(`/api/cart/${itemId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ quantity }),
			});
			if (!res.ok) throw new Error('Erro ao atualizar');
			await refreshCart();
		} catch (error) {
			showToast('Erro ao atualizar quantidade', 'error');
		}
	};

	const removeFromCart = async (itemId: string) => {
		try {
			const res = await fetch(`/api/cart/${itemId}`, {
				method: 'DELETE',
			});
			if (!res.ok) throw new Error('Erro ao remover');
			await refreshCart();
			showToast('Item removido do carrinho', 'success');
		} catch (error) {
			showToast('Erro ao remover item', 'error');
		}
	};

	const clearCart = async () => {
		try {
			const res = await fetch('/api/cart', { method: 'DELETE' });
			if (!res.ok) throw new Error('Erro ao limpar');
			await refreshCart();
		} catch (error) {
			showToast('Erro ao limpar carrinho', 'error');
		}
	};

	const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
	const totalPrice = items.reduce(
		(acc, item) => acc + item.product.price * item.quantity,
		0,
	);

	return (
		<CartContext.Provider
			value={{
				items,
				loading,
				totalItems,
				totalPrice,
				addToCart,
				updateQuantity,
				removeFromCart,
				clearCart,
				refreshCart,
			}}
		>
			{children}
		</CartContext.Provider>
	);
}
