"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { OrderModalProps, OrderStatus, OrderItem } from "@/interfaces/orders";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: {
    url: string;
    public_id: string;
  };
}

const OrderModal = ({ open, onClose, initialData, onSuccess }: OrderModalProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<{ [key: string]: { quantity: number; product: Product } }>({});
  const [status, setStatus] = useState(OrderStatus.PENDING);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialData) {
      // Initialize selected products from existing order
      const selected: { [key: string]: { quantity: number; product: Product } } = {};
      initialData.orderItems.forEach(item => {
        selected[item.productId] = {
          quantity: item.quantity,
          product: {
            ...item.product,
            stock: 0 // Stock will be updated when fetching products
          }
        };
      });
      setSelectedProducts(selected);
      setStatus(initialData.status);
    } else {
      setSelectedProducts({});
      setStatus(OrderStatus.PENDING);
    }
  }, [initialData]);

  const handleProductToggle = (product: Product) => {
    setSelectedProducts(prev => {
      if (prev[product.id]) {
        const newSelected = { ...prev };
        delete newSelected[product.id];
        return newSelected;
      } else {
        // Don't allow adding products with zero stock
        if (product.stock <= 0) {
          alert(`Cannot add ${product.name} - out of stock`);
          return prev;
        }
        return {
          ...prev,
          [product.id]: {
            quantity: 1,
            product
          }
        };
      }
    });
  };

  const handleQuantityChange = (productId: string, change: number) => {
    setSelectedProducts(prev => {
      const current = prev[productId];
      if (!current) return prev;

      const newQuantity = Math.max(1, Math.min(current.product.stock, current.quantity + change));
      return {
        ...prev,
        [productId]: {
          ...current,
          quantity: newQuantity
        }
      };
    });
  };

  const calculateTotal = () => {
    return Object.values(selectedProducts).reduce((sum, { quantity, product }) => {
      return sum + (product.price * quantity);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(selectedProducts).length === 0) return;

    const orderItems: OrderItem[] = Object.entries(selectedProducts).map(([productId, { quantity, product }]) => ({
      productId,
      product,
      quantity,
      price: product.price,
      total: product.price * quantity
    }));

    const url = initialData ? `/api/orders/${initialData.id}` : "/api/orders";
    const method = initialData ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          total: calculateTotal(),
          status
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.details || "Failed to process order");
      }

      onSuccess();
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Order" : "Add New Order"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Label>Select Products</Label>
            <div className="border rounded-md divide-y max-h-[300px] overflow-y-auto">
              {products.map((product) => (
                <div key={product.id} className="p-4 flex items-center gap-4">
                  <Checkbox
                    checked={!!selectedProducts[product.id]}
                    onCheckedChange={() => handleProductToggle(product)}
                  />
                  <div className="flex-1 flex items-center gap-3">
                    <Image 
                      src={getImageUrl(product.image)} 
                      alt={product.name} 
                      width={40} 
                      height={40} 
                      className="rounded-md border object-cover" 
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{product.price.toFixed(2)} (Stock: {product.stock})
                      </p>
                    </div>
                  </div>
                  {selectedProducts[product.id] && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(product.id, -1)}
                        disabled={selectedProducts[product.id].quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">
                        {selectedProducts[product.id].quantity}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(product.id, 1)}
                        disabled={selectedProducts[product.id].quantity >= product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {Object.keys(selectedProducts).length > 0 && (
            <div className="space-y-2">
              <Label>Selected Items</Label>
              <div className="border rounded-md divide-y">
                {Object.entries(selectedProducts).map(([productId, { quantity, product }]) => (
                  <div key={productId} className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Image 
                        src={getImageUrl(product.image)} 
                        alt={product.name} 
                        width={40} 
                        height={40} 
                        className="rounded-md border object-cover" 
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {quantity} x ₹{product.price.toFixed(2)} = ₹{(product.price * quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleProductToggle(product)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-medium">Total:</span>
                <span className="font-bold">₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value: OrderStatus) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={OrderStatus.COMPLETED}>Completed</SelectItem>
                <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={Object.keys(selectedProducts).length === 0}
            >
              {initialData ? "Update Order" : "Create Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
