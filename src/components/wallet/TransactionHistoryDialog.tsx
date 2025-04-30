
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  type: string;
  asset: string;
  amount: string;
  value: string;
  timestamp: string;
}

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: Transaction[];
}

export const TransactionHistoryDialog: React.FC<TransactionHistoryDialogProps> = ({ 
  open, 
  onOpenChange, 
  transactions 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-ana-darkblue border-ana-purple/30 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
          <DialogDescription className="text-white/70">
            Your recent transactions on the AirNode Alliance network
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="border border-ana-purple/20 rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-ana-purple/20">
                <tr>
                  <th className="text-left p-3 text-sm font-medium">Type</th>
                  <th className="text-left p-3 text-sm font-medium">Asset</th>
                  <th className="text-left p-3 text-sm font-medium">Amount</th>
                  <th className="text-left p-3 text-sm font-medium">Value</th>
                  <th className="text-left p-3 text-sm font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-ana-purple/10 hover:bg-ana-purple/5">
                    <td className="p-3 text-sm">{tx.type}</td>
                    <td className="p-3 text-sm">{tx.asset}</td>
                    <td className="p-3 text-sm">{tx.amount}</td>
                    <td className="p-3 text-sm">{tx.value}</td>
                    <td className="p-3 text-sm">{tx.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
