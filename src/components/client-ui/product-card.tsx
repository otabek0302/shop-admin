'use client';

import Image from 'next/image';
import { AlertTriangle } from 'lucide-react';

import { Product } from '@/interfaces/products';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useClientOrderStore } from '@/store/client-order-store';
import { getStockStatus } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Counter from '@/components/ui/counter';

export function ProductCard({ product }: { product: Product }) {
  const { getQuantityForProduct, addToBusket } = useClientOrderStore();

  const quantityInCart = getQuantityForProduct(product.id);
  const stockStatus = getStockStatus(product.stock);
  const isOutOfStock = product.stock <= 0;

  const onAddToCart = (product: Product) => {
    addToBusket({ ...product, quantity: 1 });
  };

  return (
    <div key={product.id} className="flex rounded-md border p-4">
      {/* Image */}
      <div className="relative mr-4 h-20 w-20 overflow-hidden rounded-md border">
        <Image src={product.image?.url || '/placeholder.svg'} alt={product.name} fill className="object-cover" />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-yellow-500/10">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
          </div>
        )}
      </div>

      {/* Name, Description, Stock Badge */}
      <div className="flex-grow">
        <h3 className="line-clamp-1 text-base font-medium">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-gray-600">{product.description}</p>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant={stockStatus.variant} className="mt-1 cursor-pointer p-2 py-1.5 text-xs outline-none">
                {stockStatus.message}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{stockStatus.message === 'Out of Stock' ? 'This product is currently out of stock' : stockStatus.message.startsWith('Low Stock') ? 'This product is running low on stock. Order soon!' : 'Product is available in stock'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Price & Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        <h3 className="text-lg font-semibold">{product.price.toLocaleString()}</h3>

        {quantityInCart > 0 ? (
          <div className="mt-2">
            <Counter 
              productId={product.id}
              value={quantityInCart}
              max={product.stock}
              size="sm"
            />
          </div>
        ) : (
          <Button variant="outline" size="sm" className="mt-2" onClick={() => onAddToCart(product)} disabled={isOutOfStock}>
            Add
          </Button>
        )}
      </div>
    </div>
  );
}
