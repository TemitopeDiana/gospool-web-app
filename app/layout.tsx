import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { Poppins } from 'next/font/google';

import '@/styles/globals.css';

const primaryFont = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Gospool Admin',
    template: '%s | Gospool Admin',
  },
  description:
    'Gospool removes transportation barriers and creates opportunities for fellowship, ensuring every member can participate fully in church life while building stronger community bonds.',
  icons: '/assets/favicon.png',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={`${primaryFont.className} antialiased`}>
        {children}
        <Toaster position="top-center" expand richColors />
      </body>
    </html>
  );
};

export default RootLayout;
