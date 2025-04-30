
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TreasuryData } from "@/types/governance";

interface TreasuryTabProps {
  treasuryData: TreasuryData;
}

const TreasuryTab: React.FC<TreasuryTabProps> = ({ treasuryData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="glass-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Treasury Overview</CardTitle>
          <CardDescription className="text-white/70">
            Current balance and fund allocation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">${treasuryData.totalBalance.toLocaleString()}</h3>
            <p className="text-sm text-white/70">Total treasury balance</p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-white">Fund Allocation</h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">New AirNodes</span>
                  <span className="text-white">{treasuryData.allocation.newAirNodes}%</span>
                </div>
                <Progress value={treasuryData.allocation.newAirNodes} className="h-2 bg-ana-darkblue" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Rewards Distribution</span>
                  <span className="text-white">{treasuryData.allocation.rewards}%</span>
                </div>
                <Progress value={treasuryData.allocation.rewards} className="h-2 bg-ana-darkblue" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Operations</span>
                  <span className="text-white">{treasuryData.allocation.operations}%</span>
                </div>
                <Progress value={treasuryData.allocation.operations} className="h-2 bg-ana-darkblue" />
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Reserve</span>
                  <span className="text-white">{treasuryData.allocation.reserve}%</span>
                </div>
                <Progress value={treasuryData.allocation.reserve} className="h-2 bg-ana-darkblue" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {treasuryData.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex justify-between items-start pb-3 border-b border-ana-purple/20">
                <div>
                  <p className="text-white text-sm font-medium">{tx.description}</p>
                  <p className="text-white/50 text-xs">{tx.date}</p>
                </div>
                <span className={`font-mono ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TreasuryTab;
