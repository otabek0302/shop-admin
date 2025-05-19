import type { Metadata } from "next";
import { headers } from 'next/headers';

import { Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/utils/provider";
import { I18nProvider } from "@/components/i18n-provider";
import { Toaster } from "sonner";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Import translations directly
import enTranslations from '@/locales/en.json';
import ruTranslations from '@/locales/ru.json';
import uzTranslations from '@/locales/uz.json';

// Define the translation type
type TranslationType = {
  components: {
    layout: {
      header: {
        title: string;
        description: string;
      }
    }
  }
}

// Function to get the current language from headers
async function getLanguage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'en';
  return acceptLanguage.split(',')[0].split('-')[0];
}

// Get translations based on language
function getTranslations(lang: string): TranslationType {
  switch (lang) {
    case 'ru':
      return ruTranslations as TranslationType;
    case 'uz':
      return uzTranslations as TranslationType;
    default:
      return enTranslations as TranslationType;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguage();
  const translations = getTranslations(lang);
  
  return {
    title: translations.components.layout.header.title,
    description: translations.components.layout.header.description,
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <I18nProvider>
              {children}
              <Toaster position="top-right" richColors />
            </I18nProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
