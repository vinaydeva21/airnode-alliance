
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Lock } from "lucide-react";
import { AirNodePerformance } from "./AirNodeCard";

interface NodeDetailsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: {
    id: string;
    name: string;
    location: string;
    price: number;
    totalShares: number;
    availableShares: number;
    performance: AirNodePerformance;
  };
  onBuy: () => void;
  onCollateralize: () => void;
}

export const NodeDetailsDialog: React.FC<NodeDetailsProps> = ({
  open,
  onOpenChange,
  node,
  onBuy,
  onCollateralize
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-ana-darkblue border-ana-purple/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>{node.name} Details</DialogTitle>
          <DialogDescription className="text-white/70">
            AirNode specifications and performance metrics
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="specs" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4 bg-ana-darkblue/50">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
          </TabsList>
          
          <TabsContent value="specs" className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-white/70">Location:</div>
              <div>{node.location}</div>
              
              <div className="text-white/70">Coverage:</div>
              <div>2.5 km radius</div>
              
              <div className="text-white/70">Technology:</div>
              <div>5G / LoRaWAN</div>
              
              <div className="text-white/70">Installation Date:</div>
              <div>June 2023</div>
              
              <div className="text-white/70">Total Shares:</div>
              <div>{node.totalShares}</div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-white/70">Uptime:</div>
              <div className="text-green-400">{node.performance.uptime}%</div>
              
              <div className="text-white/70">Active Users:</div>
              <div>1,280</div>
              
              <div className="text-white/70">Data Transfer:</div>
              <div>4.8 TB/month</div>
              
              <div className="text-white/70">Maintenance:</div>
              <div className="text-green-400">No issues</div>
            </div>
          </TabsContent>
          
          <TabsContent value="financials" className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-white/70">Share Price:</div>
              <div>${node.price}</div>
              
              <div className="text-white/70">Monthly Earnings:</div>
              <div>${node.performance.earnings}/share</div>
              
              <div className="text-white/70">Annual ROI:</div>
              <div className="text-green-400">{node.performance.roi}%</div>
              
              <div className="text-white/70">Available Shares:</div>
              <div>{node.availableShares}</div>
              
              <div className="text-white/70">Collateral Value:</div>
              <div>${(node.price * 0.7).toFixed(2)}/share</div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 border-ana-purple/30 hover:bg-ana-purple/10"
            onClick={onBuy}
          >
            <ShoppingCart size={14} />
            Buy
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
            onClick={onCollateralize}
          >
            <Lock size={14} />
            Collateralize
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
