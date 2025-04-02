import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, ShoppingCart } from "lucide-react";
import { NodeDetailsDialog } from "./NodeDetailsDialog";
import { NodePurchaseDialog } from "./NodePurchaseDialog";
import { NodeCollateralizeDialog } from "./NodeCollateralizeDialog";
import { UTxO } from "@lucid-evolution/lucid";

export interface AirNodePerformance {
  uptime: number;
  earnings: number;
  roi: number;
}

export interface AirNodeProps {
  name: string;
  image: string;
  location: string;
  airNodeId: string;
  fractions: number;
  performance?: AirNodePerformance;
  className?: string;
  utxo: UTxO;
}

const AirNodeCard: React.FC<AirNodeProps> = ({
  name = "not available",
  location = "not available",
  image = "not available",
  airNodeId = "not available",
  fractions = 0,
  performance = {
    uptime: 99.2,
    earnings: 2.4,
    roi: 18.6,
  },
  utxo,
  className = "",
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [collateralOpen, setCollateralOpen] = useState(false);
  const [shareAmount, setShareAmount] = useState(1);
  return (
    <>
      <Card
        className={`overflow-hidden airnode-card transition-all hover:shadow-lg hover:shadow-ana-purple/10 ${className}`}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={image || "/placeholder.svg"}
            alt={name || "not available"}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
          />
          <div className="absolute top-2 right-2">
            <Badge
              variant="secondary"
              className="bg-ana-darkblue/80 hover:bg-ana-darkblue border-ana-purple/20 text-white"
            >
              {"availableShares"}/{"totalShares"} Available
            </Badge>
          </div>
          <div className="absolute bottom-2 left-2 flex gap-1">
            <Badge
              variant="outline"
              className="bg-green-500/20 text-green-300 border-green-500/30"
            >
              {performance.uptime || "not available"}% Uptime
            </Badge>
            <Badge
              variant="outline"
              className="bg-ana-purple/20 text-ana-purple border-ana-purple/30"
            >
              {performance.roi || "not available"}% ROI
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-white">
                {name || "not available"}
              </h3>
              <p className="text-sm text-white/70">
                {location || "not available"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/70">Price</div>
              <div className="text-lg font-semibold text-white">${"price"}</div>
            </div>
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

      {/* <NodeDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        node={{
          airNodeId,
          name,
          location,
          price,
          totalShares,
          availableShares,
          performance,
        }}
        onBuy={() => {
          setDetailsOpen(false);
          setPurchaseOpen(true);
        }}
        onCollateralize={() => {
          setDetailsOpen(false);
          setCollateralOpen(true);
        }}
      /> */}

      {/* <NodePurchaseDialog
        open={purchaseOpen}
        onOpenChange={setPurchaseOpen}
        node={{ id, name, price, availableShares, performance }}
        shareAmount={shareAmount}
        setShareAmount={setShareAmount}
      /> */}

      {/* <NodeCollateralizeDialog
        open={collateralOpen}
        onOpenChange={setCollateralOpen}
        node={{ id, name, price }}
        shareAmount={shareAmount}
        setShareAmount={setShareAmount}
      /> */}
    </>
  );
};

export default AirNodeCard;
