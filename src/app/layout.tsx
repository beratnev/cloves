import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingAssistant } from "@/components/ai/floating-assistant";
import { AuthProvider } from "@/components/auth-provider";
import { Libre_Baskerville } from "next/font/google";

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
});

export const metadata: Metadata = {
  title: "Clove's │ Skin & Body Care",
  description: "Discover premium skincare, body care, fragrances, and more at Clove's. Your destination for timeless beauty with AI-powered personalized advice.",
  keywords: "beauty, skincare, body care, cosmetics, fragrance, premium beauty, luxury skincare, AI beauty assistant",
  authors: [{ name: "Clove's" }],
  creator: "Clove's",
  publisher: "Clove's",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://ai-shop.beratnev.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-shop.beratnev.com',
    title: "Clove's │ Skin & Body Care",
    description: 'Discover premium skincare, body care, fragrances, and more at Clove\'s. Your destination for timeless beauty.',
    siteName: "Clove's",
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "Clove's - Premium Beauty",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Clove's │ Skin & Body Care",
    description: 'Discover premium skincare, body care, fragrances, and more at Clove\'s.',
    images: ['/twitter-image.jpg'],
    creator: '@clovebeauty',
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased ${libreBaskerville.variable}`}>
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="ai-shop-theme">
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
            <FloatingAssistant />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
