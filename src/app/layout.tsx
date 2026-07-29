import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SWRegistration } from '@/components/pwa/SWRegistration';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';
import { OfflineIndicator } from '@/components/pwa/OfflineIndicator';

export const metadata: Metadata = {
  title: "BIN FAIZAL'S Mosque Services - Smart TV",
  description: "Enterprise Digital Mosque Management System, Smart TV & Community PWA",
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-[#020617] text-slate-100">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800;900&family=Readex+Pro:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#020617] text-slate-100 min-h-screen antialiased font-sans">
        <PWAInstallPrompt />
        {children}
        <OfflineIndicator />
        <SWRegistration />
      </body>
    </html>
  );
}
