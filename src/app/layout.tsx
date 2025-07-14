import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageContext";
import Footer from "./components/Footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HEVY: Latin America's Digital Growth Accelerator",
  description: "HEVY: Latin America's Digital Growth Accelerator. Estrategia. Tecnología. Resultados. Aceleramos negocios. Redefinimos estrategias. Dominamos el crecimiento digital.",
  keywords: [
    "marketing digital",
    "crecimiento empresarial",
    "ventas",
    "innovación",
    "transformación digital",
    "estrategias digitales",
    "acelerar negocios",
    "consultoría digital",
    "agencia de marketing",
    "growth hacking",
    "acelerador digital",
    "latinoamérica",
    "estrategia digital",
    "crecimiento acelerado"
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "HEVY: Latin America's Digital Growth Accelerator",
    description: "Aceleramos negocios. Redefinimos estrategias. Dominamos el crecimiento digital.",
    url: "https://hevy.la/",
    siteName: "HEVY",
    images: [
      {
        url: "https://hevy.la/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HEVY - Latin America's Digital Growth Accelerator"
      }
    ],
    locale: "es_ES",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "HEVY: Latin America's Digital Growth Accelerator",
    description: "Aceleramos negocios. Redefinimos estrategias. Dominamos el crecimiento digital.",
    images: ["https://hevy.la/og-image.jpg"],
  },
  alternates: {
    canonical: "https://hevy.la/",
    languages: {
      'es': "https://hevy.la/",
      'en': "https://hevy.la/en/",
      'x-default': "https://hevy.la/"
    }
  },
  metadataBase: new URL("https://hevy.la/"),
  viewport: "width=device-width, initial-scale=1"
};

// Structured Data JSON-LD
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HEVY",
  "url": "https://hevy.la/",
  "logo": "https://hevy.la/logo-hevy.png",
  "description": "Latin America's Digital Growth Accelerator. Estrategia. Tecnología. Resultados.",
  "sameAs": [
    "https://www.linkedin.com/company/hevy-growth"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+507-0000-0000",
    "contactType": "Customer Service",
    "areaServed": "Latin America",
    "availableLanguage": "Spanish"
  },
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Latin America"
  },
  "foundingDate": "2024",
  "slogan": "Aceleramos negocios. Redefinimos estrategias. Dominamos el crecimiento digital."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://hevy.la/" />
        <meta name="robots" content="index, follow" />
        
        {/* Hreflang Tags */}
        <link rel="alternate" hrefLang="es" href="https://hevy.la/" />
        <link rel="alternate" hrefLang="en" href="https://hevy.la/en/" />
        <link rel="alternate" hrefLang="x-default" href="https://hevy.la/" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <header role="banner" className="bg-white border-b border-gray-200">
            <nav role="navigation" aria-label="Navegación Principal" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Aquí iría la navegación principal cuando se implemente */}
            </nav>
          </header>

          <main role="main" className="flex-1">
            {children}
          </main>

          <Footer />
        </LanguageProvider>
        
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-0KH5JDRCH8"
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-0KH5JDRCH8');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
