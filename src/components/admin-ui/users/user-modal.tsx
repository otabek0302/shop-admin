'use client';

import UserRole from './user-role';

import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useModalStore } from '@/store/modal-store';
import { useUserStore } from '@/store/user-store';
import { useTranslation } from 'react-i18next';

export default function UserModal() {
  const { open, setOpen } = useModalStore();
  const { editData, createUser, editUser, setEditData } = useUserStore();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'USER',
    password: '',
    phone: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name,
        email: editData.email ?? '',
        role: editData.role ?? 'USER',
        password: '',
        phone: editData.phone ?? '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'USER',
        password: '',
        phone: '',
      });
    }
  }, [editData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editData) {
      await editUser(editData.id, formData);
    } else {
      await createUser(formData);
    }

    setOpen(false);
    setEditData(null);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditData(null);
        }
        setOpen(isOpen);
      }}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>{editData ? t('components.admin-ui.user.user-modal.edit-title') : t('components.admin-ui.user.user-modal.add-title')}</DialogTitle>
        <DialogDescription>{editData ? t('components.admin-ui.user.user-modal.edit-description') : t('components.admin-ui.user.user-modal.add-description')}</DialogDescription>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t('components.admin-ui.user.user-modal.name-placeholder')} className="w-full shadow-none focus-visible:ring-1" />
          <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={t('components.admin-ui.user.user-modal.email-placeholder')} type="email" required className="w-full shadow-none focus-visible:ring-1" />
          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={t('components.admin-ui.user.user-modal.phone-placeholder')} className="w-full shadow-none focus-visible:ring-1" />
          <Input value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={t('components.admin-ui.user.user-modal.password-placeholder')} type="password" required />
          <UserRole role={formData.role} onChange={(value) => setFormData({ ...formData, role: value })} />
          <div className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer bg-gray-200 hover:bg-gray-100"
              onClick={() => {
                setOpen(false);
                setEditData(null);
              }}>
              {t('components.admin-ui.user.user-modal.cancel')}
            </Button>
            <Button type="submit" variant="outline" className="bg-primary hover:bg-primary/90 cursor-pointer dark:bg-gray-800 dark:text-white text-white">
              {editData ? t('components.admin-ui.user.user-modal.update') : t('components.admin-ui.user.user-modal.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
