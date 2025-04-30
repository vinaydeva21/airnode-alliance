
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const MarketplaceStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-ana-darkblue/30 border-ana-purple/20">
        <CardContent className="p-4">
          <div className="text-white/60 text-sm">Total AirNodes</div>
          <div className="text-xl font-bold text-white mt-1">24 Nodes</div>
        </CardContent>
      </Card>
      <Card className="bg-ana-darkblue/30 border-ana-purple/20">
        <CardContent className="p-4">
          <div className="text-white/60 text-sm">Average ROI</div>
          <div className="text-xl font-bold text-green-400 mt-1">19.8%</div>
        </CardContent>
      </Card>
      <Card className="bg-ana-darkblue/30 border-ana-purple/20">
        <CardContent className="p-4">
          <div className="text-white/60 text-sm">Total Shares</div>
          <div className="text-xl font-bold text-white mt-1">42,500</div>
        </CardContent>
      </Card>
      <Card className="bg-ana-darkblue/30 border-ana-purple/20">
        <CardContent className="p-4">
          <div className="text-white/60 text-sm">ANA Token Price</div>
          <div className="text-xl font-bold text-white mt-1">$0.52 <span className="text-green-400 text-sm">+3.8%</span></div>
        </CardContent>
      </Card>
    </div>
  );
};
