import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SWRegistration } from '@/components/pwa/SWRegistration';

export const metadata: Metadata = {
  title: "BIN FAIZAL'S Mosque Services - Smart Display & PWA",
  description: "Enterprise Digital Mosque Management System, Smart TV Kiosk & Community PWA",
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#064e3b',
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
    <html lang="en">
      <body className="bg-[#030712] text-slate-100 min-h-screen antialiased font-sans">
        {children}
        <SWRegistration />
      </body>
    </html>
  );
}

