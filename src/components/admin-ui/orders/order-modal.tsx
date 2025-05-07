"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Order, OrderStatus, OrderItem } from "@/interfaces/orders";
import { useOrderStore } from "@/store/order-store";
import { useModalStore } from "@/store/modal-store";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Plus, Minus, Search, ShoppingCart, Package, IndianRupee, X } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import { Product } from "@/interfaces/products";
import { cn } from "@/lib/utils";

const OrderModal = () => {
  const { createOrder, updateOrder, loading, editData, setEditData } = useOrderStore();
  const { products, fetchProducts } = useProductStore();
  const { open, setOpen } = useModalStore();
  const [formData, setFormData] = useState<Partial<Order>>({
    total: 0,
    status: OrderStatus.PENDING,
    orderItems: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open, fetchProducts]);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({
        total: 0,
        status: OrderStatus.PENDING,
        orderItems: [],
      });
    }
  }, [editData]);

  useEffect(() => {
    const total = formData.orderItems?.reduce((sum, item) => sum + item.total, 0) || 0;
    setFormData((prev) => ({ ...prev, total }));
  }, [formData.orderItems]);

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addOrderItem = (product: Product) => {
    setFormData((prev) => {
      const existingItemIndex = prev.orderItems?.findIndex((item) => item.productId === product.id) ?? -1;
      
      if (existingItemIndex !== -1) {
        const newOrderItems = [...(prev.orderItems || [])];
        const item = newOrderItems[existingItemIndex];
        item.quantity += 1;
        item.total = item.price * item.quantity;
        return { ...prev, orderItems: newOrderItems };
      }

      const newItem: OrderItem = {
        productId: product.id,
        quantity: 1,
        price: product.price,
        total: product.price,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        },
      };
      return {
        ...prev,
        orderItems: [...(prev.orderItems || []), newItem],
      };
    });
    setSearchQuery("");
  };

  const removeOrderItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      orderItems: prev.orderItems?.filter((_, i) => i !== index),
    }));
  };

  const updateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setFormData((prev) => {
      const newOrderItems = [...(prev.orderItems || [])];
      const item = newOrderItems[index];
      
      if (field === "quantity") {
        const newQuantity = typeof value === "number" ? value : parseInt(value as string);
        if (newQuantity > 0) {
          item.quantity = newQuantity;
          item.total = item.price * item.quantity;
        }
      }
      
      newOrderItems[index] = item;
      return { ...prev, orderItems: newOrderItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderItems?.length) {
      toast.error("Please add at least one item to the order");
      return;
    }
    try {
      if (editData) {
        await updateOrder(editData.id, formData);
        toast.success("Order updated successfully");
      } else {
        await createOrder(formData);
        toast.success("Order created successfully");
      }
      setOpen(false);
      setEditData(null);
    } catch (err) {
      console.error("[ORDER_MODAL_ERROR]", err);
      toast.error("Failed to save order");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setEditData(null);
  };

  const ProductCard = ({ product, onClick }: { product: Product; onClick: () => void }) => (
    <Card 
      key={product.id} 
      className={cn(
        "p-4 cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:border-primary/20",
        "active:scale-[0.98]"
      )} 
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted">
          <Image src={getImageUrl(product.image)} alt={product.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{product.name}</p>
          <p className="text-sm text-muted-foreground mt-1">₹{product.price.toFixed(2)}</p>
        </div>
        <Button size="sm" variant="ghost" className="rounded-full">
          <Plus className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );

  const OrderItemCard = ({ item, index }: { item: OrderItem; index: number }) => (
    <Card className="p-4 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-muted">
          <Image src={getImageUrl(item.product.image)} alt={item.product.name} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base truncate">{item.product.name}</p>
          <p className="text-sm text-muted-foreground mt-1">₹{item.price.toFixed(2)} each</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => updateOrderItem(index, "quantity", Math.max(1, item.quantity - 1))} 
            className="h-9 w-9 rounded-full" 
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Input 
            type="number" 
            min="1" 
            value={item.quantity} 
            onChange={(e) => updateOrderItem(index, "quantity", parseInt(e.target.value) || 1)} 
            className="w-16 text-center h-9" 
          />
          <Button 
            size="icon" 
            variant="outline" 
            onClick={() => updateOrderItem(index, "quantity", item.quantity + 1)} 
            className="h-9 w-9 rounded-full"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => removeOrderItem(index)} 
            className="h-9 w-9 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="mt-3 text-right text-sm font-medium text-primary">
        Total: ₹{item.total.toFixed(2)}
      </div>
    </Card>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[1400px] h-[90vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Left Panel - Product Selection */}
          <div className="flex-1 max-w-[500px] border-r p-6 flex flex-col bg-muted/5">
            <DialogHeader className="pb-6">
              <DialogTitle className="flex items-center gap-2 text-xl">
                <ShoppingCart className="w-6 h-6 text-primary" />
                {editData ? "Edit Order" : "Create Order"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search products..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-9 h-11 bg-background" 
              />
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-1 gap-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={() => addOrderItem(product)} />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel - Order Items */}
          <div className="flex-1 max-w-[800px] p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Items
              </h3>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {formData.orderItems?.length || 0} items
              </Badge>
            </div>

            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {formData.orderItems?.map((item, index) => (
                  <OrderItemCard key={index} item={item} index={index} />
                ))}
              </div>
            </ScrollArea>

            <div className="border-t pt-6 mt-6">
              <div className="flex items-center justify-end mb-6">
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Total Amount</div>
                  <div className="text-3xl font-bold flex items-center gap-1 text-primary">
                    <IndianRupee className="w-6 h-6" />
                    {formData.total?.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                    setEditData(null);
                  }}
                  className="h-11 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || !formData.orderItems?.length} 
                  onClick={handleSubmit}
                  className="h-11 px-6"
                >
                  {loading ? "Saving..." : editData ? "Update Order" : "Create Order"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
