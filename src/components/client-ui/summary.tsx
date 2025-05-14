'use client';

import Image from 'next/image';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, X, IndianRupee, AlertTriangle } from 'lucide-react';
import { Product } from '@/interfaces/products';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CheckoutSummaryProps {
  cartItems: { product: Product; quantity: number }[];
  subtotal: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onCreateOrder: () => Promise<void>;
}

const Summary = ({ cartItems, subtotal, onUpdateQuantity, onCreateOrder }: CheckoutSummaryProps) => {
  const [discountAmount, setDiscountAmount] = useState('');
  const [discount, setDiscount] = useState(0);

  const shipping = 0; // Free shipping
  const total = subtotal + shipping - discount;

  const handleApplyDiscount = () => {
    const amount = parseFloat(discountAmount);
    if (!isNaN(amount) && amount > 0) {
      // Ensure discount doesn't exceed subtotal
      setDiscount(Math.min(amount, subtotal));
    } else {
      setDiscount(0);
    }
  };

  const getStockStatus = (stock: number, quantity: number) => {
    const remainingStock = stock - quantity;
    if (remainingStock <= 0) return { message: 'No Stock Left', variant: 'destructive' as const };
    if (remainingStock <= 5) return { message: `Low Stock: ${remainingStock}`, variant: 'secondary' as const };
    return { message: `In Stock: ${remainingStock}`, variant: 'outline' as const };
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Review Order</h2>

      {cartItems.length === 0 ? (
        <p className="my-8 text-center text-gray-500">Your cart is empty</p>
      ) : (
        <>
          <div className="mb-6 space-y-4">
            {cartItems.map(({ product, quantity }) => {
              const stockStatus = getStockStatus(product.stock, quantity);
              const isLowStock = product.stock - quantity <= 5;

              return (
                <div key={product.id} className="flex items-center border-b py-2">
                  <div className="relative mr-3 flex-shrink-0">
                    <Image src={product.image.url || '/placeholder.svg'} alt={product.name} width={50} height={50} className="rounded-md" />
                    {isLowStock && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-md bg-yellow-500/10">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-grow">
                    <h4 className="text-sm font-medium">{product.name}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant={stockStatus.variant} className="mt-1">
                            {stockStatus.message}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>{stockStatus.message === 'No Stock Left' ? 'No more stock available for this product' : stockStatus.message.includes('Low Stock') ? 'Running low on stock. Consider ordering soon!' : 'Product is available in stock'}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div className="mt-1 flex items-center">
                      <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => onUpdateQuantity(product.id, quantity - 1)}>
                        <Minus className="h-3 w-3" />
                        <span className="sr-only">Decrease</span>
                      </Button>

                      <span className="mx-2 text-sm">{quantity}</span>

                      <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => onUpdateQuantity(product.id, quantity + 1)} disabled={quantity >= product.stock}>
                        <Plus className="h-3 w-3" />
                        <span className="sr-only">Increase</span>
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 font-medium">
                      <IndianRupee className="h-4 w-4" />
                      {(product.price * quantity).toLocaleString()}
                    </div>
                    <Button variant="ghost" size="icon" className="mt-1 h-6 w-6 p-0" onClick={() => onUpdateQuantity(product.id, 0)}>
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mb-6">
            <Label htmlFor="discount-amount">Discount Amount (₹)</Label>
            <div className="mt-1 flex">
              <Input id="discount-amount" type="number" min="0" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} placeholder="Enter amount" className="rounded-r-none" />
              <Button className="rounded-l-none" onClick={handleApplyDiscount}>
                Apply
              </Button>
            </div>
            {discount > 0 && (
              <p className="mt-1 flex items-center gap-1 text-sm text-green-600">
                <IndianRupee className="h-3 w-3" />
                Discount applied: -{discount.toLocaleString()}
              </p>
            )}
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                {subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>
                {shipping === 0 ? (
                  'Free'
                ) : (
                  <span className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {Number(shipping).toLocaleString()}
                  </span>
                )}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />-{discount.toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span className="flex items-center gap-1">
                <IndianRupee className="h-5 w-5" />
                {total.toLocaleString()}
              </span>
            </div>
          </div>

          <Button className="mt-6 w-full" size="lg" onClick={onCreateOrder} disabled={cartItems.length === 0}>
            Create Order
          </Button>
        </>
      )}
    </div>
  );
};

export default Summary;
