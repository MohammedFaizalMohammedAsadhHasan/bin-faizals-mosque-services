// src/app/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Font stylesheet used by the project */}
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600;700;800;900&family=Readex+Pro:wght@300;400;5 00;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-[#020617] text-slate-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
