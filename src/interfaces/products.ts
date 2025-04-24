export interface ProductFormData {
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    category: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    } | string;
    imageBase64: string | null;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    brand: string;
    price: number;
    stock: number;
    sales: number;
    image: {
        url: string;
        public_id: string;
    };
    category: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    } | string;
    orders: object;
    createdAt: string;
    updatedAt: string;
}

export interface ProductCardProps {
    product: Product;
}

export interface ProductImageProps {
    image: File | null;
    setImage: (file: File | null) => void;
    existingImage?: { url: string; public_id: string } | null;
}

export interface ProductCategoryProps {
    category: {
        id: string;
        name: string;
        createdAt: string;
        updatedAt: string;
    } | string;
    setCategory: (value: string) => void;
}