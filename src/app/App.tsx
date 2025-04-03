"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/contexts/Web3Context";
import { RainbowKitWrapper } from "@/contexts/RainbowKitProvider";
import Index from "../airnode_pages/Index";
import Marketplace from "../airnode_pages/Marketplace";
import Dashboard from "../airnode_pages/Dashboard";
import Governance from "../airnode_pages/Governance";
import Admin from "../airnode_pages/Admin";
// import NotFound from "../pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RainbowKitWrapper projectId="0b7502f59a16b5cc689348f2c3bc8c26">
      <Web3Provider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/governance" element={<Governance />} />
              <Route path="/admin" element={<Admin />} />
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </Web3Provider>
    </RainbowKitWrapper>
  </QueryClientProvider>
);

export default App;
