import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { MachineContextProvider } from "@/context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarContextProvider } from "@/context/sidebar.context";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Back Office | CWEETLABS-LOCAL",
  description: "Local system for manage Cash Infinity Machine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen overflow-hidden`}>
        <SessionProvider>
          <SidebarContextProvider>
            <MachineContextProvider>
              <TooltipProvider>
                <Toaster />
                {children}
              </TooltipProvider>
            </MachineContextProvider>
          </SidebarContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
