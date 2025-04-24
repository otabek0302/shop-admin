"use client";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCategoryProps } from "@/interfaces/products";
import { useCategoryStore } from "@/store/category-store";
import { useEffect } from "react";
const ProductCategory = ({ category, setCategory }: ProductCategoryProps) => {
  const { categories, fetchCategories } = useCategoryStore();

  const categoryId = typeof category === "string" ? category : category?.id;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="category">Category</Label>
      <Select value={categoryId} onValueChange={setCategory}>
        <SelectTrigger id="category" className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((cat) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProductCategory;
