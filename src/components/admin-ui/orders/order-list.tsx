"use client";

import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { OrderItem, OrderListProps, OrderStatus } from "@/interfaces/orders";
import { getImageUrl } from "@/utils/getImageUrl";
import { Badge } from "@/components/ui/badge";

const OrderList = ({ orders, onEdit, onDelete }: OrderListProps & { onDelete: (id: string) => void }) => {
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

  return (
    <div className="mt-4 h-full rounded-md border overflow-auto">
      {orders?.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">No orders found.</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-full">
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">#{order.id.slice(-6)}</TableCell>
                <TableCell className="font-medium">₹{order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                </TableCell>
                <TableCell className="space-y-1">
                  {order.orderItems.map((item: OrderItem) => (
                    <div key={item.id} className="flex items-center gap-2 text-sm">
                      <Image src={getImageUrl(item.product.image)} alt="Product" width={28} height={28} className="rounded border" />
                      <div>{item.product.name}</div>
                      <div className="text-muted-foreground ml-auto">
                        {item.quantity} × ₹{item.product.price}
                      </div>
                    </div>
                  ))}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(order)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => onDelete(order.id)}>
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default OrderList;
