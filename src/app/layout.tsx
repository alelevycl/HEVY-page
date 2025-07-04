import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "we are HEVY",
  description: "Impulsa tu empresa con estrategias digitales, marketing innovador, ventas y crecimiento acelerado. HEVY es tu socio para la transformación y el éxito online.",
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
    "growth hacking"
  ],
  openGraph: {
    title: "we are HEVY",
    description: "Impulsa tu empresa con estrategias digitales, marketing innovador, ventas y crecimiento acelerado. HEVY es tu socio para la transformación y el éxito online.",
    url: "https://iamhevy.com/",
    siteName: "HEVY",
    images: [
      {
        url: "/hevy_growth_logo.jpg",
        width: 400,
        height: 400,
        alt: "HEVY logo"
      }
    ],
    locale: "es_ES",
    type: "website"
  },
  metadataBase: new URL("https://iamhevy.com/")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
