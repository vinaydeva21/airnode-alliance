
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Zap, BarChart3 } from "lucide-react";
import { AirNodePerformance } from "./AirNodeCard";

export interface NodeDetailsProps {
  airNodeId: string;
  name: string;
  location: string;
  performance: AirNodePerformance;
  totalShares: number;
  availableShares: number;
  price: number;
  children?: React.ReactNode;
}

export function NodeDetailsDialog({
  airNodeId,
  name,
  location,
  performance,
  totalShares,
  availableShares,
  price,
  children,
}: NodeDetailsProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button asChild variant="outline" onClick={() => setOpen(true)}>
        {children}
      </Button>
      <DialogContent className="sm:max-w-[600px] bg-card border border-ana-purple/20 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>AirNode Details - {name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="mb-4">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="rounded-lg overflow-hidden">
              <img
                src="/lovable-uploads/944059d9-4b2a-4ce4-a703-1df8d972e858.png"
                alt={name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">ID</p>
                <p className="font-medium">{airNodeId}</p>
              </div>
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-medium">{location}</p>
              </div>
              <div>
                <p className="text-gray-500">Price per Share</p>
                <p className="font-medium">${price}</p>
              </div>
              <div>
                <p className="text-gray-500">Available Shares</p>
                <p className="font-medium">
                  {availableShares} / {totalShares}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card/40 rounded-lg p-4 text-center">
                <p className="text-gray-500 mb-2">Uptime</p>
                <div className="text-xl font-bold">{performance.uptime}%</div>
              </div>
              <div className="bg-card/40 rounded-lg p-4 text-center">
                <p className="text-gray-500 mb-2">Earnings</p>
                <div className="text-xl font-bold">${performance.earnings}/day</div>
              </div>
              <div className="bg-card/40 rounded-lg p-4 text-center">
                <p className="text-gray-500 mb-2">ROI</p>
                <div className="text-xl font-bold">{performance.roi}%</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="bg-card/40 rounded-lg p-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-400" /> Security Rating
              </h3>
              <p className="text-sm mb-4">
                This AirNode has passed all security audits and is considered safe.
              </p>
              <div className="text-sm grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Last Audit</p>
                  <p className="font-medium">March 15, 2025</p>
                </div>
                <div>
                  <p className="text-gray-500">Security Score</p>
                  <p className="font-medium">95/100</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
