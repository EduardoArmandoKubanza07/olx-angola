// src/components/ui/use-toast.ts
'use client';

import { useState, useCallback } from 'react';

type ToastProps = {
	title?: string;
	description?: string;
	variant?: 'default' | 'success' | 'error' | 'warning';
	duration?: number;
};

type Toast = ToastProps & {
	id: string;
	open: boolean;
};

export function useToast() {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const toast = useCallback(({ duration = 3000, ...props }: ToastProps) => {
		const id = Math.random().toString(36).substr(2, 9);

		setToasts((prev) => [...prev, { id, open: true, ...props }]);

		setTimeout(() => {
			setToasts((prev) =>
				prev.map((t) => (t.id === id ? { ...t, open: false } : t)),
			);

			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, 200);
		}, duration);

		return id;
	}, []);

	return { toast, toasts };
}
