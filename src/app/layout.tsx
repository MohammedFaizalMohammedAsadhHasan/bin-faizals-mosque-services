import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "BIN FAIZAL'S Mosque Services - Smart Display & PWA",
  description: "Enterprise Digital Mosque Management System, Smart TV Kiosk & Community PWA",
  manifest: '/manifest.json',
  themeColor: '#064e3b',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-[#05080e] text-slate-100 min-h-screen antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
