'use client';

import CategoryModal from './category-modal';
import CategoryListActions from './category-list-actions';
import ConfirmDialog from '@/components/ui/confirm-dialog';

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
    await deleteCategory(deleteData?.id ?? '');
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
    <div className="mt-4 h-full rounded-md border">
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
        <TableBody className="h-full">
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

      <ConfirmDialog message="Are you sure you want to delete this category ? This action cannot be undone." title="Delete Category" action="Delete" onConfirm={confirmDelete} />
      {open && <CategoryModal />}
    </div>
  );
};

export default CategoryList;
