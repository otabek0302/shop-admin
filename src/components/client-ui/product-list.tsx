'use client';

import { ProductCard } from './product-card';
import { useProductStore } from '@/store/product-store';
import { useTranslation } from 'react-i18next';

export default function ProductList() {
  const { t } = useTranslation();
  const { products } = useProductStore();

  if (!products.length) {
    return <div className="text-muted-foreground py-10 text-center">{t('components.product-list.no-products')}</div>;
  }

  return (
    <div className="h-full w-full space-y-6 overflow-y-auto pr-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
