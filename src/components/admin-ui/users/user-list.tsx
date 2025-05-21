"use client";

import UserModal from "./user-modal";
import UserListActions from "./user-list-action";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { formatDistanceToNow } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserStore } from "@/store/user-store";
import { useConfirmStore } from "@/store/confirm-store";
import { useTranslation } from 'react-i18next';
import { useModalStore } from '@/store/modal-store';

export default function UserList() {
  const { closeConfirm } = useConfirmStore();
  
  const { open } = useModalStore();
  const { users, deleteData, deleteUser, loading } = useUserStore();
  const { t } = useTranslation();

  const confirmDelete = async () => {
    await deleteUser(deleteData?.id ?? "");
    closeConfirm();
  };

  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell className="px-6"><Skeleton className="h-4 w-16" /></TableCell>
      <TableCell className="px-6"><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell className="px-6"><Skeleton className="h-4 w-40" /></TableCell>
      <TableCell className="px-6"><Skeleton className="h-4 w-20" /></TableCell>
      <TableCell className="px-6 hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
      <TableCell className="px-6 flex justify-center"><Skeleton className="h-9 w-9" /></TableCell>
    </TableRow>
  );

  return (
    <div className="mt-4 h-full rounded-md border">
      {/* Mobile Card/List Layout */}
      <div className="block md:hidden">
        {loading && Array(5).fill(0).map((_, idx) => (
          <div key={idx} className="mb-4 rounded-lg border p-4 shadow-sm bg-white dark:bg-gray-900">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-9 w-9" />
            </div>
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
        {!loading && users.length === 0 && (
          <div className="h-24 flex flex-col items-center justify-center text-center text-muted-foreground">
            <span className="text-lg font-semibold">{t('components.admin-ui.user.user-list.messages.no-users')}</span>
            <p className="mt-1 text-sm">{t('components.admin-ui.user.user-list.messages.try-adjusting-filters')}</p>
          </div>
        )}
        {!loading && users.length > 0 && users.map(user => (
          <div key={user.id} className="mb-4 rounded-lg border p-4 shadow-md bg-white dark:bg-gray-900 transition hover:shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-base text-gray-800 dark:text-gray-100">{user.name}</span>
              <UserListActions user={user} />
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <div><span className="font-medium">{t('components.admin-ui.user.user-list.table.header.email')}:</span> {user.email}</div>
              <div><span className="font-medium">{t('components.admin-ui.user.user-list.table.header.role')}:</span> {user.role}</div>
              <div><span className="font-medium">{t('components.admin-ui.user.user-list.table.header.created')}:</span> {formatDistanceToNow(new Date(user.createdAt ?? ''), { addSuffix: true })}</div>
              <div><span className="font-medium">{t('components.admin-ui.user.user-list.table.header.id')}:</span> {user.id.slice(-6)}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop Table Layout */}
      <div className="hidden md:block">
        <Table className="h-full border-collapse border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <TableHeader className="sticky top-0 bg-background">
            <TableRow className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
              <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t("components.admin-ui.user.user-list.table.header.id")}</TableHead>
              <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t("components.admin-ui.user.user-list.table.header.name")}</TableHead>
              <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t("components.admin-ui.user.user-list.table.header.email")}</TableHead>
              <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t("components.admin-ui.user.user-list.table.header.role")}</TableHead>
              <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300 hidden md:table-cell">{t("components.admin-ui.user.user-list.table.header.created")}</TableHead>
              <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300 text-center">{t("components.admin-ui.user.user-list.table.header.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-full">
            {loading && Array(5).fill(0).map((_, index) => <LoadingSkeleton key={index} />)}
            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                    <span className="text-lg font-semibold">{t("components.admin-ui.user.user-list.messages.no-users")}</span>
                    <p className="text-sm mt-1">{t("components.admin-ui.user.user-list.messages.try-adjusting-filters")}</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
            {!loading && users.length > 0 && users.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 border-b border-gray-200">
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{user.id.slice(-6)}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{user.name}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{user.email}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{user.role}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground hidden md:table-cell">{formatDistanceToNow(new Date(user.createdAt ?? ""), { addSuffix: true })}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground text-right">
                  <UserListActions user={user} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog message={t("components.admin-ui.user.user-list.delete.message")} title={t("components.admin-ui.user.user-list.delete.title")} action={t("components.admin-ui.user.user-list.delete.action")} cancel={t("components.admin-ui.user.user-list.delete.cancel")} onConfirm={confirmDelete} />
      {open && <UserModal />}
    </div>
  );
}
