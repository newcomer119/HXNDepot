import { Montserrat, Inter, Cinzel, Lora } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import LoadingOverlayWrapper from "@/components/LoadingOverlayWrapper";

const montserrat = Montserrat({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat"
});

const inter = Inter({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter"
});

const cinzel = Cinzel({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel"
});

const lora = Lora({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700"],
  variable: "--font-lora"
});

export const metadata = {
  title: "HXN Building Depot",
  description: "Online Store For 3d Material ",
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/favicon.ico" sizes="any" />
          <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
          <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
        </head>
        <body className={`${montserrat.variable} ${inter.variable} ${cinzel.variable} ${lora.variable} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>
            <CartProvider>
              <LoadingOverlayWrapper />
              {children}
            </CartProvider>
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
