import AppSidebar from '@/components/layout/app-sidebar';
import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

import { SidebarProvider } from '@/components/ui/sidebar';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.user.role?.toLowerCase() !== 'admin') {
    redirect('/');
  }

  return (
    <section className="flex w-full">
      <SidebarProvider>
        <AppSidebar />
        <section className="flex-1">
          <Header />
          {children}
          <Footer />
        </section>
      </SidebarProvider>
    </section>
  );
}
