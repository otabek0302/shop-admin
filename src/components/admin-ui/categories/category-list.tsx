"use client";

import CategoryModal from "./category-modal";
import CategoryListActions from "./category-list-actions";
import ConfirmDialog from "@/components/ui/confirm-dialog";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { useConfirmStore } from "@/store/confirm-store";
import { useCategoryStore } from "@/store/category-store";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryList = () => {
  const { closeConfirm } = useConfirmStore();
  const { categories, deleteData, deleteCategory, loading } = useCategoryStore();

  const confirmDelete = async () => {
    await deleteCategory(deleteData?.id ?? "");
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
      <TableCell className="px-6 flex justify-center">
        <Skeleton className="h-9 w-9" />
      </TableCell>
    </TableRow>
  );

  return (
    <div className="mt-4 h-full rounded-md border">
      <Table className="h-full border-collapse border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <TableHeader className="sticky top-0 bg-background">
          <TableRow className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">ID</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Name</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Created</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Updated</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full">
          {loading && Array(5).fill(0).map((_, index) => <LoadingSkeleton key={index} />)}
          {!loading && categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                  <span className="text-lg font-semibold">No categories found</span>
                  <p className="text-sm mt-1">Try adjusting your filters or adding a new category.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            categories.length > 0 &&
            categories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 border-b border-gray-200">
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{cat.id.slice(-6)}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{cat.name}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{formatDistanceToNow(new Date(cat.createdAt), { addSuffix: true })}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{formatDistanceToNow(new Date(cat.updatedAt), { addSuffix: true })}</TableCell>
                <TableCell className="px-6">
                  <CategoryListActions cat={cat} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <ConfirmDialog message="Are you sure you want to delete this category ? This action cannot be undone." title="Delete Category" action="Delete" onConfirm={confirmDelete} />
      <CategoryModal />
    </div>
  );
};

export default CategoryList;
