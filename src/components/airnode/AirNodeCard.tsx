
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { MapPin, Settings } from "lucide-react";
import { NodeDetailsDialog } from "./NodeDetailsDialog";
import { NodePurchaseDialog } from "./NodePurchaseDialog";

export interface AirNodePerformance {
  uptime: number;
  earnings: number;
  roi: number;
}

export interface AirNodeCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  imageUrl: string;
  totalShares: number;
  availableShares: number;
  performance: AirNodePerformance;
  isNewlyMinted?: boolean;
  timestamp?: number;
}

const AirNodeCard: React.FC<AirNodeCardProps> = ({
  id,
  name,
  location,
  price,
  imageUrl,
  totalShares,
  availableShares,
  performance,
  isNewlyMinted,
  timestamp
}) => {
  const availabilityPercentage = (availableShares / totalShares) * 100;
  const timeAgo = timestamp ? getTimeAgo(timestamp) : '';

  function getTimeAgo(timestamp: number): string {
    const now = Date.now();
    const secondsAgo = Math.floor((now - timestamp) / 1000);
    
    if (secondsAgo < 60) return 'Just now';
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)}m ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)}h ago`;
    return `${Math.floor(secondsAgo / 86400)}d ago`;
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border border-ana-purple/20 bg-card/30 backdrop-blur-sm">
      <div className="relative">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-40 object-cover"
        />
        {isNewlyMinted && (
          <Badge 
            variant="success" 
            className="absolute top-2 right-2 font-medium"
          >
            New
          </Badge>
        )}
        <div className="absolute bottom-0 w-full px-3 py-2 bg-gradient-to-t from-black/70 to-transparent">
          <h3 className="text-white font-bold">{name}</h3>
          <div className="flex items-center text-white/80 text-xs">
            <MapPin size={12} className="mr-1" /> {location}
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Available</span>
            <span>
              {availableShares.toLocaleString()} / {totalShares.toLocaleString()} shares
            </span>
          </div>
          <Progress value={availabilityPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-card/30 p-2 rounded">
            <div className="text-xs text-muted-foreground">Uptime</div>
            <div className="font-medium">{performance.uptime}%</div>
          </div>
          <div className="bg-card/30 p-2 rounded">
            <div className="text-xs text-muted-foreground">Earnings</div>
            <div className="font-medium">${performance.earnings}/day</div>
          </div>
          <div className="bg-card/30 p-2 rounded">
            <div className="text-xs text-muted-foreground">ROI</div>
            <div className="font-medium">{performance.roi}%</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-sm text-muted-foreground">Price per share</span>
            <div className="font-bold text-lg">${price}</div>
          </div>
          {timeAgo && (
            <Badge variant="outline" className="text-xs">
              {timeAgo}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <NodeDetailsDialog
            airNodeId={id}
            name={name}
            location={location}
            performance={performance}
            totalShares={totalShares}
            availableShares={availableShares}
            price={price}
          >
            <Button size="sm" variant="outline" className="flex-1">
              <Settings size={16} className="mr-1" /> Details
            </Button>
          </NodeDetailsDialog>

          <NodePurchaseDialog
            airNodeId={id}
            name={name}
            price={price}
            availableShares={availableShares}
          >
            <Button size="sm" className="flex-1 bg-ana-purple hover:bg-ana-purple/90">
              Buy Shares
            </Button>
          </NodePurchaseDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default AirNodeCard;
