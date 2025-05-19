'use client';

import Image from 'next/image';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import OrderModal from './order-modal';
import OrderListActions from './order-list-actions';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderItem, OrderStatus } from '@/interfaces/orders';
import { getImageUrl } from '@/utils/getImageUrl';
import { Badge } from '@/components/ui/badge';
import { useOrderStore } from '@/store/order-store';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow, format } from 'date-fns';
import { useConfirmStore } from '@/store/confirm-store';
import { IndianRupee, ChevronDownIcon, Clock, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const OrderList = () => {
  const { t } = useTranslation();
  const { orders, loading, error, deleteOrder, deleteData, updateOrder } = useOrderStore();
  const { closeConfirm } = useConfirmStore();

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case OrderStatus.PROCESSING:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case OrderStatus.COMPLETED:
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case OrderStatus.CANCELLED:
        return 'bg-red-500/10 text-red-600 dark:text-red-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return '⏳';
      case OrderStatus.PROCESSING:
        return '🔄';
      case OrderStatus.COMPLETED:
        return '✅';
      case OrderStatus.CANCELLED:
        return '❌';
      default:
        return '•';
    }
  };

  const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return t('components.admin-ui.order.order-list.status.pending');
      case OrderStatus.PROCESSING:
        return t('components.admin-ui.order.order-list.status.processing');
      case OrderStatus.COMPLETED:
        return t('components.admin-ui.order.order-list.status.completed');
      case OrderStatus.CANCELLED:
        return t('components.admin-ui.order.order-list.status.cancelled');
      default:
        return 'Unknown status';
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrder(orderId, { status: newStatus });
      toast.success(t('components.admin-ui.order.status-updated'));
    } catch (error) {
      console.error(error);
      toast.error(t('components.admin-ui.order.status-updated-failed'));
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteOrder(deleteData?.id ?? '');
      toast.success(t('components.admin-ui.order.order-deleted'));
    } catch {
      toast.error(t('components.admin-ui.order.order-deleted-failed'));
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
      <TableCell className="flex justify-center px-6">
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 w-9" />
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="mt-4 h-full rounded-md border print:hidden">
      <Table className="h-full border-collapse overflow-hidden rounded-lg border-gray-200 dark:border-gray-700">
        <TableHeader className="bg-background sticky top-0">
          <TableRow className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.order.order-list.table.header.id')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.order.order-list.table.header.total')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.order.order-list.table.header.status')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.order.order-list.table.header.items')}</TableHead>
            <TableHead className="px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.order.order-list.table.header.created')}</TableHead>
            <TableHead className="flex items-center justify-center px-6 text-sm font-bold text-gray-700 dark:text-gray-300">{t('components.admin-ui.order.order-list.table.header.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="h-full">
          {loading &&
            Array(5).fill(0).map((_, index) => <LoadingSkeleton key={index} />)}
          {!loading && orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                <div className="text-muted-foreground flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-semibold">{t('components.admin-ui.order.order-list.messages.no-orders')}</span>
                  <p className="mt-1 text-sm">{t('components.admin-ui.order.order-list.messages.try-adjusting-filters')}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            orders.length > 0 &&
            orders.map((order) => (
              <TableRow key={order.id} className="border-b border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                <TableCell className="text-muted-foreground px-6 text-sm font-normal">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="font-mono">#{order.id?.slice(-6)}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Order ID: {order.id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell className="text-muted-foreground px-6 text-sm font-normal">
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-4 w-4" />
                    {order.total.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="px-6">
                  <Select defaultValue={order.status} onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}>
                    <SelectTrigger className={cn('w-[140px] border-none p-0 pr-2 transition-colors outline-none', getStatusColor(order.status))}>
                      <SelectValue className="w-full border-none outline-none">
                        <Badge className={cn('flex w-full items-center gap-1.5 border-none transition-colors outline-none', getStatusColor(order.status))}>
                          <span>{getStatusIcon(order.status)}</span>
                          {order.status}
                        </Badge>
                        <ChevronDownIcon className="text-muted-foreground size-4" />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(OrderStatus).map((status) => (
                        <SelectItem key={status} value={status}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <Badge className={cn('flex items-center gap-1.5 transition-colors', getStatusColor(status))}>
                                  <span>{getStatusIcon(status)}</span>
                                  {status}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getStatusDescription(status)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="px-6">
                  <div className="flex max-w-[120px] gap-2 overflow-y-auto">
                    {order.orderItems.map((item: OrderItem) => (
                      <TooltipProvider key={item.id}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="group relative p-2">
                              <div className="relative h-10 w-10 overflow-hidden rounded-md">
                                <Image src={getImageUrl(item.product.image)} alt={item.product.name} fill className="object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                  <span className="text-xs font-medium text-white">{item.quantity}×</span>
                                </div>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="flex flex-col gap-1">
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-muted-foreground text-sm">
                                {item.quantity} × ₹{item.price.toFixed(2)} = ₹{item.total.toFixed(2)}
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground px-6 text-sm font-normal">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {order.createdAt ? formatDistanceToNow(new Date(order.createdAt), { addSuffix: true }) : 'N/A'}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="flex flex-col gap-1">
                          <p className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {order.createdAt ? format(new Date(order.createdAt), 'PPpp') : 'N/A'}
                          </p>
                          <p className="text-muted-foreground text-sm">Order ID: {order.id}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
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
