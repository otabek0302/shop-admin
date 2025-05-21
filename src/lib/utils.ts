import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const getStockStatus = (stock: number) => {
  if (stock <= 0) return { message: 'Out of Stock', variant: 'destructive' as const };
  if (stock <= 5) return { message: `Low Stock: ${stock}`, variant: 'secondary' as const };
  return { message: `In Stock: ${stock}`, variant: 'outline' as const };
};