'use client';

import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCategoryProps } from '@/interfaces/products';
import { useCategoryStore } from '@/store/category-store';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ProductCategory = ({ category, setCategory }: ProductCategoryProps) => {
  const { t } = useTranslation();

  const { categories, fetchCategories } = useCategoryStore();

  const categoryId = typeof category === 'string' ? category : category?.id;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="category">{t('components.admin-ui.product.product-modal.category.label')}</Label>
      <Select value={categoryId} onValueChange={setCategory}>
        <SelectTrigger id="category" className="w-full">
          <SelectValue placeholder={t('components.admin-ui.product.product-modal.category.placeholder')} />
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
