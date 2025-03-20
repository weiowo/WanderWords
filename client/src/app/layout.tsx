import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ClerkProvider } from '@clerk/nextjs';
import QueryProvider from './providers/QueryProvider';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const sora = Sora({
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: 'WanderWords - Unleash Your Creativity, Share Your Story',
  description:
    'Inspiring Stories and Insights on Travel, Tech, and Life’s Adventures',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <QueryProvider>
        <html lang="en">
          <body className={`${sora.className} antialiased`}>
            <ToastContainer position="bottom-right" />
            <Navbar />
            <div className="flex items-center justify-center px-4 md:px-8 lg:px-12 2xl:px-64">
              <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
            </div>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
