'use client';

import ProductCard from './product-card';
import ProductModal from './product-modal';
import ConfirmDialog from '@/components/ui/confirm-dialog';

import { Skeleton } from '@/components/ui/skeleton';
import { useProductStore } from '@/store/product-store';
import { useConfirmStore } from '@/store/confirm-store';
import { useTranslation } from 'react-i18next';
import { useModalStore } from '@/store/modal-store';
import { toast } from 'sonner';

const ProductList = () => {
  const { t } = useTranslation();

  const { open } = useModalStore();
  const { products, deleteData, deleteProduct, loading } = useProductStore();
  const { closeConfirm } = useConfirmStore();

  const handleDelete = async () => {
    if (!deleteData) return;

    try {
      await deleteProduct(deleteData.id);
      toast.success('Product deleted successfully');
      closeConfirm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete product');
      }
    }
  };

  const LoadingSkeleton = () => (
    <div className="w-full space-y-4 overflow-hidden rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <Skeleton className="h-32 w-32 rounded-md" />
          <div className="flex flex-col justify-center space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="border-border space-y-2 rounded-lg border px-4 py-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
        <hr />
        <div className="flex items-center justify-between gap-10">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-2 w-24" />
          <Skeleton className="h-4 w-8" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-4 h-full">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {loading && Array(3).fill(0).map((_, index) => <LoadingSkeleton key={index} />)}
        {!loading && products.length === 0 && (
          <div className="text-muted-foreground col-span-full flex flex-col items-center justify-center rounded-lg border px-10 py-20 text-center">
            <span className="text-lg font-semibold">{t('components.admin-ui.product.product-list.no-products')}</span>
            <p className="mt-1 text-sm">{t('components.admin-ui.product.product-list.try-adjusting-filters')}</p>
          </div>
        )}
        {!loading && products.length > 0 && products.map((product, index) => <ProductCard key={index} product={product} />)}
      </div>

      <ConfirmDialog message={t('components.admin-ui.product.product-list.delete.message')} title={t('components.admin-ui.product.product-list.delete.title')} action={t('components.admin-ui.product.product-list.delete.action')} cancel={t('components.admin-ui.product.product-list.delete.cancel')} onConfirm={handleDelete} />
      {open && <ProductModal />}
    </div>
  );
};

export default ProductList;
