import type { Metadata } from 'next';

import { IBM_Plex_Sans } from 'next/font/google';

import '@/styles/globals.css';

const primaryFont = IBM_Plex_Sans({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});


export const metadata: Metadata = {
  title: 'Gospool Admin',
  description: 'We are going to ask for this later',
  icons: '/assets/favicon.png'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${primaryFont.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
