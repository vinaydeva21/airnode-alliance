
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LendingOption {
  id: string;
  title: string;
  description: string;
  apy: string;
  ltv: string;
  term: string;
  icon: React.ReactNode;
}

interface DeFiServicesTabProps {
  lendingOptions: LendingOption[];
}

export const DeFiServicesTab: React.FC<DeFiServicesTabProps> = ({ lendingOptions }) => {
  const handleLendingCardClick = (option: LendingOption) => {
    toast.info(`Opening ${option.title}`, {
      description: `Current APY: ${option.apy}`
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">DeFi Services</h2>
        <p className="text-white/70 mt-2">
          Unlock the financial potential of your AirNode NFTs and ANA tokens
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lendingOptions.map(option => (
          <Card 
            key={option.id} 
            className="bg-ana-darkblue/30 border-ana-purple/20 hover:border-ana-purple/50 transition-all cursor-pointer"
            onClick={() => handleLendingCardClick(option)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                {option.icon}
                <div className="bg-green-500/20 text-green-400 font-medium px-2 py-1 rounded text-sm">
                  {option.apy} APY
                </div>
              </div>
              <CardTitle className="text-white mt-3">{option.title}</CardTitle>
              <CardDescription className="text-white/70">{option.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-white/60">Loan-to-Value:</div>
                <div className="text-white text-right">{option.ltv}</div>
                
                <div className="text-white/60">Term:</div>
                <div className="text-white text-right">{option.term}</div>
              </div>
              
              <Button className="w-full mt-4">Get Started</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 p-6 bg-ana-darkblue/30 border border-ana-purple/20 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-3">Coming Soon: Cross-Chain DeFi</h3>
        <p className="text-white/70 mb-4">
          We're working on expanding our DeFi capabilities to include cross-chain bridges with Cardano, Ethereum, and other major networks.
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/60">Target Launch: Q2 2024</div>
          <Button variant="outline">Join Waitlist</Button>
        </div>
      </div>
    </div>
  );
};
