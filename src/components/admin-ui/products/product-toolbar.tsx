import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useProductStore } from '@/store/product-store';
import { useModalStore } from '@/store/modal-store';
import { useTranslation } from 'react-i18next';

const ProductTableToolbar = () => {
  const { t } = useTranslation();

  const { setOpen } = useModalStore();
  const { search, setSearch, setEditData } = useProductStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Input placeholder={t('components.admin-ui.product.product-toolbar.search')} value={search} onChange={handleFilterChange} className="h-10 w-[150px] lg:w-[250px]" />
        <Button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}>
          {t('components.admin-ui.product.product-toolbar.add-product')}
        </Button>
      </div>
    </>
  );
};

export default ProductTableToolbar;
