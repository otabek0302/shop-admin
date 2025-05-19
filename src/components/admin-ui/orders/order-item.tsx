'use client';

import Image from 'next/image';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OrderItem } from '@/interfaces/orders';
import { getImageUrl } from '@/utils/getImageUrl';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
  updateOrderItem: (index: number, field: keyof OrderItem, value: string | number) => void;
  removeOrderItem: (index: number) => void;
  availableStock: number;
}

export const OrderItemCard = memo(({ item, index, updateOrderItem, removeOrderItem, availableStock }: OrderItemCardProps) => {
  const { t } = useTranslation();

  const isLowStock = availableStock > 0 && availableStock <= 5;
  const remainingStock = availableStock - item.quantity;

  const handleQuantityChange = (value: number) => {
    if (value <= 0) {
      removeOrderItem(index);
    } else if (value <= availableStock) {
      updateOrderItem(index, 'quantity', value);
    }
  };

  const getStockBadgeVariant = () => {
    if (remainingStock <= 0) return 'destructive';
    if (remainingStock <= 5) return 'secondary';
    return 'outline';
  };

  const getStockMessage = () => {
    if (remainingStock <= 0) return t('components.admin-ui.order.order-item.no-stock-left');
    if (remainingStock <= 5) return t('components.admin-ui.order.order-item.low-stock');
    return t('components.admin-ui.order.order-item.in-stock');
  };

  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className="bg-muted relative h-16 w-16 overflow-hidden rounded-lg border">
          <Image src={getImageUrl(item.product.image)} alt={item.product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          {isLowStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-yellow-500/10">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">{item.product.name}</p>
          <p className="text-muted-foreground mt-1 text-sm">₹{item.price.toFixed(2)}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={getStockBadgeVariant()} className="mt-1">
                  {getStockMessage()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{remainingStock <= 0 ? t('messages.error.out-of-stock') : remainingStock <= 5 ? t('messages.error.low-stock') : t('messages.error.in-stock')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.quantity - 1)} className="h-9 w-9 rounded-full" aria-label="Decrease quantity">
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          min="1"
          max={availableStock}
          value={item.quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 1;
            handleQuantityChange(Math.min(value, availableStock));
          }}
          className="h-9 w-16 text-center"
          aria-label="Item quantity"
        />
        <Button size="icon" variant="outline" onClick={() => handleQuantityChange(item.quantity + 1)} className="h-9 w-9 rounded-full" disabled={item.quantity >= availableStock} aria-label="Increase quantity">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-primary mt-3 text-right text-sm font-medium">Total: ₹{item.total.toFixed(2)}</div>
    </Card>
  );
});

OrderItemCard.displayName = 'OrderItemCard';
