
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, ShoppingCart } from "lucide-react";
import { NodeDetailsDialog } from "./NodeDetailsDialog";
import { NodePurchaseDialog } from "./NodePurchaseDialog";
import { NodeCollateralizeDialog } from "./NodeCollateralizeDialog";

export interface AirNodePerformance {
  uptime: number;
  earnings: number;
  roi: number;
}

export interface AirNodeProps {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  totalShares: number;
  availableShares: number;
  className?: string;
  performance?: AirNodePerformance;
}

const AirNodeCard: React.FC<AirNodeProps> = ({
  id,
  name,
  location,
  price,
  imageUrl,
  totalShares,
  availableShares,
  className = "",
  performance = {
    uptime: 99.2,
    earnings: 2.4,
    roi: 18.6
  }
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [collateralOpen, setCollateralOpen] = useState(false);
  const [shareAmount, setShareAmount] = useState(1);

  return (
    <>
      <Card className={`overflow-hidden airnode-card transition-all hover:shadow-lg hover:shadow-ana-purple/10 ${className}`}>
        <div className="relative h-56 overflow-hidden">
          <img 
            src={imageUrl || "/placeholder.svg"} 
            alt={name} 
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-white">{name}</h3>
              <p className="text-sm text-white/70">{location}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/70">Price</div>
              <div className="text-lg font-semibold text-white">${price}</div>
            </div>
          </div>
          
          {/* Moved badges and performance indicators here */}
          <div className="flex justify-between items-center mb-3">
            <Badge variant="secondary" className="bg-ana-darkblue/80 hover:bg-ana-darkblue border-ana-purple/20 text-white">
              {availableShares}/{totalShares} Available
            </Badge>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">
              {performance.uptime}% Uptime
            </Badge>
            <Badge variant="outline" className="bg-ana-purple/20 text-ana-purple border-ana-purple/30">
              {performance.roi}% ROI
            </Badge>
          </div>
          
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 bg-transparent border-ana-purple/30 hover:bg-ana-purple/10"
              onClick={() => setDetailsOpen(true)}
            >
              <Info size={14} />
              Details
            </Button>
            <Button 
              size="sm"
              className="gap-1"
              onClick={() => setPurchaseOpen(true)}
            >
              <ShoppingCart size={14} />
              Buy Shares
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <NodeDetailsDialog 
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        node={{id, name, location, price, totalShares, availableShares, performance}}
        onBuy={() => {
          setDetailsOpen(false);
          setPurchaseOpen(true);
        }}
        onCollateralize={() => {
          setDetailsOpen(false);
          setCollateralOpen(true);
        }}
      />
      
      <NodePurchaseDialog
        open={purchaseOpen}
        onOpenChange={setPurchaseOpen}
        node={{id, name, price, availableShares, performance}}
        shareAmount={shareAmount}
        setShareAmount={setShareAmount}
      />
      
      <NodeCollateralizeDialog
        open={collateralOpen}
        onOpenChange={setCollateralOpen}
        node={{id, name, price}}
        shareAmount={shareAmount}
        setShareAmount={setShareAmount}
      />
    </>
  );
};

export default AirNodeCard;
