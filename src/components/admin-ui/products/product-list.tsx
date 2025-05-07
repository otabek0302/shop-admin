"use client";

import ProductCard from "./product-card";
import ProductModal from "./product-modal";
import ConfirmDialog from "@/components/ui/confirm-dialog";

import { Skeleton } from "@/components/ui/skeleton";
import { useProductStore } from "@/store/product-store";
import { useConfirmStore } from "@/store/confirm-store";

const ProductList = () => {
  const { products, deleteData, deleteProduct, loading } = useProductStore();
  const { closeConfirm } = useConfirmStore();

  const confirmDelete = async () => {
    await deleteProduct(deleteData?.id ?? "");
    closeConfirm();
  };

  const LoadingSkeleton = () => (
    <div className="rounded-xl overflow-hidden shadow-sm p-4 space-y-4 w-full border">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <Skeleton className="w-32 h-32 rounded-md" />
          <div className="space-y-2 flex flex-col justify-center">
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
      <div className="rounded-lg border border-border px-4 py-4 space-y-2">
        <div className="flex justify-between items-center">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && Array(3).fill(0).map((_, index) => <LoadingSkeleton key={index} />)}
        {!loading && products.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center text-center text-muted-foreground px-10 py-20 border rounded-lg">
            <span className="text-lg font-semibold">No products found</span>
            <p className="text-sm mt-1">Try adjusting your filters or adding a new product.</p>
          </div>
        )}
        {!loading && products.length > 0 && products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>

      <ConfirmDialog message="Are you sure you want to delete this product?" title="Delete Product" action="Delete" onConfirm={confirmDelete} />
      <ProductModal />
    </div>
  );
};

export default ProductList;
