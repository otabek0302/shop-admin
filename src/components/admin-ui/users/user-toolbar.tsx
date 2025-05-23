'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/user-store';
import { useModalStore } from '@/store/modal-store';
import { useTranslation } from 'react-i18next';

export default function UserToolbar() {
  const { search, setSearch, setEditData } = useUserStore();
  const { setOpen } = useModalStore();
  const { t } = useTranslation();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <Input placeholder={t('components.admin-ui.user.user-toolbar.search')} value={search} onChange={handleFilterChange} className="h-10 lg:w-[250px]" />
        <Button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="cursor-pointer dark:bg-gray-800 dark:text-white">
          {t('components.admin-ui.user.user-toolbar.add-user')}
        </Button>
      </div>
    </>
  );
}
