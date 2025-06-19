
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Web3Provider } from "@/contexts/Web3Context";
import { RainbowKitWrapper } from "@/contexts/RainbowKitProvider";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Dashboard from "./pages/Dashboard";
import Governance from "./pages/Governance";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { useState } from "react";
import LoadingScreen from "./components/loadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [chain, setChain] = useState<"World Mobile Chain" | "Cardano">("World Mobile Chain");
  return (
    <QueryClientProvider client={queryClient}>
      <RainbowKitWrapper projectId="0b7502f59a16b5cc689348f2c3bc8c26">
        <Web3Provider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {!isRedirecting ? (
              <BrowserRouter>
                <Navbar
                  setChain={setChain}
                  chain={chain}
                  setIsRedirecting={setIsRedirecting}
                />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/marketplace" element={<Marketplace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/governance" element={<Governance />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            ) : (
              <LoadingScreen />
            )}
          </TooltipProvider>
        </Web3Provider>
      </RainbowKitWrapper>
    </QueryClientProvider>
  );
};

export default App;
