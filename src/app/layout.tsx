import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ThemeClientProvider from '@/components/theme-provider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ハゲタカゲーム",
  description: "ハゲタカのえじきカードゲーム",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeClientProvider>
          {children}
        </ThemeClientProvider>
      </body>
    </html>
  );
}
