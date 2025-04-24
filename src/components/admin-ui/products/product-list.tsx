"use client";

import ProductCard from "./product-card";
import ProductModal from "./product-modal";
import ConfirmDialog from "@/components/ui/confirm-dialog";

import { useProductStore } from "@/store/product-store";
import { useConfirmStore } from "@/store/confirm-store";
const ProductList = () => {
  const { products, deleteData, deleteProduct } = useProductStore();
  const { closeConfirm } = useConfirmStore();

  const confirmDelete = async () => {
    await deleteProduct(deleteData?.id ?? "");
    closeConfirm();
  };

  return (
    <div className="mt-4 h-full">
      {products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground px-10 py-20 border rounded-lg">
          <span className="text-lg font-semibold">No products found</span>
          <p className="text-sm mt-1">Try adjusting your filters or adding a new product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products?.map((product, index) => (
            <ProductCard key={index} product={product}  />
          ))}
        </div>
      )}

      <ConfirmDialog message="Are you sure you want to delete this product?" title="Delete Product" action="Delete" onConfirm={confirmDelete} />
      <ProductModal />
    </div>
  );
};

export default ProductList;
