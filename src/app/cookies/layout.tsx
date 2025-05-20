import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="container mx-auto px-4 md:px-6">
        <Header />
      </div>
      <section className="min-h-svh">{children}</section>
      <div className="container mx-auto px-4 md:px-6">
        <Footer />
      </div>
    </>
  );
}
