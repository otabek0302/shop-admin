'use client';

import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useModalStore } from '@/store/modal-store';
import { useCategoryStore } from '@/store/category-store';
import { useTranslation } from 'react-i18next';

const CategoryModal = () => {
  const { open, setOpen } = useModalStore();
  const { editData, createCategory, editCategory, setEditData } = useCategoryStore();
  const { t } = useTranslation();

  const [name, setName] = useState('');

  useEffect(() => {
    if (editData) {
      setName(editData.name);
    } else {
      setName('');
    }
  }, [editData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editData) {
      await editCategory(editData.id, name);
    } else {
      await createCategory(name);
    }

    setOpen(false);
    setEditData(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="shadow-none sm:max-w-[425px]">
        <DialogTitle>{editData ? t('components.admin-ui.category.category-modal.edit-title') : t('components.admin-ui.category.category-modal.add-title')}</DialogTitle>
        <DialogDescription>{editData ? t('components.admin-ui.category.category-modal.edit-description') : t('components.admin-ui.category.category-modal.add-description')}</DialogDescription>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t('components.admin-ui.category.category-modal.name-placeholder')} required className="w-full shadow-none focus-visible:ring-1" />
          <div className="mt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" className="cursor-pointer bg-gray-200 hover:bg-gray-100" onClick={() => setOpen(false)}>
              {t('components.admin-ui.category.category-modal.cancel')}
            </Button>
            <Button type="submit" variant="outline" className="bg-primary hover:bg-primary/90 cursor-pointer text-white hover:text-white dark:bg-gray-800 dark:text-white">
              {editData ? t('components.admin-ui.category.category-modal.update') : t('components.admin-ui.category.category-modal.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
