import Image from "next/image";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OrderItem } from "@/interfaces/orders";
import { getImageUrl } from "@/utils/getImageUrl";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface OrderItemCardProps {
  item: OrderItem;
  index: number;
  updateOrderItem: (index: number, field: keyof OrderItem, value: string | number) => void;
  removeOrderItem: (index: number) => void;
  availableStock: number;
}

export const OrderItemCard = memo(({ item, index, updateOrderItem, removeOrderItem, availableStock }: OrderItemCardProps) => {
  const isLowStock = availableStock > 0 && availableStock <= 5;
  const remainingStock = availableStock - item.quantity;

  const handleQuantityChange = (value: number) => {
    if (value <= 0) {
      removeOrderItem(index);
    } else if (value <= availableStock) {
      updateOrderItem(index, "quantity", value);
    }
  };

  const getStockBadgeVariant = () => {
    if (remainingStock <= 0) return "destructive";
    if (remainingStock <= 5) return "secondary";
    return "outline";
  };

  const getStockMessage = () => {
    if (remainingStock <= 0) return "No Stock Left";
    if (remainingStock <= 5) return `Low Stock: ${remainingStock}`;
    return `In Stock: ${remainingStock}`;
  };

  return (
    <Card className="p-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted">
          <Image 
            src={getImageUrl(item.product.image)} 
            alt={item.product.name} 
            fill 
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isLowStock && (
            <div className="absolute inset-0 bg-yellow-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{item.product.name}</p>
          <p className="text-sm text-muted-foreground mt-1">₹{item.price.toFixed(2)}</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={getStockBadgeVariant()} className="mt-1">
                  {getStockMessage()}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                {remainingStock <= 0 
                  ? "No more stock available for this product" 
                  : remainingStock <= 5 
                    ? "Running low on stock. Consider ordering soon!" 
                    : "Product is available in stock"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <Button 
          size="icon" 
          variant="outline" 
          onClick={() => handleQuantityChange(item.quantity - 1)} 
          className="h-9 w-9 rounded-full"
          aria-label="Decrease quantity"
        >
          <Minus className="w-4 h-4" />
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
          className="w-16 text-center h-9" 
          aria-label="Item quantity"
        />
        <Button 
          size="icon" 
          variant="outline" 
          onClick={() => handleQuantityChange(item.quantity + 1)} 
          className="h-9 w-9 rounded-full"
          disabled={item.quantity >= availableStock}
          aria-label="Increase quantity"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="mt-3 text-right text-sm font-medium text-primary">
        Total: ₹{item.total.toFixed(2)}
      </div>
    </Card>
  );
});

OrderItemCard.displayName = "OrderItemCard";
