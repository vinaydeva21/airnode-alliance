
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useWeb3 } from "@/contexts/Web3Context";

interface NetworkSelectorProps {
  className?: string;
  variant?: "default" | "minimal";
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({ 
  className = "",
  variant = "default"
}) => {
  const { switchToSepolia } = useWeb3();
  const [selectedNetwork, setSelectedNetwork] = useState("ethereum");

  const handleNetworkChange = async (value: string) => {
    setSelectedNetwork(value);
    
    if (value === "ethereum") {
      try {
        await switchToSepolia();
        toast.success("Switched to Ethereum Sepolia network");
      } catch (error) {
        console.error("Failed to switch network:", error);
        toast.error("Failed to switch to Ethereum network");
      }
    } else if (value === "cardano") {
      toast.info("Redirecting to Cardano network...");
      window.open("https://airnode-alliance.netlify.app/", "_blank");
    }
  };

  return (
    <Select value={selectedNetwork} onValueChange={handleNetworkChange}>
      <SelectTrigger 
        className={`${
          variant === "minimal" 
            ? "bg-transparent border-0 hover:bg-ana-purple/20 p-2" 
            : "bg-ana-darkblue/50 border-ana-purple/30 text-white w-full md:w-auto"
        } ${className}`}
      >
        <SelectValue placeholder="Select Network" />
      </SelectTrigger>
      <SelectContent className="bg-ana-darkblue border-ana-purple/30 text-white">
        <SelectItem value="ethereum" className="flex items-center gap-2 hover:bg-ana-purple/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#627EEA] flex items-center justify-center">
              <span className="text-white text-xs">Ξ</span>
            </div>
            Ethereum
          </div>
        </SelectItem>
        <SelectItem value="cardano" className="flex items-center gap-2 hover:bg-ana-purple/20">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[#0033AD] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 19.391c-3.8-.004-7.238-2.286-8.7-5.789c1.462-3.501 4.9-5.78 8.7-5.783c3.8.004 7.238 2.283 8.7 5.784C19.238 17.105 15.8 19.387 12 19.391z" />
              </svg>
            </div>
            Cardano
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default NetworkSelector;
