
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AirNode {
  name: string;
  shares: number;
  value: number;
  earnings: number;
  roi: number;
}

interface TokenBalances {
  ana: number;
  anaStaked: number;
  usdc: number;
}

interface MyAssetsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  airNodes: AirNode[];
  tokens: TokenBalances;
  totalValue: number;
  onStakeClick: () => void;
}

export const MyAssetsDialog: React.FC<MyAssetsDialogProps> = ({ 
  open, 
  onOpenChange, 
  airNodes, 
  tokens, 
  totalValue,
  onStakeClick
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-ana-darkblue border-ana-purple/30 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle>My Assets</DialogTitle>
          <DialogDescription className="text-white/70">
            View and manage your AirNode Alliance portfolio
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Card className="bg-ana-darkblue/30 border-ana-purple/20 p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-white/60 text-sm">Total Portfolio Value</h3>
                <div className="text-2xl font-bold text-white mt-1">${totalValue.toFixed(2)}</div>
              </div>
              <div>
                <h3 className="text-white/60 text-sm">Monthly Earnings</h3>
                <div className="text-2xl font-bold text-green-400 mt-1">$14.40</div>
              </div>
              <div>
                <h3 className="text-white/60 text-sm">Average ROI</h3>
                <div className="text-2xl font-bold text-white mt-1">20.2%</div>
              </div>
            </div>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-white mb-4">My AirNodes</h2>
              <Card className="bg-ana-darkblue/30 border-ana-purple/20 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-ana-purple/20">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium">Node</th>
                      <th className="text-center p-4 text-sm font-medium">Shares</th>
                      <th className="text-center p-4 text-sm font-medium">Value</th>
                      <th className="text-center p-4 text-sm font-medium">Monthly</th>
                      <th className="text-center p-4 text-sm font-medium">ROI</th>
                      <th className="text-right p-4 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {airNodes.map((node, idx) => (
                      <tr key={idx} className="border-t border-ana-purple/10">
                        <td className="p-4">{node.name}</td>
                        <td className="p-4 text-center">{node.shares}</td>
                        <td className="p-4 text-center">${node.value}</td>
                        <td className="p-4 text-center text-green-400">${node.earnings}</td>
                        <td className="p-4 text-center">{node.roi}%</td>
                        <td className="p-4 text-right">
                          <Button variant="outline" size="sm" className="mr-2">Sell</Button>
                          <Button size="sm">Collateralize</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Token Holdings</h2>
              <Card className="bg-ana-darkblue/30 border-ana-purple/20 p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-ana-purple/10">
                    <div>
                      <div className="text-lg font-medium text-white">ANA Token</div>
                      <div className="text-sm text-white/60">Available</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-white">{tokens.ana}</div>
                      <div className="text-sm text-white/60">${(tokens.ana * 0.52).toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-ana-purple/10">
                    <div>
                      <div className="text-lg font-medium text-white">ANA Staked</div>
                      <div className="text-sm text-white/60">Locked 90 days</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-white">{tokens.anaStaked}</div>
                      <div className="text-sm text-white/60">${(tokens.anaStaked * 0.52).toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-lg font-medium text-white">USDC</div>
                      <div className="text-sm text-white/60">Stablecoin</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-white">{tokens.usdc}</div>
                      <div className="text-sm text-white/60">${tokens.usdc}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <Button variant="outline" className="w-full" onClick={onStakeClick}>Stake ANA</Button>
                  <Button className="w-full">Claim Rewards</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
