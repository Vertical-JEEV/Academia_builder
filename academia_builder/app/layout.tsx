import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";

import Provider from "@/redux/provider";

import { Navbar, Footer } from "@/components/common";

import { Setup } from "@/components/utils";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Academia Builder",
  description: "Explore interactive courses and build your academic skills with Academia Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider>
          <Setup />
          <Navbar />
          <div>{children}</div>
          <Footer />
        </Provider>
  
      </body>
    </html>
  );
}
