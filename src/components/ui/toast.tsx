// src/components/ui/toast.tsx
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from './alert';
import { X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

interface ToastContextValue {
	toasts: Toast[];
	showToast: (message: string, type: ToastType, duration?: number) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const showToast = useCallback(
		(message: string, type: ToastType, duration = 3000) => {
			const id = Math.random().toString(36).substring(2, 9);
			setToasts((prev) => [...prev, { id, message, type, duration }]);

			if (duration > 0) {
				setTimeout(() => {
					setToasts((prev) => prev.filter((t) => t.id !== id));
				}, duration);
			}
		},
		[],
	);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, showToast, removeToast }}>
			{children}
			<ToastContainer />
		</ToastContext.Provider>
	);
}

function ToastContainer() {
	const context = useContext(ToastContext);
	if (!context) return null;

	return (
		<div className='fixed top-4 right-4 z-50 space-y-2'>
			{context.toasts.map((toast) => (
				<div key={toast.id} className='animate-slide-in'>
					<Alert
						variant={
							toast.type === 'error'
								? 'error'
								: toast.type === 'success'
									? 'success'
									: 'info'
						}
						className='pr-8 relative'
					>
						{toast.message}
						<button
							onClick={() => context.removeToast(toast.id)}
							className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
						>
							<X className='h-4 w-4' />
						</button>
					</Alert>
				</div>
			))}
		</div>
	);
}

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
}
