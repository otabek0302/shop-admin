import type { Metadata } from "next";

import { Poppins } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import AppSidebar from "@/components/layout/app-sidebar";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shop Store",
  description: "Shop Store is a platform for buying and selling products and services.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            <main className="w-full flex flex-row">
              <AppSidebar />
              <div className="flex-1">
                <Header />
                {children}
                <Footer />
              </div>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
