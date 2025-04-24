export interface OrderItem {
    id?: string;
    orderId?: string;
    productId: string;
    product: {
        id: string;
        name: string;
        price: number;
        image: {
            url: string;
            public_id: string;
        };
    };
    quantity: number;
    price: number;
    total: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface Order {
    id: string;
    orderItems: OrderItem[];
    total: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
}

export enum OrderStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}

export interface OrderTableToolbarProps {
    search: string;
    setSearch: (search: string) => void;
    onAddClick: () => void;
}

export interface OrderModalProps {
    open: boolean;
    onClose: () => void;
    initialData?: Order;
    onSuccess: () => void;
}

export interface OrderListProps {
    orders: Order[];
    onEdit: (order: Order) => void;
} 