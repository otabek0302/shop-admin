'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductList from '@/components/client-ui/product-list';
import Summary from '@/components/client-ui/summary';
import Loading from './loading';

import { useSession } from 'next-auth/react';
import { useProductStore } from '@/store/product-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Home() {
  const router = useRouter();
  const { status } = useSession();
  const { loading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  if (status === 'loading' || loading) return <Loading />;
  if (status === 'unauthenticated') router.push('/login');

  return (
    <main className="flex h-screen flex-col">
      <div className="container mx-auto px-4">
        <Header />
      </div>

      <section className="flex-1 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-[calc(100vh-215px)] flex-col gap-4 md:flex-row">
            <div className="max-w-full flex-1">
              <ProductList />
            </div>
            <div className="max-w-md flex-1">
              <Summary />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <Footer />
      </div>
    </main>
  );
}