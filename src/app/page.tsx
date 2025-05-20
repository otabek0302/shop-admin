'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ProductList from '@/components/client-ui/product-list';
import Summary from '@/components/client-ui/summary';
import Loading from './loading';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ProductToolbar } from '@/components/client-ui/product-toolbar';

export default function Home() {
  const router = useRouter();

  const { status } = useSession();

  if (status === 'loading') return <Loading />;
  if (status === 'unauthenticated') router.push('/login');

  return (
    <main className="flex h-screen flex-col">
      <div className="container mx-auto px-4">
        <Header />
      </div>

      <section className="flex-1 py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-full flex-col gap-4 lg:h-[calc(100vh-215px)] lg:flex-row">
            <div className="w-full h-full flex-1 lg:max-w-full overflow-y-auto no-scrollbar">
              <ProductToolbar />
              <ProductList />
            </div>
            <div className="w-full h-full flex-1 lg:max-w-md overflow-y-auto no-scrollbar">
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
