"use client";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Web3Provider } from "@/contexts/Web3Context";
import { RainbowKitWrapper } from "@/contexts/RainbowKitProvider";
import "./global.css";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import LoadingScreen from "@/components/loadingScreen";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  return (
    <html lang="en">
      <body>
        {!isRedirecting ? (
          <QueryClientProvider client={queryClient}>
            <RainbowKitWrapper projectId="0b7502f59a16b5cc689348f2c3bc8c26">
              <Web3Provider>
                <Navbar setIsRedirecting={setIsRedirecting} />
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  {children}
                </TooltipProvider>
              </Web3Provider>
            </RainbowKitWrapper>
          </QueryClientProvider>
        ) : (
          <LoadingScreen />
        )}
      </body>
    </html>
  );
}
