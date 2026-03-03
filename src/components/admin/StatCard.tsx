// src/components/admin/StatCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
	title: string;
	value: string;
	icon: LucideIcon;
	change: string;
	trend: 'up' | 'down';
}

export function StatCard({
	title,
	value,
	icon: Icon,
	change,
	trend,
}: StatCardProps) {
	return (
		<Card className='hover:shadow-md transition-shadow'>
			<CardHeader className='flex flex-row items-center justify-between pb-2'>
				<CardTitle className='text-sm font-medium text-gray-600'>
					{title}
				</CardTitle>
				<Icon className='h-4 w-4 text-gray-400' />
			</CardHeader>
			<CardContent>
				<div className='text-2xl font-bold'>{value}</div>
				<p
					className={`text-xs flex items-center mt-1 ${
						trend === 'up' ? 'text-green-600' : 'text-red-600'
					}`}
				>
					{trend === 'up' ? (
						<TrendingUp className='h-3 w-3 mr-1' />
					) : (
						<TrendingDown className='h-3 w-3 mr-1' />
					)}
					{change}
				</p>
			</CardContent>
		</Card>
	);
}
