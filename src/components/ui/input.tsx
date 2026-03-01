// src/components/ui/input.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, error, ...props }, ref) => {
		return (
			<div className='space-y-1'>
				<input
					type={type}
					className={cn(
						'flex h-10 w-full rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-sm text-[#171717] ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9ca3af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
						error && 'border-[#ef4444] dark:border-[#ef4444]',
						className,
					)}
					ref={ref}
					{...props}
				/>
				{error && <p className='text-sm text-[#ef4444]'>{error}</p>}
			</div>
		);
	},
);
Input.displayName = 'Input';

export { Input };
