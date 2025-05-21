'use client';

import Image from 'next/image';
import Counter from '@/components/ui/counter';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useClientOrderStore } from '@/store/client-order-store';
import { AlertTriangle } from 'lucide-react';
import { getStockStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Product } from '@/interfaces/products';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ProductCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const { getQuantityForProduct, addToBusket } = useClientOrderStore();

  const quantityInCart = getQuantityForProduct(product.id);
  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = product.stock <= 0;

  const onAddToCart = (product: Product) => {
    addToBusket({ ...product, quantity: 1 });
  };

  return (
    <div key={product.id} className="flex flex-col rounded-md border p-4 md:flex-row">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden rounded-md border md:mr-0 md:h-24 md:w-24">
        <Image src={product.image?.url || '/placeholder.svg'} alt={product.name} fill sizes="(max-width: 768px) 100vw, 96px" priority className="object-cover" />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-yellow-500/10">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </div>
        )}
      </div>

      {/* Name, Description, Stock Badge */}
      <div className="mt-2 flex-grow md:mt-0 md:ml-4">
        <h3 className="line-clamp-1 text-base font-medium dark:text-white">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-400">{product.description}</p>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={stockStatus.variant} className="mt-1 cursor-pointer p-2 py-1.5 text-xs outline-none dark:bg-gray-800 dark:text-white">
                {stockStatus.message === 'Out of Stock' ? t('messages.error.out-of-stock') : stockStatus.message.startsWith('Low Stock') ? t('messages.error.low-stock') : t('messages.error.in-stock')}
              </Badge>
            </TooltipTrigger>
            <TooltipContent className="dark:text-white">{stockStatus.message === 'Out of Stock' ? t('messages.error.out-of-stock') : stockStatus.message.startsWith('Low Stock') ? t('messages.error.low-stock') : t('messages.error.in-stock')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Price & Quantity Controls */}
      <div className="mt-4 flex flex-col items-end justify-between md:mt-0">
        <h3 className="text-lg font-semibold">{product.price.toLocaleString()}</h3>

        {quantityInCart > 0 ? (
          <div className="mt-2">
            <Counter productId={product.id} value={quantityInCart} max={product.stock} size="sm" />
          </div>
        ) : (
          <Button variant="outline" size="lg" className="mt-2 dark:bg-gray-800 dark:text-white cursor-pointer" onClick={() => onAddToCart(product)} disabled={isOutOfStock}>
            {t('components.product-card.add-to-cart')}
          </Button>
        )}
      </div>
    </div>
  );
}
