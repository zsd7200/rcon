import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from 'next-themes';
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';
import Header from '@/components/layout/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RCON Web GUI",
  description: "RCON web GUI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-gray-900`}
      >
        <Toaster 
          position="bottom-right"
        />
        <ThemeProvider attribute="class">
          <NextTopLoader
            color="#98C767" 
            showSpinner={false}
          />
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
