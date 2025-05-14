import Image from "next/image";

import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/utils/getImageUrl";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { Product } from "@/interfaces/products";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => {
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  const getStockBadgeVariant = () => {
    if (isOutOfStock) return "destructive";
    if (isLowStock) return "secondary";
    return "outline";
  };

  const getStockMessage = () => {
    if (isOutOfStock) return "Out of Stock";
    if (isLowStock) return `Low Stock: ${product.stock}`;
    return `In Stock: ${product.stock}`;
  };

  return (
    <Card 
      className={`p-4 transition-all duration-200 hover:shadow-md hover:border-primary/20 active:scale-[0.98] ${
        isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      }`} 
      onClick={!isOutOfStock ? onClick : undefined}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted">
          <Image src={getImageUrl(product.image)} alt={product.name} fill className="object-cover" />
          {isLowStock && (
            <div className="absolute inset-0 bg-yellow-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{product.name}</p>
          <p className="text-sm text-muted-foreground mt-1">₹{product.price.toFixed(2).toLocaleString()}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={getStockBadgeVariant()} className="mt-1">
                  {getStockMessage()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {isLowStock 
                  ? "This product is running low on stock. Order soon!" 
                  : isOutOfStock 
                    ? "This product is currently out of stock" 
                    : "Product is available in stock"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className={`group rounded-full cursor-pointer hover:bg-primary/20 ${
            isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isOutOfStock}
        >
          <Plus className="w-5 h-5 group-hover:text-primary" />
        </Button>
      </div>
    </Card>
  );
};
