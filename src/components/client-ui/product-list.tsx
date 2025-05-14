'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Plus, Minus, AlertTriangle } from 'lucide-react';
import { Product } from '@/interfaces/products';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { IndianRupee } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  cartItems: { product: Product; quantity: number }[];
  onAddToCart: (product: Product) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export default function ProductList({ products, cartItems, onAddToCart, onUpdateQuantity }: ProductListProps) {
  const getQuantityInCart = (productId: string) => {
    const item = cartItems.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { message: "Out of Stock", variant: "destructive" as const };
    if (stock <= 5) return { message: `Low Stock: ${stock}`, variant: "secondary" as const };
    return { message: `In Stock: ${stock}`, variant: "outline" as const };
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Products</h2>

      <div className="space-y-6">
        {products.map((product) => {
          const quantityInCart = getQuantityInCart(product.id);
          const stockStatus = getStockStatus(product.stock);
          const isOutOfStock = product.stock <= 0;
          const isLowStock = product.stock > 0 && product.stock <= 5;

          return (
            <div key={product.id} className="flex border-b pb-4">
              <div className="mr-4 flex-shrink-0 relative">
                <Image
                  src={product.image.url || '/placeholder.svg'}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="rounded-md"
                />
                {isLowStock && (
                  <div className="absolute inset-0 bg-yellow-500/10 flex items-center justify-center rounded-md">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant={stockStatus.variant} className="mt-1">
                        {stockStatus.message}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isOutOfStock 
                        ? "This product is currently out of stock" 
                        : isLowStock 
                          ? "This product is running low on stock. Order soon!" 
                          : "Product is available in stock"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex flex-col items-end justify-between">
                <div className="text-lg font-semibold flex items-center gap-1">
                  <IndianRupee className="h-4 w-4" />
                  {product.price.toLocaleString()}
                </div>

                {quantityInCart > 0 ? (
                  <div className="mt-2 flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(product.id, quantityInCart - 1)}
                    >
                      <Minus className="h-4 w-4" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>

                    <span className="mx-3 w-8 text-center">{quantityInCart}</span>

                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(product.id, quantityInCart + 1)}
                      disabled={quantityInCart >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2" 
                    onClick={() => onAddToCart(product)}
                    disabled={isOutOfStock}
                  >
                    Add
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
