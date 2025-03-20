
import React, { useState } from "react";
import { 
  Gem, Plus, Split, ListChecks, ArrowRight, CheckCircle, 
  Store, FileCheck, BarChart3 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NetworkBackground from "@/components/NetworkBackground";
import { MintingInterface } from "@/components/admin/MintingInterface";
import { FractionalizationInterface } from "@/components/admin/FractionalizationInterface";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";
import { AdminOverview } from "@/components/admin/AdminOverview";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <NetworkBackground>
      <Navbar />
      
      <div className="pt-24 pb-20 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300 mt-2">Manage AirNode minting, fractionalization, and marketplace listings</p>
            </div>
            <div className="bg-ana-darkblue/50 p-3 rounded-lg mt-4 md:mt-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Gem className="h-4 w-4 text-emerald-400" />
                  <span className="text-white font-medium">326</span>
                  <span className="text-gray-400 text-sm">NFTs</span>
                </div>
                <div className="flex items-center gap-1">
                  <Split className="h-4 w-4 text-purple-400" />
                  <span className="text-white font-medium">2,416</span>
                  <span className="text-gray-400 text-sm">Fractions</span>
                </div>
                <div className="flex items-center gap-1">
                  <Store className="h-4 w-4 text-blue-400" />
                  <span className="text-white font-medium">182</span>
                  <span className="text-gray-400 text-sm">Listed</span>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-10">
            <TabsList className="grid grid-cols-4 max-w-2xl bg-ana-darkblue/50">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 size={16} />
                Overview
              </TabsTrigger>
              <TabsTrigger value="mint" className="flex items-center gap-2">
                <Plus size={16} />
                Mint NFTs
              </TabsTrigger>
              <TabsTrigger value="fractionalize" className="flex items-center gap-2">
                <Split size={16} />
                Fractionalize
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <FileCheck size={16} />
                Activity Log
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <AdminOverview />
            </TabsContent>
            
            <TabsContent value="mint" className="mt-6">
              <MintingInterface />
            </TabsContent>
            
            <TabsContent value="fractionalize" className="mt-6">
              <FractionalizationInterface />
            </TabsContent>
            
            <TabsContent value="activity" className="mt-6">
              <AdminActivityLog />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </NetworkBackground>
  );
};

export default AdminDashboard;
