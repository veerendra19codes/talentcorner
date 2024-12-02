import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Providers } from "./providers";
import Footer from "@/components/Footer/Footer";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"], display: "swap"  });

export const metadata = {
  title: "Task Manager by Talent Corner",
  description: "Task manager",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <head>
          <link rel="icon" href="/tclogo.png" />
        </head>
    <body className={`${inter.className} h-full w-full flex flex-col bg-gradient-to-r from-[#5E376C] to-[#675080] overflow-x-hidden`}>
      <Providers>
            <Navbar/>
            {children}
            <Footer />
            <Analytics />
      </Providers>
    </body>
    </html>
  );
}
