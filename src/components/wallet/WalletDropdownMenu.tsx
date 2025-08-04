
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Coins, LogOut, ChevronDown, LockKeyhole, ShieldCheck, History } from "lucide-react";

interface WalletMenuProps {
  walletName: string;
  address: string;
  anaBalance: number;
  stakedAna: number;
  pendingRewards: number;
  votingPower: number;
  onDisconnect: () => void;
  onAssetsClick: () => void;
  onStakeClick: () => void;
  onHistoryClick: () => void;
}

export const WalletDropdownMenu: React.FC<WalletMenuProps> = ({
  walletName,
  address,
  anaBalance,
  stakedAna,
  pendingRewards,
  votingPower,
  onDisconnect,
  onAssetsClick,
  onStakeClick,
  onHistoryClick
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-ana-darkblue/50 border-green-500/30 text-white">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          {address}
          <ChevronDown size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-ana-darkblue border-ana-purple/30 text-white min-w-[240px]">
        <DropdownMenuLabel>{walletName}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-ana-purple/20" />
        
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex justify-between cursor-default">
            <span className="opacity-70">Address:</span> 
            <span>{address}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between cursor-default">
            <span className="opacity-70">Token Balance:</span> 
            <span>{anaBalance}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between cursor-default">
            <span className="opacity-70">Staked Tokens:</span> 
            <span>{stakedAna}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between cursor-default">
            <span className="opacity-70">Pending Rewards:</span> 
            <span className="text-green-400">{pendingRewards} USDC</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between cursor-default">
            <span className="opacity-70">Voting Power:</span> 
            <span>{votingPower}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-ana-purple/20" />
        
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={onAssetsClick}
            className="cursor-pointer hover:bg-ana-purple/20"
          >
            <Coins size={16} className="mr-2" />
            My Assets
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer hover:bg-ana-purple/20">
              <Coins size={16} className="mr-2" />
              Assets & DeFi
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-ana-darkblue border-ana-purple/30 text-white">
              <DropdownMenuItem 
                onClick={onStakeClick}
                className="cursor-pointer hover:bg-ana-purple/20"
              >
                <LockKeyhole size={16} className="mr-2" />
                Stake Tokens
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-ana-purple/20">
                <ShieldCheck size={16} className="mr-2" />
                Claim Rewards
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuItem 
            onClick={onHistoryClick}
            className="cursor-pointer hover:bg-ana-purple/20"
          >
            <History size={16} className="mr-2" />
            Transaction History
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-ana-purple/20" />
        
        <DropdownMenuItem
          onClick={onDisconnect}
          className="cursor-pointer hover:bg-red-500/20 text-red-400"
        >
          <LogOut size={16} className="mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
