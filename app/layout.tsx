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
  description: 'We are going to ask for this later',
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
