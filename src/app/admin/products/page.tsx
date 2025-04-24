"use client";

import ProductTableToolbar from "@/components/admin-ui/products/product-toolbar";
import Pagination from "@/components/ui/pagination";
import ProductList from "@/components/admin-ui/products/product-list";

import { useProductStore } from "@/store/product-store";
import { useEffect } from "react";

const ProductsPage = () => {
  const { total, page, search, setPage, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [search, page, fetchProducts]);


  return (
    <section className="h-full space-y-4 p-4 flex flex-col justify-between">
      <ProductTableToolbar />
      <ProductList />
      <Pagination page={page} setPage={setPage} total={total} perPage={10} />
    </section>
  );
};

export default ProductsPage;
