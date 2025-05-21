'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useModalStore } from '@/store/modal-store';
import { useOrderStore } from '@/store/order-store';
import { useTranslation } from 'react-i18next';

const OrderToolbar = () => {
  const { t } = useTranslation();
  const { setOpen } = useModalStore();
  const { search, setSearch, setEditData } = useOrderStore();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <Input placeholder={t('components.admin-ui.order.order-toolbar.search')} value={search} onChange={handleFilterChange} className="h-10 lg:w-[250px]" />
      <Button
        className="cursor-pointer dark:bg-gray-800 dark:text-white"
        onClick={() => {
          setEditData(null);
          setOpen(true);
        }}>
        {t('components.admin-ui.order.order-toolbar.add-order')}
      </Button>
    </div>
  );
};

export default OrderToolbar;
