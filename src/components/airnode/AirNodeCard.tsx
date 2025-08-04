
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, ShoppingCart } from "lucide-react";
import { NodeDetailsDialog } from "./NodeDetailsDialog";
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
  onPurchaseClick?: () => void;
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
  onPurchaseClick,
  performance = {
    uptime: 99.2,
    earnings: 2.4,
    roi: 18.6
  }
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [collateralOpen, setCollateralOpen] = useState(false);

  return (
    <>
      <Card className={`overflow-hidden airnode-card transition-all hover:shadow-lg hover:shadow-ana-purple/10 w-full max-w-sm mx-auto ${className}`}>
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl || "/placeholder.svg"} 
            alt={name} 
            className="w-full h-full object-cover object-center transition-transform hover:scale-105 duration-500"
          />
        </div>
        <CardContent className="p-3 sm:p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="min-w-0 flex-1 mr-2">
              <h3 className="font-semibold text-white text-sm sm:text-base truncate">{name}</h3>
              <p className="text-xs sm:text-sm text-white/70 truncate">{location}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs sm:text-sm text-white/70">Price</div>
              <div className="text-base sm:text-lg font-semibold text-white">${price}</div>
            </div>
          </div>
          
          {/* Badges and performance indicators */}
          <div className="flex justify-between items-center mb-3">
            <Badge variant="secondary" className="bg-ana-darkblue/80 hover:bg-ana-darkblue border-ana-purple/20 text-white text-xs">
              {availableShares}/{totalShares} Available
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-4">
            <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
              {performance.uptime}% Uptime
            </Badge>
            <Badge variant="outline" className="bg-ana-purple/20 text-ana-purple border-ana-purple/30 text-xs">
              {performance.roi}% ROI
            </Badge>
          </div>
          
          <div className="flex justify-between gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 bg-transparent border-ana-purple/30 hover:bg-ana-purple/10 flex-1 text-xs sm:text-sm"
              onClick={() => setDetailsOpen(true)}
            >
              <Info size={12} className="sm:w-4 sm:h-4" />
              Details
            </Button>
            <Button 
              size="sm"
              className="gap-1 flex-1 text-xs sm:text-sm"
              onClick={onPurchaseClick}
            >
              <ShoppingCart size={12} className="sm:w-4 sm:h-4" />
              Buy Shares
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <NodeDetailsDialog 
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        node={{id, name, location, price, totalShares, availableShares, performance}}
        onBuy={onPurchaseClick || (() => {})}
        onCollateralize={() => {
          setDetailsOpen(false);
          setCollateralOpen(true);
        }}
      />
      
      <NodeCollateralizeDialog
        open={collateralOpen}
        onOpenChange={setCollateralOpen}
        node={{id, name, price}}
        shareAmount={1}
        setShareAmount={() => {}}
      />
    </>
  );
};

export default AirNodeCard;
