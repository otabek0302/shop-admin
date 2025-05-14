"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderItem, OrderStatus } from "@/interfaces/orders";
import { useOrderStore } from "@/store/order-store";
import { useModalStore } from "@/store/modal-store";
import { toast } from "sonner";
import { Search, Package } from "lucide-react";
import { useProductStore } from "@/store/product-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/interfaces/products";
import { ProductCard } from "./order-product-card";
import { OrderItemCard } from "./order-item";
import { Divider } from "@/components/ui/divider";

interface OrderFormData {
  orderItems: OrderItem[];
  total: number;
  status: OrderStatus;
}

const createEmptyOrder = (): OrderFormData => ({
  orderItems: [],
  total: 0,
  status: OrderStatus.PENDING
});

const OrderModal = () => {
  const { createOrder, updateOrder, loading, editData, setEditData } = useOrderStore();
  const { products, fetchProducts } = useProductStore();
  const { open, setOpen } = useModalStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<OrderFormData>(createEmptyOrder());

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open, fetchProducts]);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setFormData(createEmptyOrder());
    }
  }, [open]);

  useEffect(() => {
    if (editData) {
      setFormData({
        orderItems: editData.orderItems,
        total: editData.total,
        status: editData.status
      });
    } else {
      setFormData(createEmptyOrder());
    }
  }, [editData]);

  useEffect(() => {
    const total = formData.orderItems.reduce((sum, item) => sum + item.total, 0);
    setFormData((prev) => ({ ...prev, total }));
  }, [formData.orderItems]);

  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddOrderItem = (product: Product) => {
    setFormData((prev) => {
      const existingItemIndex = prev.orderItems.findIndex(
        (item) => item.productId === product.id
      );

      if (existingItemIndex !== -1) {
        const newOrderItems = [...prev.orderItems];
        const item = newOrderItems[existingItemIndex];
        item.quantity += 1;
        item.total = item.price * item.quantity;
        return { ...prev, orderItems: newOrderItems };
      }

      const newItem = {
        productId: product.id,
        quantity: 1,
        price: product.price,
        total: product.price,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image.url || "",
        },
      } as OrderItem;

      return {
        ...prev,
        orderItems: [...prev.orderItems, newItem],
      };
    });
    setSearchQuery("");
  };

  const handleRemoveOrderItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateOrderItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setFormData((prev) => {
      const newOrderItems = [...prev.orderItems];
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
      const orderData = {
        items: formData.orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        status: formData.status
      };

      if (editData) {
        await updateOrder(editData.id as string, orderData);
        toast.success("Order updated successfully");
      } else {
        await createOrder(orderData);
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-4 overflow-hidden sm:max-w-[786px]">
        <div className="flex flex-col md:flex-row w-full h-[70vh]">
          {/* Left Panel - Product Selection */}
          <div className="flex-1 max-w-1/2 p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Products
              </h3>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {products.length || 0} items
              </Badge>
            </div>

            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search products..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-9 h-11 bg-background" 
              />
            </div>

            <ScrollArea className="flex-1 h-[calc(100%-8rem)]">
              <div className="grid grid-cols-1 gap-4 pr-4">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onClick={() => handleAddOrderItem(product)} 
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          <Divider orientation="vertical" />

          {/* Right Panel - Order Items */}
          <div className="flex-1 max-w-1/2 p-4 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                Order Items
              </h3>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {formData.orderItems?.length || 0} items
              </Badge>
            </div>

            <ScrollArea className="flex-1 h-[calc(100%-8rem)]">
              <div className="space-y-4 pr-4">
                {formData.orderItems?.map((item, index) => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <OrderItemCard 
                      key={index} 
                      item={item} 
                      index={index} 
                      updateOrderItem={handleUpdateOrderItem} 
                      removeOrderItem={handleRemoveOrderItem}
                      availableStock={product?.stock || 0}
                    />
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-end mb-6">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Amount</div>
              <div className="text-3xl font-bold flex items-center gap-1 text-primary">
                ₹{formData.total?.toFixed(2)}
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
              className="h-11 px-6">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.orderItems?.length} 
              onClick={handleSubmit} 
              className="h-11 px-6">
              {loading ? "Saving..." : editData ? "Update Order" : "Create Order"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
