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
      <head>
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </head>
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
