'use client';

import CategoryModal from './category-modal';
import CategoryListActions from './category-list-actions';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { useConfirmStore } from '@/store/confirm-store';
import { useCategoryStore } from '@/store/category-store';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { useModalStore } from '@/store/modal-store';

const CategoryList = () => {
  const { closeConfirm } = useConfirmStore();
  const { open } = useModalStore();
  const { categories, deleteData, deleteCategory, loading } = useCategoryStore();

  const { t } = useTranslation();

  const confirmDelete = async () => {
    try {
      await deleteCategory(deleteData?.id ?? '');
      toast.success(t('messages.success.category.category-deleted'));
    } catch {
      toast.error(t('messages.error.category.category-delete-failed'));
    }
    closeConfirm();
  };

  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell className="px-6">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="px-6">
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell className="px-6">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="px-6">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="flex justify-center px-6">
        <Skeleton className="h-9 w-9" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="no-scrollbar mt-4 h-full rounded-md md:border print:hidden">
      <div className="overflow-x-auto">
        {/* Mobile Card/List Layout */}
        <div className="block md:hidden">
          {loading && Array(5).fill(0).map((_, idx) => (
            <div key={idx} className="mb-4 rounded-lg border p-4 shadow-sm bg-white dark:bg-gray-900">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-9 w-9" />
              </div>
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
          {!loading && categories.length === 0 && (
            <div className="h-24 flex flex-col items-center justify-center text-center text-muted-foreground">
              <span className="text-lg font-semibold">{t('components.admin-ui.category.category-list.messages.no-categories')}</span>
              <p className="mt-1 text-sm">{t('components.admin-ui.category.category-list.messages.try-adjusting-filters')}</p>
            </div>
          )}
          {!loading && categories.length > 0 && categories.map(cat => (
            <div key={cat.id} className="mb-4 rounded-lg border p-4 shadow-md bg-white dark:bg-gray-900 transition hover:shadow-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-base text-gray-800 dark:text-gray-100">{cat.name}</span>
                <CategoryListActions cat={cat} />
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div><span className="font-medium">{t('components.admin-ui.category.category-list.table.header.id')}:</span> {cat.id.slice(-6)}</div>
                <div><span className="font-medium">{t('components.admin-ui.category.category-list.table.header.created')}:</span> {formatDistanceToNow(new Date(cat.createdAt), { addSuffix: true })}</div>
                <div><span className="font-medium">{t('components.admin-ui.category.category-list.table.header.updated')}:</span> {formatDistanceToNow(new Date(cat.updatedAt), { addSuffix: true })}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop Table Layout */}
        <div className="hidden md:block">
          <Table className="h-full border-collapse overflow-hidden rounded-lg border-gray-200 dark:border-gray-700">
            <TableHeader className="bg-background sticky top-0">
              <TableRow className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.category.category-list.table.header.id')}</TableHead>
                <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.category.category-list.table.header.name')}</TableHead>
                <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.category.category-list.table.header.created')}</TableHead>
                <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.category.category-list.table.header.updated')}</TableHead>
                <TableHead className="flex items-center justify-center px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.category.category-list.table.header.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="h-full w-full overflow-x-auto">
              {loading &&
                Array(5)
                  .fill(0)
                  .map((_, index) => <LoadingSkeleton key={index} />)}
              {!loading && categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="text-muted-foreground flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-semibold">{t('components.admin-ui.category.category-list.messages.no-categories')}</span>
                      <p className="mt-1 text-sm">{t('components.admin-ui.category.category-list.messages.try-adjusting-filters')}</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                categories.length > 0 &&
                categories.map((cat) => (
                  <TableRow key={cat.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                    <TableCell className="text-muted-foreground px-6 text-sm font-normal">{cat.id.slice(-6)}</TableCell>
                    <TableCell className="text-muted-foreground px-6 text-sm font-normal">{cat.name}</TableCell>
                    <TableCell className="text-muted-foreground px-6 text-sm font-normal">{formatDistanceToNow(new Date(cat.createdAt), { addSuffix: true })}</TableCell>
                    <TableCell className="text-muted-foreground px-6 text-sm font-normal">{formatDistanceToNow(new Date(cat.updatedAt), { addSuffix: true })}</TableCell>
                    <TableCell className="px-6">
                      <CategoryListActions cat={cat} />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ConfirmDialog message={t('components.admin-ui.category.category-list.delete.message')} title={t('components.admin-ui.category.category-list.delete.title')} action={t('components.admin-ui.category.category-list.delete.action')} cancel={t('components.admin-ui.category.category-list.delete.cancel')} onConfirm={confirmDelete} />
      {open && <CategoryModal />}
    </div>
  );
};

export default CategoryList;
