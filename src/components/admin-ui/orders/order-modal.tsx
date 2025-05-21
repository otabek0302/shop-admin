'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderItem, OrderStatus } from '@/interfaces/orders';
import { useOrderStore } from '@/store/order-store';
import { useModalStore } from '@/store/modal-store';
import { toast } from 'sonner';
import { Search, Package } from 'lucide-react';
import { useProductStore } from '@/store/product-store';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/interfaces/products';
import { ProductCard } from './order-product-card';
import { OrderItemCard } from './order-item';
import { Divider } from '@/components/ui/divider';
import { useTranslation } from 'react-i18next';

interface OrderFormData {
  orderItems: OrderItem[];
  total: number;
  status: OrderStatus;
  discount: number;
}

const createEmptyOrder = (): OrderFormData => ({
  orderItems: [],
  total: 0,
  status: OrderStatus.PENDING,
  discount: 0,
});

const OrderModal = () => {
  const { t } = useTranslation();
  const { createOrder, updateOrder, loading, editData, setEditData } = useOrderStore();
  const { products, fetchProducts } = useProductStore();
  const { open, setOpen } = useModalStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<OrderFormData>(createEmptyOrder());
  const [discountAmount, setDiscountAmount] = useState('');

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open, fetchProducts]);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setFormData(createEmptyOrder());
    }
  }, [open]);

  useEffect(() => {
    if (editData) {
      setFormData({
        orderItems: editData.orderItems,
        total: editData.total,
        status: editData.status,
        discount: editData.discount,
      });
    } else {
      setFormData(createEmptyOrder());
    }
  }, [editData]);

  useEffect(() => {
    const subtotal = formData.orderItems.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal - formData.discount;
    setFormData((prev) => ({ ...prev, total: Math.max(0, total) }));
  }, [formData.orderItems, formData.discount]);

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleAddOrderItem = (product: Product) => {
    setFormData((prev) => {
      const existingItemIndex = prev.orderItems.findIndex((item) => item.productId === product.id);

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
          image: product.image.url || '',
        },
      } as OrderItem;

      return {
        ...prev,
        orderItems: [...prev.orderItems, newItem],
      };
    });
    setSearchQuery('');
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

      if (field === 'quantity') {
        const newQuantity = typeof value === 'number' ? value : parseInt(value as string);
        if (newQuantity > 0) {
          item.quantity = newQuantity;
          item.total = item.price * item.quantity;
        }
      }

      newOrderItems[index] = item;
      return { ...prev, orderItems: newOrderItems };
    });
  };

  const handleApplyDiscount = () => {
    const amount = parseFloat(discountAmount);
    if (!isNaN(amount) && amount >= 0) {
      setFormData((prev) => ({ ...prev, discount: amount }));
      setDiscountAmount('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orderItems?.length) {
      toast.error('Please add at least one item to the order');
      return;
    }

    try {
      const orderData = {
        items: formData.orderItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
        status: formData.status,
        discount: formData.discount,
      };

      if (editData) {
        await updateOrder(editData.id as string, orderData);
        toast.success(t('messages.success.order.order-updated'));
      } else {
        await createOrder(orderData);
        toast.success(t('messages.success.order.order-created'));
      }
      setOpen(false);
      setEditData(null);
    } catch (err) {
      console.error('[ORDER_MODAL_ERROR]', err);
      toast.error(t('messages.error.order.order-save-failed'));
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setEditData(null);
  };

  const handleCancel = () => {
    setOpen(false);
    setEditData(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="no-scrollbar h-[95vh] w-full max-w-md overflow-y-auto sm:max-w-5xl sm:rounded-lg">
        <DialogTitle>{editData ? t('components.admin-ui.order.order-modal.edit-title', 'Edit Order') : t('components.admin-ui.order.order-modal.create-title', 'Create New Order')}</DialogTitle>
        <DialogDescription>{editData ? t('components.admin-ui.order.order-modal.edit-description', 'Modify the order details below') : t('components.admin-ui.order.order-modal.create-description', 'Add products to create a new order')}</DialogDescription>
        <div className="flex h-[480px] w-full flex-col md:flex-row">
          {/* Left Panel - Product Selection */}
          <div className="flex h-full max-w-1/2 flex-1 flex-col p-4">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Package className="text-primary h-5 w-5" />
                {t('components.admin-ui.order.order-modal.products')}
              </h3>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {products.length || 0} {t('components.admin-ui.order.order-modal.items')}
              </Badge>
            </div>

            <div className="relative mb-6">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
              <Input placeholder={t('components.admin-ui.order.order-modal.search-products')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-background h-11 pl-9" />
            </div>

            <ScrollArea className="no-scrollbar h-[calc(100%-8rem)] flex-1">
              <div className="grid grid-cols-1 gap-4 px-2">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={() => handleAddOrderItem(product)} />
                ))}
              </div>
            </ScrollArea>
          </div>

          <Divider orientation="vertical" className="h-full" />

          {/* Right Panel - Order Items */}
          <div className="flex h-full max-w-1/2 flex-1 flex-col p-4">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Package className="text-primary h-5 w-5" />
                {t('components.admin-ui.order.order-modal.order-items')}
              </h3>
              <Badge variant="outline" className="px-3 py-1 text-sm">
                {formData.orderItems?.length || 0} {t('components.admin-ui.order.order-modal.items')}
              </Badge>
            </div>

            <ScrollArea className="no-scrollbar h-[calc(100%-8rem)] flex-1">
              <div className="space-y-4 px-2">
                {formData.orderItems?.map((item, index) => {
                  const product = products.find((p) => p.id === item.productId);
                  return <OrderItemCard key={index} item={item} index={index} updateOrderItem={handleUpdateOrderItem} removeOrderItem={handleRemoveOrderItem} availableStock={product?.stock || 0} />;
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2">
          {/* Discount input section */}
          <div className="mb-6">
            <label htmlFor="discount-amount" className="mb-1 block text-sm font-medium">
              {t('components.summary.discount-amount')}
            </label>
            <div className="flex">
              <Input id="discount-amount" type="text" min="0" step="0.01" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} placeholder={t('components.summary.discount-amount')} className="rounded-r-none border-none outline-none focus:ring-0 focus:outline-none" />
              <Button className="cursor-pointer rounded-l-none dark:bg-gray-800 dark:text-white" onClick={handleApplyDiscount} type="button">
                {t('components.summary.apply-discount')}
              </Button>
            </div>
            {formData.discount > 0 && <p className="mt-1 flex items-center gap-1 text-sm text-green-600">{t('components.summary.discount-applied', { discount: formData.discount.toLocaleString() })}</p>}
          </div>

          {/* Summary pricing */}
          <div className="mb-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t('components.summary.subtotal')}</span>
              <span className="flex items-center gap-1">{formData.orderItems.reduce((sum, item) => sum + item.total, 0).toLocaleString()}</span>
            </div>
            {formData.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t('components.summary.discount')}</span>
                <span className="flex items-center gap-1">{formData.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>{t('components.summary.total')}</span>
              <span className="flex items-center gap-1">{formData.total?.toLocaleString()}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-11 cursor-pointer px-6">
              {t('components.admin-ui.order.order-modal.cancel')}
            </Button>
            <Button type="submit" disabled={loading || !formData.orderItems?.length} onClick={handleSubmit} className="h-11 cursor-pointer px-6 dark:bg-gray-800 dark:text-white">
              {loading ? t('components.admin-ui.order.order-modal.saving') : editData ? t('components.admin-ui.order.order-modal.edit-order') : t('components.admin-ui.order.order-modal.create-order')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
