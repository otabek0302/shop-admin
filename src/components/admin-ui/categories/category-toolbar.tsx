'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useModalStore } from '@/store/modal-store';
import { useCategoryStore } from '@/store/category-store';
import { useTranslation } from 'react-i18next';

const CategoryTableToolbar = () => {
  const { setOpen } = useModalStore();
  const { search, setSearch, setEditData } = useCategoryStore();
  const { t } = useTranslation();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Input placeholder={t('components.admin-ui.category.category-toolbar.search')} value={search} onChange={handleFilterChange} className="h-10 lg:w-[250px]" />
        <Button
          className="cursor-pointer dark:bg-gray-800 dark:text-white"
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}>
          {t('components.admin-ui.category.category-toolbar.add-category')}
        </Button>
      </div>
    </>
  );
};

export default CategoryTableToolbar;
