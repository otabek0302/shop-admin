'use client';

import Image from 'next/image';

import { Card } from '@/components/ui/card';
import { getImageUrl } from '@/utils/getImageUrl';
import { Button } from '@/components/ui/button';
import { Plus, AlertTriangle } from 'lucide-react';
import { Product } from '@/interfaces/products';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';

export const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  const { t } = useTranslation();
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  const getStockBadgeVariant = () => {
    if (isOutOfStock) return 'destructive';
    if (isLowStock) return 'secondary';
    return 'outline';
  };

  const getStockMessage = () => {
    if (isOutOfStock) return t('components.admin-ui.order.order-product-card.out-of-stock');
    if (isLowStock) return t('components.admin-ui.order.order-product-card.low-stock');
    return t('components.admin-ui.order.order-product-card.in-stock');
  };

  return (
    <Card className={`hover:border-primary/20 p-4 transition-all duration-200 hover:shadow-md active:scale-[0.98] ${isOutOfStock ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`} onClick={!isOutOfStock ? onClick : undefined}>
      <div className="flex items-center gap-4">
        <div className="bg-muted relative h-16 w-16 overflow-hidden rounded-lg border">
          <Image src={getImageUrl(product.image)} alt={product.name} fill className="object-cover" />
          {isLowStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-yellow-500/10">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold">{product.name}</p>
          <p className="text-muted-foreground mt-1 text-sm">₹{product.price.toFixed(2).toLocaleString()}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={getStockBadgeVariant()} className="mt-1">
                  {getStockMessage()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{isLowStock ? t('components.admin-ui.order.order-product-card.low-stock') : isOutOfStock ? t('components.admin-ui.order.order-product-card.out-of-stock') : t('components.admin-ui.order.order-product-card.in-stock')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button size="icon" variant="ghost" className={`group hover:bg-primary/20 cursor-pointer rounded-full ${isOutOfStock ? 'cursor-not-allowed opacity-50' : ''}`} disabled={isOutOfStock}>
          <Plus className="group-hover:text-primary h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};
