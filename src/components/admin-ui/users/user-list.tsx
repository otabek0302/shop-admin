"use client";

import UserModal from "./user-modal";
import UserListActions from "./user-list-action";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { formatDistanceToNow } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserStore } from "@/store/user-store";
import { useConfirmStore } from "@/store/confirm-store";

export default function UserList() {
  const { closeConfirm } = useConfirmStore();
  const { users, deleteData, deleteUser, loading } = useUserStore();

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
      <Table className="h-full border-collapse border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <TableHeader className="sticky top-0 bg-background">
          <TableRow className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">ID</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Name</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Email</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Role</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300 hidden md:table-cell">Created</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300 text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full">
          {loading && Array(5).fill(0).map((_, index) => <LoadingSkeleton key={index} />)}
          {!loading && users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                  <span className="text-lg font-semibold">No users found</span>
                  <p className="text-sm mt-1">Try adjusting your filters or adding a new user.</p>
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

      <ConfirmDialog message="Are you sure you want to delete this user ? This action cannot be undone." title="Delete User" action="Delete" onConfirm={confirmDelete} />
      <UserModal />
    </div>
  );
}
