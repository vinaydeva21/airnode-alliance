"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Divide, ListPlus, ActivitySquare } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import MintingTab from "@/components/admin/MintingTab";
import FractionalizationTab from "@/components/admin/FractionalizationTab";
import ListingTab from "@/components/admin/ListingTab";
import ActivityTab from "@/components/admin/ActivityTab";
import { useWeb3 } from "@/contexts/Web3Context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("mint");
  const { web3State } = useWeb3();
  const router = useRouter();

  // Simulate admin check - in a real application, you would check if the wallet is an admin
  const isAdmin = web3State.connected;

  if (!isAdmin) {
    // Redirect to home if not connected
    toast.error("Please connect your wallet to access admin features");
    setTimeout(() => router.push("/marketplace"), 1000);
    return null;
  }

  return (
    <NetworkBackground>
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-white/70 mb-8">
            Manage AirNode NFTs, fractionalization, and marketplace listings
          </p>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-10"
          >
            <TabsList className="grid grid-cols-4 max-w-2xl bg-ana-darkblue/50">
              <TabsTrigger value="mint" className="flex items-center gap-2">
                <Package size={16} />
                Mint NFTs
              </TabsTrigger>
              <TabsTrigger
                value="fractionalize"
                className="flex items-center gap-2"
              >
                <Divide size={16} />
                Fractionalize
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <ListPlus size={16} />
                List on Market
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <ActivitySquare size={16} />
                Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mint" className="mt-6">
              <MintingTab />
            </TabsContent>

            <TabsContent value="fractionalize" className="mt-6">
              <FractionalizationTab />
            </TabsContent>

            <TabsContent value="list" className="mt-6">
              <ListingTab />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <ActivityTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </NetworkBackground>
  );
};

export default Admin;
