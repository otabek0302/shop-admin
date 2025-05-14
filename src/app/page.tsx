'use client';

import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';
import ProductList from '@/components/client-ui/product-list';
import Summary from '@/components/client-ui/summary';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/order-store';
import { Product } from '@/interfaces/products';
import { OrderStatus } from '@/interfaces/orders';
import { toast } from 'sonner';

const Home = () => {
  const router = useRouter();
  
  const { status } = useSession();
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { createOrder } = useOrderStore();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (status === 'loading' || loading) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
  }

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity === 0) {
        return prev.filter((item) => item.product.id !== productId);
      }
      return prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const handleCreateOrder = async () => {
    try {
      if (cartItems.length === 0) {
        toast.error('Your cart is empty!');
        return;
      }

      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        status: OrderStatus.PENDING
      };

      await createOrder(orderData);
      setCartItems([]); // Clear cart after successful order
      toast.success('Order created successfully!');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create order. Please try again.');
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <main className="h-screen">
      <Header />
      <section className="py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-[calc(100vh-215px)] flex-col md:flex-row gap-4">
            <div className="max-w-full flex-1">
              <ProductList
                products={products}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onUpdateQuantity={handleUpdateQuantity}
              />
            </div>
            <div className="max-w-md flex-1">
              <Summary
                cartItems={cartItems}
                subtotal={subtotal}
                onUpdateQuantity={handleUpdateQuantity}
                onCreateOrder={handleCreateOrder}
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default Home;
