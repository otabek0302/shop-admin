"use client";

import Image from "next/image";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import OrderModal from "./order-modal";
import OrderListActions from "./order-list-actions";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderItem, OrderStatus } from "@/interfaces/orders";
import { getImageUrl } from "@/utils/getImageUrl";
import { Badge } from "@/components/ui/badge";
import { useOrderStore } from "@/store/order-store";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { useConfirmStore } from "@/store/confirm-store";
import { Card } from "@/components/ui/card";
import { IndianRupee } from "lucide-react";

const OrderList = () => {
  const { orders, loading, error, deleteOrder, deleteData } = useOrderStore();
  const { closeConfirm } = useConfirmStore();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-500";
      case OrderStatus.COMPLETED:
        return "bg-green-500";
      case OrderStatus.CANCELLED:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteOrder(deleteData?.id ?? "");
      toast.success("Order deleted successfully");
    } catch {
      toast.error("Failed to delete order");
    }
    closeConfirm();
  };

  if (error) {
    toast.error(error);
  }

  const LoadingSkeleton = () => (
    <TableRow>
      <TableCell className="px-6">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="px-6">
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell className="px-6">
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell className="px-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </TableCell>
      <TableCell className="px-6">
        <Skeleton className="h-4 w-24" />
      </TableCell>
      <TableCell className="px-6 flex justify-center">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="mt-4 h-full rounded-md border">
      <Table className="h-full border-collapse border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <TableHeader className="sticky top-0 bg-background">
          <TableRow className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">ID</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Total</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Status</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Items</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">Created</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center justify-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full">
          {loading &&
            Array(5)
              .fill(0)
              .map((_, index) => <LoadingSkeleton key={index} />)}
          {!loading && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
                  <span className="text-lg font-semibold">No orders found</span>
                  <p className="text-sm mt-1">Try adjusting your filters or adding a new order.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            orders.length > 0 &&
            orders.map((order) => (
              <TableRow key={order.id} className="hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 border-b border-gray-200">
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">#{order.id.slice(-6)}</TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {order.total.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="px-6">
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell className="px-6">
                  <div className="space-y-2">
                    {order.orderItems.map((item: OrderItem) => (
                      <Card key={item.id} className="p-2">
                        <div className="flex items-center gap-2">
                          <div className="relative w-10 h-10 rounded-md overflow-hidden">
                            <Image src={getImageUrl(item.product.image)} alt={item.product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>
                                {item.quantity} × ₹{item.price.toFixed(2)}
                              </span>
                              <span>•</span>
                              <span className="font-medium text-foreground">₹{item.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="px-6 text-sm font-normal text-muted-foreground">{formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}</TableCell>
                <TableCell className="px-6">
                  <OrderListActions order={order} />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <ConfirmDialog message="Are you sure you want to delete this order? This action cannot be undone." title="Delete Order" action="Delete" onConfirm={confirmDelete} />
      <OrderModal />
    </div>
  );
};

export default OrderList;
