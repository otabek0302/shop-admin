import { Input } from '@/components/ui/input';
import { useProductStore } from '@/store/product-store';
import { useTranslation } from 'react-i18next';

export const ProductToolbar = () => {
  const { t } = useTranslation();

  const { search, setSearch, fetchProducts } = useProductStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchProducts();
  };

  return (
    <div className="py-4">
      <Input placeholder={t('components.admin-ui.product.product-toolbar.search')} value={search} onChange={handleFilterChange} className="h-10" />
    </div>
  );
};
