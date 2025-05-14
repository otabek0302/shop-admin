export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export interface OrderProduct {
    id: string;
    name: string;
    price: number;
    image: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    productId: string;
    product: OrderProduct;
    quantity: number;
    price: number;
    total: number;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    id: string;
    total: number;
    status: OrderStatus;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateOrderDTO {
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    status: OrderStatus;
}

export interface UpdateOrderDTO {
    items?: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    status?: OrderStatus;
}

export interface OrderTableToolbarProps {
    search: string;
    setSearch: (search: string) => void;
    onAddClick: () => void;
}

export interface OrderListActionsProps {
    order: Order;
    onInvoiceClick?: (order: Order) => void;
}