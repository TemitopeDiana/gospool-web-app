import type { Metadata } from 'next';

import { Poppins } from 'next/font/google';

import '@/styles/globals.css';

const primaryFont = Poppins({
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Gospool Admin',
    template: '%s | Gospool Admin',
  },
  description: 'We are going to ask for this later',
  icons: '/assets/favicon.png',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${primaryFont.className} antialiased`}>{children}</body>
    </html>
  );
}
