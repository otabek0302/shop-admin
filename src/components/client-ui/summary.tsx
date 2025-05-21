'use client';

import Image from 'next/image';
import Counter from '@/components/ui/counter';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { useClientOrderStore } from '@/store/client-order-store';
import { getStockStatus } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const Summary = () => {
  const { busket, discount, applyDiscount, getSubtotal, getTotal, createOrder } = useClientOrderStore();
  const { t } = useTranslation();

  const [discountAmount, setDiscountAmount] = useState('');
  const subtotal = getSubtotal();
  const total = getTotal();

  const handleApplyDiscount = () => {
    const amount = parseFloat(discountAmount);
    applyDiscount(amount);
  };

  const cartItems = busket.products;

  const handleCreateOrder = async () => {
    await createOrder({
      items: cartItems.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
      status: 'PENDING',
      discount: discount
    });
  };

  return (
    <div className="rounded-lg border p-6 bg-background">
      <h2 className="mb-4 text-xl font-semibold">{t('components.summary.title')}</h2>

      {cartItems.length === 0 ? (
        <p className="my-8 text-center text-gray-500">{t('components.summary.empty-cart')}</p>
      ) : (
        <>
          <div className="no-scrollbar mb-6 h-[330px] space-y-4 overflow-y-auto border-y">
            {cartItems.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              const isLowStock = product.stock - product.quantity <= 5;

              return (
                <div key={product.id} className="flex border-b py-2">
                  {/* Product image */}
                  <div className="relative mr-3 h-24 min-[420px]:h-32 w-32 rounded-md border md:rounded-lg">
                    <Image src={product.image?.url || '/placeholder.svg'} alt={product.name} fill className="rounded-md" />
                    {isLowStock && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-yellow-500/10">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      </div>
                    )}
                  </div>

                  {/* Product name + stock */}
                  <div className="flex flex-grow flex-col justify-center">
                    <div>
                      <h4 className="text-sm font-medium">{product.name}</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant={stockStatus.variant} className="mt-1 cursor-pointer p-2 py-1.5 text-xs outline-none dark:bg-gray-800 dark:text-white">
                              {stockStatus.message}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="dark:text-white">{stockStatus.message === 'Out of Stock' ? 'No more stock available for this product' : stockStatus.message.includes('Low Stock') ? 'Running low on stock. Consider ordering soon!' : 'Product is available in stock'}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    {/* Quantity controls */}
                    <div className="mt-2">
                      <Counter productId={product.id} value={product.quantity} max={product.stock} size="sm" />
                    </div>
                  </div>

                  {/* Total per item and remove button */}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 font-medium">{(product.price * product.quantity).toLocaleString()}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Discount input */}
          <div className="mb-6 space-y-2">
            <Label htmlFor="discount-amount">{t('components.summary.discount-amount')}</Label>
            <div className="mt-1 flex">
              <Input id="discount-amount" type="text" min="0" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} placeholder={t('components.summary.discount-amount')} className="rounded-r-none focus-visible:ring-0 border-none outline-none" />
              <Button className="rounded-l-none dark:bg-gray-800 dark:text-white cursor-pointer" onClick={handleApplyDiscount}>
                {t('components.summary.apply-discount')}
              </Button>
            </div>
            {discount > 0 && <p className="mt-1 flex items-center gap-1 text-sm text-green-600">{t('components.summary.discount-applied', { discount: discount.toLocaleString() })}</p>}
          </div>

          {/* Summary pricing */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t('components.summary.subtotal')}</span>
              <span className="flex items-center gap-1">{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t('components.summary.discount')}</span>
                <span className="flex items-center gap-1">{discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>{t('components.summary.total')}</span>
              <span className="flex items-center gap-1">{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Order button */}
          <Button className="mt-6 w-full dark:bg-gray-800 dark:text-white cursor-pointer" size="lg" onClick={handleCreateOrder} disabled={cartItems.length === 0}>
            {t('components.summary.create-order')}
          </Button>
        </>
      )}
    </div>
  );
};

export default Summary;
