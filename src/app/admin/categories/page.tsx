"use client";

import CategoryTableToolbar from "@/components/admin-ui/categories/category-toolbar";
import CategoryList from "@/components/admin-ui/categories/category-list";
import Pagination from "@/components/ui/pagination";

import { useEffect } from "react";
import { useCategoryStore } from "@/store/category-store";

const CategoriesPage = () => {
  const { total, page, search, setPage, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [search, page, fetchCategories]);

  return (
    <div className="h-full space-y-4 p-4 flex flex-col justify-between">
      <CategoryTableToolbar />
      <CategoryList />
      <Pagination page={page} setPage={setPage} total={total} perPage={10} />
    </div>
  );
};

export default CategoriesPage;
