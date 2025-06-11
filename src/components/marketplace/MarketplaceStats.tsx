
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const MarketplaceStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <Card className="bg-white border-mono-gray-200 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="text-mono-gray-500 text-sm font-medium tracking-tight">Total AirNodes</div>
          <div className="text-2xl font-semibold text-mono-gray-900 mt-2 tracking-tight">24 Nodes</div>
        </CardContent>
      </Card>
      <Card className="bg-white border-mono-gray-200 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="text-mono-gray-500 text-sm font-medium tracking-tight">Average ROI</div>
          <div className="text-2xl font-semibold text-mono-gray-900 mt-2 tracking-tight">19.8%</div>
        </CardContent>
      </Card>
      <Card className="bg-white border-mono-gray-200 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="text-mono-gray-500 text-sm font-medium tracking-tight">Total Shares</div>
          <div className="text-2xl font-semibold text-mono-gray-900 mt-2 tracking-tight">42,500</div>
        </CardContent>
      </Card>
      <Card className="bg-white border-mono-gray-200 hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="text-mono-gray-500 text-sm font-medium tracking-tight">ANA Token Price</div>
          <div className="text-2xl font-semibold text-mono-gray-900 mt-2 tracking-tight">
            $0.52 <span className="text-mono-gray-600 text-sm font-normal">+3.8%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
